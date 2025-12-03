import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mic, BookOpen, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.welcome}>Welcome back, User</h1>
                <p className={styles.subtitle}>Ready to break communication barriers today?</p>
            </header>

            <section>
                <div className={styles.grid}>
                    <Link to="/interpreter" className={styles.card}>
                        <div className={styles.cardIcon} style={{ color: 'var(--color-primary)' }}>
                            <Camera size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Real-Time Interpreter</h3>
                        <p className={styles.cardDesc}>Translate sign language to text and speech instantly using your camera.</p>
                    </Link>

                    <Link to="/avatar" className={styles.card}>
                        <div className={styles.cardIcon} style={{ color: 'var(--color-secondary)' }}>
                            <Mic size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Avatar Speak</h3>
                        <p className={styles.cardDesc}>Type or speak to see our 3D avatar sign it out for you.</p>
                    </Link>

                    <Link to="/learn" className={styles.card}>
                        <div className={styles.cardIcon} style={{ color: 'var(--color-success)' }}>
                            <BookOpen size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Learning Academy</h3>
                        <p className={styles.cardDesc}>Master new signs with gamified lessons and AI feedback.</p>
                    </Link>

                    <Link to="/sos" className={`${styles.card} ${styles.sosCard}`}>
                        <div className={styles.cardIcon} style={{ color: 'var(--color-error)' }}>
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className={styles.cardTitle} style={{ color: 'var(--color-error)' }}>Emergency SOS</h3>
                        <p className={styles.cardDesc}>Quickly signal for help with gesture-triggered alerts.</p>
                    </Link>
                </div>
            </section>

            <section>
                <h2 className={styles.sectionTitle}>
                    <Clock size={24} /> Recent Activity
                </h2>
                <div className={styles.historyList}>
                    <div className={styles.historyItem}>
                        <div className={styles.historyContent}>
                            <span className={styles.historyText}>Translated "Hello, how are you?"</span>
                            <span className={styles.historyMeta}>ISL → English • 2 mins ago</span>
                        </div>
                        <ArrowRight size={16} color="var(--color-text-muted)" />
                    </div>
                    <div className={styles.historyItem}>
                        <div className={styles.historyContent}>
                            <span className={styles.historyText}>Learned "Thank You"</span>
                            <span className={styles.historyMeta}>Academy • 1 hour ago</span>
                        </div>
                        <ArrowRight size={16} color="var(--color-text-muted)" />
                    </div>
                    <div className={styles.historyItem}>
                        <div className={styles.historyContent}>
                            <span className={styles.historyText}>Translated "Where is the hospital?"</span>
                            <span className={styles.historyMeta}>English → ISL (Avatar) • Yesterday</span>
                        </div>
                        <ArrowRight size={16} color="var(--color-text-muted)" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
