import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Heart, Brain, Lungs, Kidney, Activity, Droplets, 
         Pill, Bone, FlaskConical, Thermometer } from 'lucide-react';
import styles from './VitalBodyOrgans.module.css';

const defaultCategories = [
  {
    _id: '1',
    name: 'Heart',
    path: '/heart-tests',
    icon: Heart
  },
  {
    _id: '2',
    name: 'Brain',
    path: '/brain-tests',
    icon: Brain
  },
  {
    _id: '3',
    name: 'Blood',
    path: '/blood-tests',
    icon: Droplets
  },
  {
    _id: '4',
    name: 'Lungs',
    path: '/lung-tests',
    icon: Lungs
  },
  {
    _id: '5',
    name: 'Kidney',
    path: '/kidney-tests',
    icon: Kidney
  },
  {
    _id: '6',
    name: 'Vitamins',
    path: '/vitamin-tests',
    icon: Pill
  },
  {
    _id: '7',
    name: 'Bone',
    path: '/bone-tests',
    icon: Bone
  },
  {
    _id: '8',
    name: 'Thyroid',
    path: '/thyroid-tests',
    icon: Activity
  },
  {
    _id: '9',
    name: 'Diabetes',
    path: '/diabetes-tests',
    icon: FlaskConical
  },
  {
    _id: '10',
    name: 'Fever',
    path: '/fever-tests',
    icon: Thermometer
  }
];

export default function VitalBodyOrgans({ organsData }) {
  const router = useRouter();

  // Use actual data if available, otherwise use defaults
  const title = organsData?.vitalOrgans?.[0]?.title || 'Vital Body Organs';
  const description = organsData?.vitalOrgans?.[0]?.description || 
    'Explore our comprehensive range of diagnostic tests tailored for vital body organs. Our specialized tests focus on evaluating the well-being of essential body organs.';
  const categories = organsData?.vitalOrgans?.[0]?.all_test_categories?.length > 0
    ? organsData.vitalOrgans[0].all_test_categories
    : defaultCategories;

  const handleCategoryClick = (category) => {
    router.push(`/bangalore/${category.path}`);
  };

  const handleViewAllClick = () => {
    router.push('/bangalore/all-tests');
  };

  return (
    <section className={styles.vitalOrgans}>
      <div className={styles.content}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {description}
        </motion.p>
      </div>

      <motion.div
        className={styles.organsGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {categories.map((category) => (
          <motion.div
            key={category._id}
            className={styles.iconWrapper}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCategoryClick(category)}
          >
            <div className={styles.iconBackground}>
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  width={48}
                  height={48}
                  className={styles.icon}
                />
              ) : (
                <category.icon 
                  className={styles.icon} 
                  size={24}
                  strokeWidth={1.5}
                />
              )}
            </div>
            <span className={styles.categoryName}>{category.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}