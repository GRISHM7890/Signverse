import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import { Send, Loader2, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { translateTextToSigns } from '../services/gemini';
import type { SignGloss } from '../services/gemini';
import styles from './AvatarSpeak.module.css';
import * as THREE from 'three';

// --- Laser Hand Component ---
const LaserHand: React.FC<{
    handshape: string;
    side: "left" | "right";
    position?: string;
    palmOrientation?: string;
    fingerDirection?: string;
}> = ({ handshape, side, position, palmOrientation = "In", fingerDirection = "Up" }) => {
    const groupRef = useRef<THREE.Group>(null);
    const rotationRef = useRef<THREE.Group>(null);

    // Finger Refs for Rigging
    const thumbRef = useRef<THREE.Group>(null);
    const indexRef = useRef<THREE.Group>(null);
    const middleRef = useRef<THREE.Group>(null);
    const ringRef = useRef<THREE.Group>(null);
    const pinkyRef = useRef<THREE.Group>(null);

    const laserMaterial = new THREE.MeshStandardMaterial({
        color: "#00F0FF",
        emissive: "#00F0FF",
        emissiveIntensity: 2,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9
    });

    const jointMaterial = new THREE.MeshStandardMaterial({
        color: "#FFFFFF",
        emissive: "#FFFFFF",
        emissiveIntensity: 1,
        roughness: 0.1,
        metalness: 0.9
    });

    useFrame((state) => {
        if (groupRef.current) {
            // Floating animation
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;

            // Side-based positioning
            const xOffset = side === "right" ? 2 : -2;
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, xOffset, 0.1);

            // Basic position logic
            if (position?.toLowerCase().includes("chest")) {
                groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, 0.1);
            } else if (position?.toLowerCase().includes("head") || position?.toLowerCase().includes("forehead")) {
                groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 1.5, 0.1);
            } else {
                // Neutral
                groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
            }
        }

        // --- Orientation Logic ---
        if (rotationRef.current) {
            let targetRotX = 0;
            let targetRotY = 0;
            let targetRotZ = 0;

            const palm = palmOrientation.toLowerCase();
            const fingers = fingerDirection.toLowerCase();

            // Base rotation based on Palm Direction
            if (palm.includes("forward") || palm.includes("out")) {
                targetRotX = -Math.PI / 2; // Palm faces camera
            } else if (palm.includes("back") || palm.includes("in")) {
                targetRotX = Math.PI / 2; // Palm faces self
            } else if (palm.includes("up")) {
                targetRotX = 0; // Palm faces up (default-ish)
                targetRotZ = Math.PI;
            } else if (palm.includes("down")) {
                targetRotX = 0; // Palm faces down
            }

            // Adjust Z/Y based on Finger Direction
            // Note: This is a simplified mapping and might need tweaking for natural IK feel
            if (fingers.includes("up")) {
                // Default
            } else if (fingers.includes("down")) {
                targetRotZ += Math.PI;
            } else if (fingers.includes("left")) {
                targetRotZ += side === "right" ? Math.PI / 2 : -Math.PI / 2;
            } else if (fingers.includes("right")) {
                targetRotZ += side === "right" ? -Math.PI / 2 : Math.PI / 2;
            } else if (fingers.includes("forward")) {
                targetRotX -= Math.PI / 4;
            }

            // Apply smooth rotation
            rotationRef.current.rotation.x = THREE.MathUtils.lerp(rotationRef.current.rotation.x, targetRotX, 0.1);
            rotationRef.current.rotation.y = THREE.MathUtils.lerp(rotationRef.current.rotation.y, targetRotY, 0.1);
            rotationRef.current.rotation.z = THREE.MathUtils.lerp(rotationRef.current.rotation.z, targetRotZ, 0.1);
        }

        // --- Precision Rigging Logic ---
        const shape = handshape.toLowerCase();

        // Helper to rotate finger group
        const curlFinger = (ref: React.RefObject<THREE.Group | null>, curlAmount: number) => {
            if (ref.current) {
                ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, curlAmount, 0.1);
            }
        };

        // Handshape Definitions
        if (shape.includes("fist") || shape.includes("s") || shape.includes("a")) {
            curlFinger(thumbRef, 1.5);
            curlFinger(indexRef, 2.5);
            curlFinger(middleRef, 2.5);
            curlFinger(ringRef, 2.5);
            curlFinger(pinkyRef, 2.5);
        } else if (shape.includes("point") || shape.includes("d") || shape.includes("1")) {
            // Precision Point: Index perfectly straight, others tightly curled
            curlFinger(thumbRef, 1.5); // Thumb over fingers
            curlFinger(indexRef, 0);   // STRAIGHT
            curlFinger(middleRef, 2.8); // TIGHT CURL
            curlFinger(ringRef, 2.8);   // TIGHT CURL
            curlFinger(pinkyRef, 2.8);  // TIGHT CURL
        } else if (shape.includes("v") || shape.includes("2") || shape.includes("peace")) {
            curlFinger(thumbRef, 1.5);
            curlFinger(indexRef, 0);
            curlFinger(middleRef, 0);
            curlFinger(ringRef, 2.5);
            curlFinger(pinkyRef, 2.5);
        } else if (shape.includes("8") || shape.includes("hate")) {
            // Open 8 / Feel: Middle finger bent forward, others open
            curlFinger(thumbRef, 0.5);
            curlFinger(indexRef, 0.1);
            curlFinger(middleRef, 1.5); // Bent middle
            curlFinger(ringRef, 0.1);
            curlFinger(pinkyRef, 0.1);
        } else if (shape.includes("c")) {
            curlFinger(thumbRef, 0.5);
            curlFinger(indexRef, 1.0);
            curlFinger(middleRef, 1.0);
            curlFinger(ringRef, 1.0);
            curlFinger(pinkyRef, 1.0);
        } else if (shape.includes("none") || shape === "") {
            // Hide or drop hand
            if (groupRef.current) groupRef.current.position.y = -5;
        } else {
            // Default Open / Flat / B
            curlFinger(thumbRef, 0.5);
            curlFinger(indexRef, 0.1);
            curlFinger(middleRef, 0.1);
            curlFinger(ringRef, 0.1);
            curlFinger(pinkyRef, 0.1);
        }
    });

    // Finger Component
    const Finger = ({ position, scale, groupRef }: any) => (
        <group position={position} ref={groupRef}>
            {/* Proximal Phalanx */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.18 * scale, 0.6 * scale, 0.18 * scale]} />
                <primitive object={laserMaterial} />
            </mesh>
            {/* Joint */}
            <mesh position={[0, 0.65 * scale, 0]}>
                <sphereGeometry args={[0.12 * scale]} />
                <primitive object={jointMaterial} />
            </mesh>
            {/* Distal Phalanx (Visual only for now, moves with parent) */}
            <mesh position={[0, 1.0 * scale, 0]}>
                <boxGeometry args={[0.15 * scale, 0.5 * scale, 0.15 * scale]} />
                <primitive object={laserMaterial} />
            </mesh>
        </group>
    );

    // Mirroring for Left Hand
    const scaleX = side === "right" ? 1 : -1;

    return (
        <group ref={groupRef} scale={[scaleX, 1, 1]}>
            {/* Rotation Group for Orientation */}
            <group ref={rotationRef}>
                <Center>
                    {/* Palm */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.2, 1.4, 0.3]} />
                        <primitive object={laserMaterial} />
                    </mesh>

                    {/* Fingers (Positioned relative to Palm) */}
                    <Finger position={[0.5, 0.7, 0]} scale={1} groupRef={indexRef} />
                    <Finger position={[0, 0.8, 0]} scale={1.1} groupRef={middleRef} />
                    <Finger position={[-0.5, 0.7, 0]} scale={1} groupRef={ringRef} />
                    <Finger position={[-0.9, 0.5, 0]} scale={0.8} groupRef={pinkyRef} />

                    {/* Thumb (Rotated) */}
                    <group position={[0.7, -0.2, 0.2]} rotation={[0, 0, -0.8]} ref={thumbRef}>
                        <mesh position={[0, 0.3, 0]}>
                            <boxGeometry args={[0.2, 0.6, 0.2]} />
                            <primitive object={laserMaterial} />
                        </mesh>
                    </group>
                </Center>
            </group>
        </group>
    );
};

