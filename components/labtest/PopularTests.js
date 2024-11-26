import { motion } from 'framer-motion';
import styles from './PopularTests.module.css';

export default function PopularTests({ testData }) {
  if (!testData) return null;

  return (
    <section className={styles.popularTests}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{testData.title}</h2>
        <div className={styles.testGrid}>
          {testData.testCatIds.map((category, index) => (
            <motion.div
              key={category._id}
              className={styles.testCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className={styles.categoryName}>{category.name}</h3>
              <p className={styles.description}>{category.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}