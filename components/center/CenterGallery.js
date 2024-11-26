import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import styles from './CenterGallery.module.css';

const CenterGallery = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageError, setImageError] = useState({});

  const defaultImage = '/default-gallery-image.jpg'; // Add a default image to your public folder

  const galleryImages = [
    {
      src: gallery.reception || defaultImage,
      alt: "Reception Area",
      title: "Modern Reception"
    },
    {
      src: gallery.collection_room || defaultImage,
      alt: "Sample Collection Room",
      title: "Collection Room"
    },
    {
      src: gallery.lab_equipment || defaultImage,
      alt: "Laboratory Equipment",
      title: "Advanced Equipment"
    },
    {
      src: gallery.waiting_area || defaultImage,
      alt: "Waiting Area",
      title: "Comfortable Waiting Area"
    }
  ].filter(img => img.src); // Filter out any undefined sources

  const handleImageError = (index) => {
    setImageError(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const openModal = useCallback((index) => {
    setSelectedImage(galleryImages[index]);
    setActiveIndex(index);
    document.body.style.overflow = 'hidden';
  }, [galleryImages]);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

  const navigateImage = useCallback((direction) => {
    const newIndex = direction === 'next'
      ? (activeIndex + 1) % galleryImages.length
      : (activeIndex - 1 + galleryImages.length) % galleryImages.length;
    
    setActiveIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  }, [activeIndex, galleryImages]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'Escape':
          closeModal();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, navigateImage, closeModal]);

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <div className={styles.gallerySection}>
      <h2 className={styles.sectionTitle}>Center Gallery</h2>
      <p className={styles.sectionDescription}>
        Take a virtual tour of our state-of-the-art diagnostic center
      </p>

      <div className={styles.galleryGrid}>
        {galleryImages.map((image, index) => (
          <div 
            key={index} 
            className={styles.galleryItem}
            onClick={() => openModal(index)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && openModal(index)}
          >
            {!imageError[index] ? (
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={300}
                className={styles.galleryImage}
                onError={() => handleImageError(index)}
                priority={index === 0}
                unoptimized
              />
            ) : (
              <Image
                src={defaultImage}
                alt={image.alt}
                width={400}
                height={300}
                className={styles.galleryImage}
                priority={index === 0}
                unoptimized
              />
            )}
            <div className={styles.imageOverlay}>
              <span className={styles.imageTitle}>{image.title}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className={styles.modal} 
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Image Gallery Modal"
        >
          <div 
            className={styles.modalContent} 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className={styles.closeButton} 
              onClick={closeModal}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
            
            <div className={styles.modalImageWrapper}>
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={800}
                height={600}
                className={styles.modalImage}
                priority
                unoptimized
              />
            </div>

            <button 
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={() => navigateImage('prev')}
              aria-label="Previous image"
            >
              <FaArrowLeft />
            </button>
            
            <button 
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={() => navigateImage('next')}
              aria-label="Next image"
            >
              <FaArrowRight />
            </button>

            <div className={styles.modalCaption}>
              {selectedImage.title}
            </div>

            <div className={styles.imageCounter}>
              {activeIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CenterGallery.propTypes = {
  gallery: PropTypes.shape({
    reception: PropTypes.string,
    collection_room: PropTypes.string,
    lab_equipment: PropTypes.string,
    waiting_area: PropTypes.string
  }).isRequired
};

export default React.memo(CenterGallery);