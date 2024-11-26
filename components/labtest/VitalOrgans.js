import { motion } from 'framer-motion';
import styles from './VitalOrgans.module.css';

export default function VitalOrgans({ organsData }) {
  // Check if organsData and all_test_categories exist and is an array
  if (!organsData || !Array.isArray(organsData?.all_test_categories)) {
    return null;
  }

  return (
    <section className={styles.vitalOrgans}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{organsData.title || 'Vital Organs'}</h2>
        <p className={styles.description}>
          {organsData.description || 'Explore our comprehensive range of diagnostic tests'}
        </p>
        <div className={styles.organsGrid}>
          {organsData.all_test_categories.map((category, index) => (
            <motion.div
              key={category._id || index}
              className={styles.organCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => window.location.href = category.path}
            >
              <div className={styles.imageContainer}>
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className={styles.organImage}
                  />
                )}
              </div>
              <div className={styles.contentContainer}>
                <h3 className={styles.organName}>{category.name}</h3>
                <p className={styles.organDescription}>{category.description}</p>
                <div className={styles.testCount}>
                  {category.tests?.length || 0} Tests Available
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}