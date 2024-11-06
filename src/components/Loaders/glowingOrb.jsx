import React from 'react';
import styles from './styles/orb.module.css';

export default function GlowingOrbLoader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.glowingOrbLoader}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
        <div className={`${styles.orb} ${styles.orb3}`}></div>
        <div className={`${styles.orb} ${styles.orb4}`}></div>
      </div>
    </div>
  );
}
