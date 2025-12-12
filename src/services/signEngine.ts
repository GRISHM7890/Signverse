import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { KNNClassifier } from "./knnClassifier";

// Types
type GestureBuffer = NormalizedLandmark[][];

// Constants
const BUFFER_SIZE = 30; // Analyze last 30 frames (~1 second)
const STABILITY_THRESHOLD = 5; // Number of frames a sign must be held to be valid

export class SignEngine {
    private buffer: GestureBuffer = [];
    private lastSentence: string[] = [];
    private lastWordTime: number = 0;
    private classifier: KNNClassifier;
    
    private currentPrediction: string | null = null;
    private predictionCount: number = 0;

    constructor() {
        this.classifier = new KNNClassifier();
    }

    public processFrame(landmarks: NormalizedLandmark[]): string | null {
        this.addToBuffer(landmarks);

        // 1. Static Pose Analysis (Instant)
        const staticPose = this.analyzeStaticPose(landmarks);

        // Stability Check
        if (staticPose === this.currentPrediction) {
            this.predictionCount++;
        } else {
            this.currentPrediction = staticPose;
            this.predictionCount = 1;
        }

        // 3. Sentence Construction Logic
        if (this.currentPrediction && this.predictionCount >= STABILITY_THRESHOLD) {
            const now = Date.now();
            // Debounce: Don't add same word within 1 second
            if (now - this.lastWordTime > 1000) {
                this.lastWordTime = now;
                return this.currentPrediction;
            }
        }

        return null;
    }

    private addToBuffer(landmarks: NormalizedLandmark[]) {
        this.buffer.push(landmarks);
        if (this.buffer.length > BUFFER_SIZE) {
            this.buffer.shift();
        }
    }

    private analyzeStaticPose(landmarks: NormalizedLandmark[]): string | null {
        return this.classifier.classify(landmarks);
    }

    public getSentence(): string {
        return this.lastSentence.join(" ");
    }
}
