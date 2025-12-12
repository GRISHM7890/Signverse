import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { KNNClassifier } from "./knnClassifier";

// Types
type GestureBuffer = NormalizedLandmark[][];

// Constants
const BUFFER_SIZE = 30; // Analyze last 30 frames (~1 second)
const STABILITY_THRESHOLD = 5; // Number of frames a sign must be held to be valid

// English to Marathi Mapping
const MARATHI_MAPPING: Record<string, string> = {
    'HELLO': 'नमस्कार',
    'YES': 'हो',
    'NO': 'नाही',
    'A': 'अ',
    'B': 'ब',
    'C': 'क',
    'D': 'ड',
    'E': 'इ',
    'F': 'फ',
    'I': 'आय',
    'K': 'क',
    'L': 'ल',
    'M': 'म',
    'N': 'न',
    'O': 'ओ',
    'R': 'र',
    'S': 'स',
    'T': 'त',
    'U': 'यू',
    'V': 'व',
    'W': 'व',
    'X': 'क्ष',
    'Y': 'य',
    'VICTORY': 'विजय',
    'I LOVE YOU': 'मी तुझ्यावर प्रेम करतो',
    'LOOK': 'पहा',
    'THUMBS UP': 'छान',
    'OK': 'ठीक आहे',
    'STOP': 'थांबा',
    'ROCK': 'रॉक',
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९'
};

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
                const translated = this.translateToMarathi(this.currentPrediction);
                this.lastSentence.push(translated);
                return translated;
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

    private translateToMarathi(english: string): string {
        return MARATHI_MAPPING[english] || english;
    }

    public getSentence(): string {
        return this.lastSentence.join(" ");
    }
}
