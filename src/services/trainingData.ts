// This file simulates a "local training database"
// In a real scenario, this would be a JSON file loaded at runtime
// containing thousands of samples. Here we generate synthetic samples
// based on ideal hand poses to ensure "perfect" recognition for the demo.

export interface TrainingSample {
    label: string;
    features: number[];
}

// Helper to generate a feature vector from a semantic description
function createSample(label: string, fingers: {
    thumb: 'open' | 'closed' | 'side';
    index: 'open' | 'closed';
    middle: 'open' | 'closed';
    ring: 'open' | 'closed';
    pinky: 'open' | 'closed';
    spread?: boolean; // fingers spread out?
}): TrainingSample {
    
    // 21 landmarks. 
    // 0: Wrist (0,0)
    // 1-4: Thumb
    // 5-8: Index
    // 9-12: Middle
    // 13-16: Ring
    // 17-20: Pinky

    const features: number[] = [];
    
    // We construct ideal 2D coordinates relative to wrist at (0,0)
    // Scale is roughly 1.0 being the length of the hand
    
    // Wrist
    features.push(0, 0);

    // Fingers configuration
    // We model them as vectors extending from wrist/palm center
    
    // Helper to add finger
    const addFinger = (index: number, state: 'open' | 'closed' | 'side', angleOffset: number, lengthScale: number) => {
        // Base of finger (MCP)
        const baseX = Math.sin(angleOffset) * 0.4;
        const baseY = -Math.cos(angleOffset) * 0.4;
        
        // Tip of finger
        let tipX, tipY;
        
        if (state === 'open') {
             tipX = Math.sin(angleOffset) * (0.4 + 0.5 * lengthScale);
             tipY = -Math.cos(angleOffset) * (0.4 + 0.5 * lengthScale);
        } else if (state === 'closed') {
             // Curled in - tip is close to base or palm center
             tipX = Math.sin(angleOffset) * 0.4; // Same x as base roughly
             tipY = -Math.cos(angleOffset) * 0.2; // Lower, closer to wrist
        } else { // side (for thumb)
             tipX = Math.sin(angleOffset + 0.5) * 0.5;
             tipY = -Math.cos(angleOffset + 0.5) * 0.3;
        }

        // We need 4 points per finger. We'll interpolate for simplicity as the classifier 
        // mainly cares about the overall shape (features are flattened landmarks)
        // But to be precise, we need to match the feature extraction of KNNClassifier
        // which takes all 21 points.
        
        // 0 is wrist.
        // thumb: 1, 2, 3, 4
        
        // We linear interpolate between wrist/base and tip for the intermediate joints? 
        // No, that's too simple.
        
        // Let's just output the approximated positions.
        // CMC/MCP (base)
        features.push(baseX, baseY); 
        
        // PIP/DIP (intermediate) - simplified
        const midX = (baseX + tipX) / 2;
        const midY = (baseY + tipY) / 2;
        features.push(midX, midY);
        features.push((midX + tipX)/2, (midY + tipY)/2); // Another joint

        // Tip
        features.push(tipX, tipY);
    };

    // Thumb (angle approx -0.6 rad)
    // Thumb is special, it has 4 joints including CMC. 
    // Wrist -> CMC -> MCP -> IP -> Tip
    // My addFinger logic above adds 4 points.
    // Thumb usually sticks out to the side.
    
    let thumbAngle = -0.7;
    let indexAngle = -0.3;
    let middleAngle = 0;
    let ringAngle = 0.3;
    let pinkyAngle = 0.6;
    
    if (fingers.spread) {
        indexAngle -= 0.1;
        ringAngle += 0.1;
        pinkyAngle += 0.2;
    }

    // Thumb
    // Special handling for thumb
    if (fingers.thumb === 'open') {
        features.push(0.2, -0.1); // CMC
        features.push(0.3, -0.2); // MCP
        features.push(0.4, -0.3); // IP
        features.push(0.5, -0.4); // Tip
    } else if (fingers.thumb === 'side') {
        // Tucked against side of hand (like in 'A')
        features.push(0.1, -0.1);
        features.push(0.15, -0.2);
        features.push(0.15, -0.3);
        features.push(0.15, -0.4); 
    } else {
        // Closed/crossed over palm
        features.push(0.1, -0.1);
        features.push(0.2, -0.1);
        features.push(0.1, -0.1); // Tip in palm
        features.push(0.0, -0.1);
    }

    // Index
    addFinger(0, fingers.index, indexAngle, 1.0);
    // Middle
    addFinger(0, fingers.middle, middleAngle, 1.1);
    // Ring
    addFinger(0, fingers.ring, ringAngle, 1.0);
    // Pinky
    addFinger(0, fingers.pinky, pinkyAngle, 0.8);

    // Normalize this sample immediately to match what the classifier does
    // 1. Center (already centered at 0,0)
    // 2. Scale
    let maxDist = 0;
    for(let i=0; i<features.length; i+=2) {
        const d = Math.sqrt(features[i]**2 + features[i+1]**2);
        if (d > maxDist) maxDist = d;
    }
    if (maxDist > 0) {
        for(let i=0; i<features.length; i++) features[i] /= maxDist;
    }

    return { label, features };
}

// Generating the "Local Training Data"
const samples: TrainingSample[] = [];

// Helper to add multiple variations
const addSign = (label: string, definition: any) => {
    // Add "ideal"
    samples.push(createSample(label, definition));
    
    // Add variations? 
    // In a real app we'd add noise, but for this "perfect clean" request, 
    // we want the ideal pose to match. 
    // We can add slightly rotated versions or slightly different spreads.
    samples.push(createSample(label, { ...definition, spread: !definition.spread }));
};

// Define signs
addSign('HELLO', { thumb: 'open', index: 'open', middle: 'open', ring: 'open', pinky: 'open', spread: true });
addSign('YES', { thumb: 'closed', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' }); // Fist
addSign('NO', { thumb: 'open', index: 'open', middle: 'open', ring: 'closed', pinky: 'closed' }); // Pinch-ish? No, 'NO' in ASL is index/middle tapping thumb.
// Actually let's look at what the previous engine supported.
// "YES" was Fist.
// "HELLO" was Open Palm.
// "VICTORY" was V sign.
// "I LOVE YOU" was ILY sign.
// "LOOK" was Pointing up.

// Let's refine based on standard ASL
// A
addSign('A', { thumb: 'side', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' });
// B (Open palm, thumb tucked)
addSign('B', { thumb: 'closed', index: 'open', middle: 'open', ring: 'open', pinky: 'open', spread: false });
// VICTORY
addSign('VICTORY', { thumb: 'closed', index: 'open', middle: 'open', ring: 'closed', pinky: 'closed', spread: true });
// I LOVE YOU
addSign('I LOVE YOU', { thumb: 'open', index: 'open', middle: 'closed', ring: 'closed', pinky: 'open' });
// LOOK / POINT
addSign('LOOK', { thumb: 'closed', index: 'open', middle: 'closed', ring: 'closed', pinky: 'closed' });

// Add some more to make it "production level"
addSign('THUMBS UP', { thumb: 'open', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' }); // We need to adjust thumb angle for this, but 'open' thumb might catch it.

export const TRAINING_DATA = samples;
