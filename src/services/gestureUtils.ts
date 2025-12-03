import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export const drawConnectors = (ctx: CanvasRenderingContext2D, landmarks: NormalizedLandmark[]) => {
    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [5, 9], [9, 13], [13, 17] // Palm
    ];

    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
        const p1 = landmarks[start];
        const p2 = landmarks[end];
        ctx.beginPath();
        ctx.moveTo(p1.x * ctx.canvas.width, p1.y * ctx.canvas.height);
        ctx.lineTo(p2.x * ctx.canvas.width, p2.y * ctx.canvas.height);
        ctx.stroke();
    });
};

export const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: NormalizedLandmark[]) => {
    ctx.fillStyle = "#7000FF";
    landmarks.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x * ctx.canvas.width, point.y * ctx.canvas.height, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
};

// Simple rule-based recognizer for demo purposes
// In production, this would be replaced by a TFLite model classifier
export const recognizeGesture = (landmarks: NormalizedLandmark[]): string | null => {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const thumbBase = landmarks[2];
    const indexBase = landmarks[5];
    const middleBase = landmarks[9];
    const ringBase = landmarks[13];
    const pinkyBase = landmarks[17];

    // Helper to check if finger is extended
    const isExtended = (tip: NormalizedLandmark, base: NormalizedLandmark) => tip.y < base.y;

    const indexExtended = isExtended(indexTip, indexBase);
    const middleExtended = isExtended(middleTip, middleBase);
    const ringExtended = isExtended(ringTip, ringBase);
    const pinkyExtended = isExtended(pinkyTip, pinkyBase);

    // Thumbs Up
    if (thumbTip.y < thumbBase.y && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        return "👍 Thumbs Up (YES)";
    }

    // Open Hand (Hello)
    if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
        return "👋 Hello / Stop";
    }

    // Peace / Victory
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
        return "✌️ Peace / Victory";
    }

    // Pointing
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        return "☝️ One / Look";
    }

    // Fist (Rock)
    if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        return "✊ Fist / Rock";
    }

    // I Love You (ASL)
    if (thumbTip.y < thumbBase.y && indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
        return "🤟 I Love You";
    }

    return null;
};
