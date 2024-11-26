import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './BannerCarousel.module.css';

export default function BannerCarousel({ banners }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Guard clause for undefined or empty banners
  if (!banners || !Array.isArray(banners) || banners.length === 0) {
    return null;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className={styles.bannerCarousel}>
      <div className={styles.container}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className={styles.slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={banners[currentSlide]}
              alt={`Banner ${currentSlide + 1}`}
              width={1200}
              height={400}
              className={styles.bannerImage}
            />
          </motion.div>
        </AnimatePresence>
        <div className={styles.indicators}>
          {banners.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${currentSlide === index ? styles.active : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}