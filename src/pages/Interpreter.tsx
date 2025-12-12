import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, RefreshCw, Settings, Volume2, Loader2, BrainCircuit } from 'lucide-react';
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { drawCyberOverlay } from '../services/visuals';
import { SignEngine } from '../services/signEngine';
import styles from './Interpreter.module.css';

const Interpreter: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMicOn, setIsMicOn] = useState(false);
    const [currentWord, setCurrentWord] = useState<string>("");
    const [sentence, setSentence] = useState<string[]>([]);
    const [isModelLoaded, setIsModelLoaded] = useState(false);

    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const signEngineRef = useRef<SignEngine>(new SignEngine());

    useEffect(() => {
        const loadModel = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                );

                handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 2,
                    minHandDetectionConfidence: 0.7,
                    minHandPresenceConfidence: 0.7,
                    minTrackingConfidence: 0.7
                });

                setIsModelLoaded(true);
                startCamera();
            } catch (error) {
                console.error("Error loading model:", error);
            }
        };

        loadModel();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.addEventListener("loadeddata", predictWebcam);
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        }
    };

    let lastVideoTime = -1;
    const predictWebcam = async () => {
        if (!handLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;

            const results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            if (results.landmarks) {
                // Draw all hands
                results.landmarks.forEach(landmarks => {
                    drawCyberOverlay(ctx, landmarks);
                });

                // Process only the first detected hand for sign recognition to avoid state conflict
                if (results.landmarks.length > 0) {
                    const primaryHand = results.landmarks[0];
                    const detectedSign = signEngineRef.current.processFrame(primaryHand);

                    if (detectedSign) {
                        setCurrentWord(detectedSign);
                        setSentence(prev => {
                            const lastWord = prev[prev.length - 1];
                            if (lastWord !== detectedSign) {
                                return [...prev, detectedSign];
                            }
                            return prev;
                        });
                    }
                }
            }
            ctx.restore();
        }

        requestAnimationFrame(predictWebcam);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.statusBadge}>
                    <BrainCircuit size={16} color="var(--color-primary)" />
                    <span>AI Engine: ACTIVE (Sequence Mode)</span>
                </div>
                <button className={styles.controlBtn} style={{ width: 40, height: 40 }}>
                    <Settings size={20} />
                </button>
            </header>

            <div className={styles.videoContainer}>
                {!isModelLoaded && (
                    <div style={{ position: 'absolute', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <Loader2 className="spin" size={48} color="var(--color-primary)" />
                        <span>Initializing Neural Network...</span>
                    </div>
                )}
                <video
                    ref={videoRef}
                    className={styles.videoFeed}
                    autoPlay
                    playsInline
                    muted
                />
                <canvas ref={canvasRef} className={styles.canvasOverlay} />
            </div>

            <div className={styles.transcriptionBox}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                    DETECTED SENTENCE:
                </div>
                <div className={styles.transcriptionText}>
                    {sentence.join(" ")} <span style={{ color: 'var(--color-primary)' }}>{currentWord}</span>
                    <span className="cursor-blink">|</span>
                </div>
            </div>

            <div className={styles.controls}>
                <button
                    className={styles.controlBtn}
                    onClick={() => setSentence([])}
                    title="Clear Sentence"
                >
                    <RefreshCw size={24} />
                </button>

                <button
                    className={`${styles.controlBtn} ${isMicOn ? styles.controlBtnActive : ''}`}
                    onClick={() => setIsMicOn(!isMicOn)}
                    title="Toggle Microphone"
                >
                    {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>

                <button
                    className={styles.controlBtn}
                    onClick={() => { }}
                    title="Speak Output"
                >
                    <Volume2 size={24} />
                </button>
            </div>
        </div>
    );
};

export default Interpreter;
