import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './FeatureSection.module.css';

export default function FeatureSection({ features }) {
  if (!features) return null;

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={feature._id}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={48}
                height={48}
                className={styles.icon}
              />
              <h3 className={styles.featureTitle}>{feature.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}