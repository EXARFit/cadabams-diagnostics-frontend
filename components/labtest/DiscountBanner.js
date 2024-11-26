import { motion } from 'framer-motion';
import styles from './DiscountBanner.module.css';

export default function DiscountBanner({ offer }) {
  if (!offer?.content) return null;

  return (
    <motion.section 
      className={styles.discountBanner}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <h2 className={styles.title}>{offer.content.title}</h2>
        <div className={styles.code}>{offer.content.code}</div>
      </div>
    </motion.section>
  );
}