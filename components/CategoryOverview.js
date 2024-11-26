// CategoryOverview.js
import React from 'react';
import styles from './CategoryOverview.module.css';

const CATEGORY_IMAGES = {
  'ct-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732179902131-412645974.png",
  'mri-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732179954157-336998260.png",
  'msk-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732179990913-212865095.png",
  'ultrasound-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732180039295-322475488.png",
  'xray-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732180132539-627275886.png"
};

const DEFAULT_IMAGE = "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png";

const CategoryOverview = ({ category }) => {
  if (!category) return null;

  const {
    name = '',
    description = '',
    image = '',
    categoryType = ''
  } = category;

  // Determine which image to display
  const getDisplayImage = () => {
    // For debugging
    console.log('Category Type:', categoryType);
    
    // If it's a pregnancy scan, use the image from the API
    if (image && categoryType.toLowerCase().includes('pregnancy')) {
      return image;
    }
    
    // For other categories, use the exact mapping
    const categoryKey = categoryType.toLowerCase();
    console.log('Looking for category key:', categoryKey);
    console.log('Available categories:', Object.keys(CATEGORY_IMAGES));
    
    const selectedImage = CATEGORY_IMAGES[categoryKey];
    console.log('Selected Image:', selectedImage);
    
    return selectedImage || DEFAULT_IMAGE;
  };

  const displayImage = getDisplayImage();
  console.log('Final Display Image:', displayImage);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.leftContent}>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.subtitle}>Category Overview</p>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.rightContent}>
          <img
            src={displayImage}
            alt={name || "Lab Test"}
            className={styles.image}
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
              e.target.src = DEFAULT_IMAGE;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryOverview;