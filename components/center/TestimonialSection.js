import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './TestimonialSection.module.css';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TestimonialSection = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handlePrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
  }, [testimonials.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    );
  }, [testimonials.length]);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    return `${Math.floor(diffDays / 365)} year${diffDays >= 730 ? 's' : ''} ago`;
  };

  return (
    <div 
      className={styles.testimonialSection}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className={styles.sectionTitle}>What Our Patients Say</h2>

      <div className={styles.testimonialCarousel}>
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={handlePrevious}
          aria-label="Previous testimonial"
        >
          <FaChevronLeft />
        </button>

        <div className={styles.testimonialWrapper}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${styles.testimonialCard} ${
                index === activeIndex ? styles.active : ''
              }`}
              aria-hidden={index !== activeIndex}
            >
              <div className={styles.quoteIcon}>
                <FaQuoteLeft />
              </div>

              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < testimonial.rating ? styles.starFilled : styles.starEmpty}
                  />
                ))}
              </div>

              <p className={styles.comment}>{testimonial.content}</p>

              <div className={styles.testimonialFooter}>
                <div className={styles.userInfo}>
                  <h4 className={styles.userName}>{testimonial.name}</h4>
                  <p className={styles.userLocation}>{testimonial.location}</p>
                </div>
                <span className={styles.date}>
                  {formatDate(testimonial.date)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className={styles.dots}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === activeIndex ? styles.activeDot : ''
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

TestimonialSection.propTypes = {
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      date: PropTypes.string,
      _id: PropTypes.string
    })
  ).isRequired
};

export default React.memo(TestimonialSection);