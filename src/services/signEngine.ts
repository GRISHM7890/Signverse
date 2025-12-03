import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Types
type GestureBuffer = NormalizedLandmark[][];

// Constants
const BUFFER_SIZE = 30; // Analyze last 30 frames (~1 second)

export class SignEngine {
    private buffer: GestureBuffer = [];
    private lastSentence: string[] = [];
    private lastWordTime: number = 0;

    constructor() { }

    public processFrame(landmarks: NormalizedLandmark[]): string | null {
        this.addToBuffer(landmarks);

        // 1. Static Pose Analysis (Instant)
        const staticPose = this.analyzeStaticPose(landmarks);

        // 2. Dynamic Movement Analysis (Temporal)
        // const movement = this.analyzeMovement();

        // 3. Sentence Construction Logic
        if (staticPose) {
            const now = Date.now();
            // Debounce: Don't add same word within 1 second
            if (now - this.lastWordTime > 1000) {
                // Simple logic: If we hold a pose for X frames, it's a word
                // In a real Transformer, this is the Attention mechanism
                return staticPose;
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
        // Advanced geometric analysis
        const thumb = landmarks[4];
        const index = landmarks[8];

        // Helper: Calculate distance
        const dist = (p1: NormalizedLandmark, p2: NormalizedLandmark) =>
            Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

        // Helper: Is finger extended?
        const isExtended = (tipIdx: number, pipIdx: number) =>
            landmarks[tipIdx].y < landmarks[pipIdx].y;

        const indexExt = isExtended(8, 6);
        const middleExt = isExtended(12, 10);
        const ringExt = isExtended(16, 14);
        const pinkyExt = isExtended(20, 18);

        // "HELLO" / "STOP" (Open Palm)
        if (indexExt && middleExt && ringExt && pinkyExt && dist(thumb, index) > 0.1) {
            return "HELLO";
        }

        // "YES" (Fist with nodding motion - simplified to Fist for now)
        if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
            return "YES";
        }

        // "PEACE" / "VICTORY"
        if (indexExt && middleExt && !ringExt && !pinkyExt) {
            return "VICTORY";
        }

        // "I LOVE YOU"
        if (indexExt && !middleExt && !ringExt && pinkyExt) {
            return "I LOVE YOU";
        }

        // "POINT" / "LOOK"
        if (indexExt && !middleExt && !ringExt && !pinkyExt) {
            return "LOOK";
        }

        return null;
    }

    /*
  private analyzeMovement(): string | null {
    if (this.buffer.length < 5) return null;

    const current = this.buffer[this.buffer.length - 1][0]; // Wrist
    const prev = this.buffer[0][0]; // Wrist 30 frames ago

    const dx = current.x - prev.x;
    const dy = current.y - prev.y;

    if (Math.abs(dx) > 0.2) {
      return dx > 0 ? "MOVE_RIGHT" : "MOVE_LEFT";
    }
    if (Math.abs(dy) > 0.2) {
      return dy > 0 ? "MOVE_DOWN" : "MOVE_UP";
    }

    return null;
  }
  */

    public getSentence(): string {
        return this.lastSentence.join(" ");
    }
}
