import { useState, useEffect } from 'react';
import styles from './BannerCarousel.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';

const BannerCarousel = ({ banners = [] }) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Static route paths for each banner
  const bannerRoutes = [
    '/bangalore/lab-test/glycosylated-haemoglobin-hba1c-test',
    '/bangalore/lab-test/renal-function-test',
    '/bangalore/lab-test/kidney-function-test-kft',
    '/bangalore/lab-test/diabetes-test-dt',
    '/bangalore/lab-test/liver-function-test-lft'
  ].slice(0, banners.length); // Only use as many routes as there are banners

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBookNow = () => {
    router.push(bannerRoutes[currentSlide]);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.carouselContainer}>
        {/* Navigation Buttons */}
        <button onClick={prevSlide} className={`${styles.navButton} ${styles.prevButton}`}>
          <ChevronLeft className={styles.navIcon} />
        </button>
        <button onClick={nextSlide} className={`${styles.navButton} ${styles.nextButton}`}>
          <ChevronRight className={styles.navIcon} />
        </button>

        {/* Slides */}
        <div
          className={styles.sliderWrapper}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className={styles.slide}>
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className={styles.slideImage}
              />
              <div className={styles.overlay}>
                <button 
                  className={styles.bookButton}
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className={styles.pagination}>
          {banners.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;