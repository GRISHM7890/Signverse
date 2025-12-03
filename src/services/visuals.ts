import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export const drawCyberOverlay = (ctx: CanvasRenderingContext2D, landmarks: NormalizedLandmark[]) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // 1. Draw Heatmap/Glow Effect at Palm Center
    const wrist = landmarks[0];
    const middleFingerBase = landmarks[9];
    const palmX = (wrist.x + middleFingerBase.x) / 2 * width;
    const palmY = (wrist.y + middleFingerBase.y) / 2 * height;

    const gradient = ctx.createRadialGradient(palmX, palmY, 0, palmX, palmY, 100);
    gradient.addColorStop(0, "rgba(0, 240, 255, 0.2)");
    gradient.addColorStop(1, "rgba(0, 240, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Connections with Neon Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00F0FF";
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [5, 9], [9, 13], [13, 17], [0, 17] // Palm
    ];

    ctx.beginPath();
    connections.forEach(([start, end]) => {
        const p1 = landmarks[start];
        const p2 = landmarks[end];
        ctx.moveTo(p1.x * width, p1.y * height);
        ctx.lineTo(p2.x * width, p2.y * height);
    });
    ctx.stroke();

    // 3. Draw Joints as Tech Nodes
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#FFFFFF";
    landmarks.forEach((point, index) => {
        // Skip intermediate joints for cleaner look, only draw tips and main joints
        if ([0, 4, 8, 12, 16, 20].includes(index)) {
            const x = point.x * width;
            const y = point.y * height;

            // Outer ring
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = "#7000FF";
            ctx.fill();

            // Inner dot
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
        }
    });
};
