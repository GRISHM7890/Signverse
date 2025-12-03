export type SignDefinition = {
    id: string;
    name: string;
    category: 'alphabet' | 'word' | 'phrase';
    description: string;
    // In a real ML model, these would be the tensor weights or HMM states
    // For this engine, we define key static poses that make up the sign
    requiredPoses: string[];
    duration?: number; // min frames
};

export const SIGN_DATABASE: SignDefinition[] = [
    // Alphabets
    { id: 'a', name: 'A', category: 'alphabet', description: 'Letter A', requiredPoses: ['fist_thumb_side'] },
    { id: 'b', name: 'B', category: 'alphabet', description: 'Letter B', requiredPoses: ['open_palm_thumb_in'] },

    // Words
    { id: 'hello', name: 'HELLO', category: 'word', description: 'Greeting', requiredPoses: ['open_palm', 'wave_right', 'wave_left'] },
    { id: 'yes', name: 'YES', category: 'word', description: 'Agreement', requiredPoses: ['fist', 'knocking_motion'] },
    { id: 'no', name: 'NO', category: 'word', description: 'Disagreement', requiredPoses: ['pinch_fingers'] },
    { id: 'thank_you', name: 'THANK YOU', category: 'word', description: 'Gratitude', requiredPoses: ['touch_chin', 'move_forward'] },
    { id: 'please', name: 'PLEASE', category: 'word', description: 'Polite request', requiredPoses: ['open_palm_chest_circle'] },

    // Emergency
    { id: 'help', name: 'HELP', category: 'word', description: 'Emergency', requiredPoses: ['fist_on_palm'] },
];