// --- Main Component ---
const AvatarSpeak: React.FC = () => {
    const [inputText, setInputText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [signSequence, setSignSequence] = useState<SignGloss[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        setIsProcessing(true);
        setIsAutoPlaying(false);
        setCurrentStep(0);
        setSignSequence([]);

        try {
            const glosses = await translateTextToSigns(inputText);
            setSignSequence(glosses);
            setCurrentStep(0);
        } catch (error) {
            console.error("Translation failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Auto-play Logic
    useEffect(() => {
        let interval: any;
        if (isAutoPlaying && signSequence.length > 0) {
            interval = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < signSequence.length - 1) {
                        return prev + 1;
                    } else {
                        setIsAutoPlaying(false);
                        return prev;
                    }
                });
            }, 2000); // 2 seconds per step
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, signSequence]);

    const nextStep = () => {
        if (currentStep < signSequence.length - 1) setCurrentStep(c => c + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
    };

    const togglePlay = () => {
        if (currentStep === signSequence.length - 1) setCurrentStep(0); // Restart if at end
        setIsAutoPlaying(!isAutoPlaying);
    };

    const currentGloss = signSequence.length > 0 ? signSequence[currentStep] : null;

    return (
        <div className={styles.container}>
            <div className={styles.avatarCanvas}>
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <color attach="background" args={['#050505']} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={2} color="#00F0FF" />

                    <LaserHand
                        side="right"
                        handshape={currentGloss?.rightHandshape || "Open"}
                        position={currentGloss?.rightPosition}
                        palmOrientation={currentGloss?.rightPalmOrientation}
                        fingerDirection={currentGloss?.rightFingerDirection}
                    />
                    <LaserHand
                        side="left"
                        handshape={currentGloss?.leftHandshape || "Open"}
                        position={currentGloss?.leftPosition}
                        palmOrientation={currentGloss?.leftPalmOrientation}
                        fingerDirection={currentGloss?.leftFingerDirection}
                    />

                    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
                </Canvas>

                {/* --- Step Overlay --- */}
                {currentGloss && (
                    <div className={styles.stepOverlay}>
                        <div className={styles.stepBadge}>STEP {currentStep + 1} / {signSequence.length}</div>
                        <h2>{currentGloss.gloss}</h2>
                        <p>{currentGloss.description}</p>
                        <div className={styles.stepDetails}>
                            <div className={styles.detailItem}>
                                <span>🖐️ R: {currentGloss.rightHandshape} | L: {currentGloss.leftHandshape}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span>🔄 {currentGloss.movement}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span>😊 {currentGloss.facialExpression}</span>
                            </div>
                        </div>
                    </div>
                )}</div>

            {/* Controls Area */}
            <div className={styles.controlPanel}>
                <div className={styles.playbackControls}>
                    <button onClick={prevStep} disabled={currentStep === 0} className={styles.iconBtn}>
                        <ChevronLeft size={24} />
                    </button>

                    <button onClick={togglePlay} className={`${styles.iconBtn} ${styles.playBtn} `}>
                        {isAutoPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>

                    <button onClick={nextStep} disabled={currentStep === signSequence.length - 1} className={styles.iconBtn}>
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        className={styles.textInput}
                        placeholder="Type a sentence..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        className={styles.sendBtn}
                        onClick={handleSend}
                        disabled={isProcessing || !inputText.trim()}
                    >
                        {isProcessing ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarSpeak;
