import React from 'react';
import { Eye, Target } from 'lucide-react';
import styles from './MissionVision.module.css';

const MissionVision = () => {
  return (
    <section className={styles.missionVisionSection}>
      <h2 className={styles.sectionTitle}>Mission & Vision</h2>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <Eye className={styles.icon} />
          </div>
          <h3>Vision</h3>
          <p>To help the entire medical fraternity in all areas of diagnostics with top-of-the-line equipment, the latest software, and the best radiological skills.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <Target className={styles.icon} />
          </div>
          <h3>Mission</h3>
          <p>To bring together advanced equipments, latest technology and the best professionals to deliver practical, cost-effective and accurate diagnostic services.</p>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;