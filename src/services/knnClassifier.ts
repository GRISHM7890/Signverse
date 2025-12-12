import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { TRAINING_DATA, TrainingSample } from "./trainingData";

export class KNNClassifier {
    private k: number;
    private dataset: TrainingSample[];

    constructor(k: number = 3) {
        this.k = k;
        this.dataset = TRAINING_DATA;
    }

    public classify(landmarks: NormalizedLandmark[]): string | null {
        if (!landmarks || landmarks.length === 0) return null;

        const features = this.extractFeatures(landmarks);
        
        // specific logic for simple gestures that don't need KNN or can be pre-filtered
        // but for now, we rely on KNN.

        const neighbors = this.findNearestNeighbors(features);
        
        // Simple voting
        const counts: Record<string, number> = {};
        let maxCount = 0;
        let prediction = null;

        for (const neighbor of neighbors) {
            counts[neighbor.label] = (counts[neighbor.label] || 0) + 1;
            if (counts[neighbor.label] > maxCount) {
                maxCount = counts[neighbor.label];
                prediction = neighbor.label;
            }
        }

        // Confidence threshold could be added here
        // if (maxCount < this.k / 2) return null;

        // Check distance threshold to avoid false positives for unknown gestures
        if (neighbors[0].distance > 0.5) { // Threshold needs tuning
            return null;
        }

        return prediction;
    }

    private extractFeatures(landmarks: NormalizedLandmark[]): number[] {
        // 1. Center around wrist (landmark 0)
        const wrist = landmarks[0];
        const centered = landmarks.map(lm => ({
            x: lm.x - wrist.x,
            y: lm.y - wrist.y,
            z: lm.z // z is already relative in some models, but let's keep it centered if needed
        }));

        // 2. Scale normalization
        // Find max distance from wrist
        let maxDist = 0;
        for (const lm of centered) {
            const d = Math.sqrt(lm.x * lm.x + lm.y * lm.y);
            if (d > maxDist) maxDist = d;
        }
        
        // Avoid division by zero
        if (maxDist === 0) maxDist = 1;

        const normalized = centered.map(lm => ({
            x: lm.x / maxDist,
            y: lm.y / maxDist,
            z: lm.z // z might be different scale, but let's leave it for now or normalize it too if we used 3d distance
        }));

        // 3. Flatten to 1D array
        // We use all 21 landmarks * 2 dimensions (x, y) = 42 features.
        // We ignore Z for now as it can be less reliable depending on the model/camera, 
        // but MediaPipe hand landmarks are 3D. Let's stick to X, Y for robustness on 2D screens unless needed.
        // Actually, Z is important for some signs (like pointing at self). 
        // Let's use X and Y first for simplicity and robustness.
        const features: number[] = [];
        for (const lm of normalized) {
            features.push(lm.x);
            features.push(lm.y);
        }

        return features;
    }

    private findNearestNeighbors(features: number[]): { label: string, distance: number }[] {
        const distances = this.dataset.map(sample => {
            return {
                label: sample.label,
                distance: this.euclideanDistance(features, sample.features)
            };
        });

        distances.sort((a, b) => a.distance - b.distance);

        return distances.slice(0, this.k);
    }

    private euclideanDistance(a: number[], b: number[]): number {
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
            sum += (a[i] - b[i]) ** 2;
        }
        return Math.sqrt(sum);
    }
}
