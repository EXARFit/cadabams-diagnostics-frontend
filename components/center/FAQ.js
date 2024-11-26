import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './FAQ.module.css';

const FAQ = ({ faq }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Handle keyboard accessibility
  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleAccordion(index);
    }
  };

  return (
    <div className={styles.faqSection}>
      <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
      
      <div className={styles.faqContainer}>
        {faq.map((item, index) => {
          const isActive = activeIndex === index;
          
          return (
            <div 
              key={index}
              className={`${styles.faqItem} ${isActive ? styles.active : ''}`}
            >
              <button
                className={styles.questionButton}
                onClick={() => toggleAccordion(index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                aria-expanded={isActive}
                aria-controls={`faq-answer-${index}`}
              >
                <span className={styles.questionText}>{item.question}</span>
                {isActive ? (
                  <FaChevronUp className={styles.icon} aria-hidden="true" />
                ) : (
                  <FaChevronDown className={styles.icon} aria-hidden="true" />
                )}
              </button>

              <div 
                id={`faq-answer-${index}`}
                className={styles.answerContainer}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                hidden={!isActive}
              >
                <div className={styles.answer}>
                  {item.answer.split('\n').map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

FAQ.propTypes = {
  faq: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
      _id: PropTypes.string
    })
  ).isRequired
};

export default React.memo(FAQ);