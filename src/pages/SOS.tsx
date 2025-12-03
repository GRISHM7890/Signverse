import React, { useState } from 'react';
import { MapPin, PhoneCall, Hand } from 'lucide-react';
import styles from './SOS.module.css';

const SOS: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState("Monitoring for 'HELP' gesture...");

    const handleSOSClick = () => {
        setIsActive(true);
        setStatus("SENDING ALERT...");

        // Simulate API call
        setTimeout(() => {
            setStatus("ALERT SENT! HELP IS ON THE WAY.");
            setTimeout(() => setIsActive(false), 3000);
        }, 2000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.backgroundPulse} />

            <div className={styles.content}>
                <h1 className={styles.title}>Emergency Mode</h1>

                <button
                    className={`${styles.sosButton} ${isActive ? styles.sosButtonActive : ''}`}
                    onClick={handleSOSClick}
                >
                    SOS
                </button>

                <p className={styles.statusText} style={{ color: isActive ? 'var(--color-error)' : 'var(--color-text)' }}>
                    {status}
                </p>

                <div className={styles.instructions}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                        <Hand size={24} className={styles.gestureIcon} />
                        <span>Gesture Detection Active</span>
                    </div>
                    <p>Sign "HELP" or "EMERGENCY" to trigger automatically.</p>
                </div>

                <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)' }}>
                        <MapPin size={20} />
                        <span>Location Sharing On</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)' }}>
                        <PhoneCall size={20} />
                        <span>Auto-Dial Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SOS;
