import React from 'react';
import { Lock, Star, Trophy } from 'lucide-react';
import styles from './Academy.module.css';

const LessonCard = ({ title, desc, difficulty, locked = false, progress = 0 }: any) => (
    <div className={styles.lessonCard}>
        {locked && (
            <div className={styles.lockedOverlay}>
                <Lock size={32} />
                <span>Complete previous level</span>
            </div>
        )}
        <div className={styles.lessonImage}>
            <Trophy size={48} />
        </div>
        <div className={styles.lessonContent}>
            <h3 className={styles.lessonTitle}>{title}</h3>
            <p className={styles.lessonDesc}>{desc}</p>
            <div className={styles.lessonMeta}>
                <span className={`${styles.difficulty} ${styles[`difficulty${difficulty}`]}`}>
                    {difficulty}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={14} fill={progress === 100 ? "gold" : "none"} color={progress === 100 ? "gold" : "currentColor"} />
                    <span>{progress}%</span>
                </div>
            </div>
        </div>
    </div>
);

const Academy: React.FC = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Learning Academy</h1>
                    <p className={styles.subtitle}>Master Sign Language step by step</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>Level 3</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Beginner Signer</div>
                </div>
            </header>

            <div className={styles.progressContainer}>
                <span className={styles.progressLabel}>Total Progress</span>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '35%' }} />
                </div>
                <span>350 / 1000 XP</span>
            </div>

            <h2 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Basics</h2>
            <div className={styles.grid}>
                <LessonCard
                    title="The Alphabet"
                    desc="Learn A-Z hand signs"
                    difficulty="Easy"
                    progress={100}
                />
                <LessonCard
                    title="Numbers 1-10"
                    desc="Counting with your fingers"
                    difficulty="Easy"
                    progress={80}
                />
                <LessonCard
                    title="Common Greetings"
                    desc="Hello, Thank you, Nice to meet you"
                    difficulty="Easy"
                    progress={20}
                />
            </div>

            <h2 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Intermediate</h2>
            <div className={styles.grid}>
                <LessonCard
                    title="Family & Friends"
                    desc="Signs for family members"
                    difficulty="Medium"
                    locked
                />
                <LessonCard
                    title="Colors & Shapes"
                    desc="Describing objects"
                    difficulty="Medium"
                    locked
                />
                <LessonCard
                    title="Emotions"
                    desc="Expressing how you feel"
                    difficulty="Medium"
                    locked
                />
            </div>
        </div>
    );
};

export default Academy;
