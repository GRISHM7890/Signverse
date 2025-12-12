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
    thumb: 'open' | 'closed' | 'side' | 'up' | 'in';
    index: 'open' | 'closed' | 'hook';
    middle: 'open' | 'closed';
    ring: 'open' | 'closed';
    pinky: 'open' | 'closed';
    spread?: boolean; // fingers spread out?
}): TrainingSample {
    
    const features: number[] = [];
    
    // Wrist at 0,0
    features.push(0, 0);

    const addFinger = (state: 'open' | 'closed' | 'hook' | 'side' | 'up' | 'in', angleOffset: number, lengthScale: number) => {
        // Base of finger (MCP)
        const baseX = Math.sin(angleOffset) * 0.4;
        const baseY = -Math.cos(angleOffset) * 0.4;
        
        let tipX, tipY;
        
        if (state === 'open') {
             tipX = Math.sin(angleOffset) * (0.4 + 0.5 * lengthScale);
             tipY = -Math.cos(angleOffset) * (0.4 + 0.5 * lengthScale);
        } else if (state === 'closed') {
             tipX = Math.sin(angleOffset) * 0.4; 
             tipY = -Math.cos(angleOffset) * 0.2; 
        } else if (state === 'hook') {
             tipX = Math.sin(angleOffset) * 0.4;
             tipY = -Math.cos(angleOffset) * 0.4; // Tip touches base approx
        } else if (state === 'side') {
             tipX = Math.sin(angleOffset + 0.5) * 0.5;
             tipY = -Math.cos(angleOffset + 0.5) * 0.3;
        } else if (state === 'up') {
             tipX = Math.sin(angleOffset) * 0.5;
             tipY = -Math.cos(angleOffset) * 0.5;
        } else { // 'in' - thumb tucked in palm
             tipX = 0;
             tipY = -0.2;
        }

        // CMC/MCP (base)
        features.push(baseX, baseY); 
        
        // PIP/DIP (intermediate)
        const midX = (baseX + tipX) / 2;
        const midY = (baseY + tipY) / 2;
        features.push(midX, midY);
        features.push((midX + tipX)/2, (midY + tipY)/2);

        // Tip
        features.push(tipX, tipY);
    };
    
    let indexAngle = -0.3;
    let middleAngle = 0;
    let ringAngle = 0.3;
    let pinkyAngle = 0.6;
    
    if (fingers.spread) {
        indexAngle -= 0.15;
        ringAngle += 0.15;
        pinkyAngle += 0.3;
    }

    // Thumb Special Handling
    // Thumb usually at -0.7 rad or so
    if (fingers.thumb === 'open' || fingers.thumb === 'up') {
        // Thumb sticking up/out
        features.push(0.2, -0.1); 
        features.push(0.3, -0.2); 
        features.push(0.4, -0.3); 
        features.push(0.5, -0.4); 
    } else if (fingers.thumb === 'side') {
         // Thumb alongside index
        features.push(0.1, -0.2);
        features.push(0.1, -0.3);
        features.push(0.1, -0.4);
        features.push(0.1, -0.5); 
    } else { // closed/in
        features.push(0.1, -0.1);
        features.push(0.2, -0.1); // Folded over
        features.push(0.1, -0.1); 
        features.push(0.0, -0.1);
    }

    // Fingers
    addFinger(fingers.index, indexAngle, 1.0);
    addFinger(fingers.middle, middleAngle, 1.1);
    addFinger(fingers.ring, ringAngle, 1.0);
    addFinger(fingers.pinky, pinkyAngle, 0.8);

    // Normalize
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

const samples: TrainingSample[] = [];

const addSign = (label: string, definition: {
    thumb: 'open' | 'closed' | 'side' | 'up' | 'in';
    index: 'open' | 'closed' | 'hook';
    middle: 'open' | 'closed';
    ring: 'open' | 'closed';
    pinky: 'open' | 'closed';
    spread?: boolean;
}) => {
    samples.push(createSample(label, definition));
    // Add spread variation if not specified
    if (definition.spread === undefined) {
         samples.push(createSample(label, { ...definition, spread: true }));
         samples.push(createSample(label, { ...definition, spread: false }));
    }
};

// --- LARGE LIBRARY ---

// BASICS
addSign('HELLO', { thumb: 'in', index: 'open', middle: 'open', ring: 'open', pinky: 'open', spread: true }); // Palm
addSign('YES', { thumb: 'closed', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' }); // Fist (Simulated)
addSign('NO', { thumb: 'open', index: 'open', middle: 'open', ring: 'closed', pinky: 'closed' }); // Pseudo-pinch

// ALPHABET (ASL Static)
addSign('A', { thumb: 'side', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' });
addSign('B', { thumb: 'in', index: 'open', middle: 'open', ring: 'open', pinky: 'open', spread: false });
addSign('C', { thumb: 'open', index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook' }); // C shape
addSign('D', { thumb: 'closed', index: 'open', middle: 'closed', ring: 'closed', pinky: 'closed' }); // Point up with loop? No, D is index up, others looped.
addSign('E', { thumb: 'in', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' }); // E is curled fingers, thumb tucked under.
addSign('F', { thumb: 'closed', index: 'closed', middle: 'open', ring: 'open', pinky: 'open', spread: true }); // OK sign essentially
addSign('I', { thumb: 'closed', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'open' });
addSign('L', { thumb: 'open', index: 'open', middle: 'closed', ring: 'closed', pinky: 'closed' });
addSign('M', { thumb: 'in', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' }); // M is 3 fingers over thumb. Hard to distinguish from Fist in simple model.
addSign('N', { thumb: 'in', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' }); // N is 2 fingers.
addSign('O', { thumb: 'closed', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' }); // O is all touching thumb.
addSign('R', { thumb: 'closed', index: 'open', middle: 'open', ring: 'closed', pinky: 'closed' }); // Crossed fingers (simulated as both up)
addSign('S', { thumb: 'in', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' }); // Fist, thumb over fingers.
addSign('U', { thumb: 'closed', index: 'open', middle: 'open', ring: 'closed', pinky: 'closed', spread: false });
addSign('V', { thumb: 'closed', index: 'open', middle: 'open', ring: 'closed', pinky: 'closed', spread: true }); // Same as Victory
addSign('W', { thumb: 'closed', index: 'open', middle: 'open', ring: 'open', pinky: 'closed', spread: true });
addSign('Y', { thumb: 'open', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'open' });

// COMMON WORDS / PHRASES
addSign('VICTORY', { thumb: 'closed', index: 'open', middle: 'open', ring: 'closed', pinky: 'closed', spread: true });
addSign('I LOVE YOU', { thumb: 'open', index: 'open', middle: 'closed', ring: 'closed', pinky: 'open' });
addSign('LOOK', { thumb: 'closed', index: 'open', middle: 'closed', ring: 'closed', pinky: 'closed' }); // Pointing
addSign('THUMBS UP', { thumb: 'open', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' });
addSign('OK', { thumb: 'closed', index: 'closed', middle: 'open', ring: 'open', pinky: 'open', spread: true }); // F
addSign('STOP', { thumb: 'in', index: 'open', middle: 'open', ring: 'open', pinky: 'open', spread: true }); // Open palm
addSign('ROCK', { thumb: 'closed', index: 'open', middle: 'closed', ring: 'closed', pinky: 'open' });

export const TRAINING_DATA = samples;
