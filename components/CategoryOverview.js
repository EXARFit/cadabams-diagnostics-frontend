// components/CategoryOverview.js
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import styles from './CategoryOverview.module.css';

const CATEGORY_IMAGES = {
  'ct-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732179902131-412645974.png",
  'mri-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732179954157-336998260.png",
  'msk-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732179990913-212865095.png",
  'ultrasound-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732180039295-322475488.png",
  'xray-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732180132539-627275886.png",
  'pregnancy-scan': "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png"
};

const DEFAULT_IMAGE = "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png";

const getLocationFromPath = (path) => {
  if (!path) return { name: 'near me', value: 'near-me' };
  
  const parts = path.split('/').filter(Boolean);
  
  // If path includes bangalore as the first part
  if (parts[0] === 'bangalore') {
    return { name: 'Bangalore', value: 'bangalore' };
  }
  
  return { name: 'near me', value: 'near-me' };
};

const formatCategoryName = (name, categoryType) => {
  const typeMap = {
    'ct-scan': 'CT',
    'mri-scan': 'MRI',
    'msk-scan': 'MSK',
    'ultrasound-scan': 'Ultrasound',
    'xray-scan': 'X-Ray',
    'pregnancy-scan': 'Pregnancy'
  };

  const baseType = typeMap[categoryType.toLowerCase()] || name;
  return `${baseType} Scans`;
};

const CategoryOverview = ({ category }) => {
  if (!category) return null;

  const router = useRouter();
  const currentLocation = getLocationFromPath(router.asPath);

  const {
    name = '',
    description = '',
    image = '',
    categoryType = ''
  } = category;

  const locationAwareTitle = useMemo(() => {
    const formattedName = formatCategoryName(name, categoryType);
    const locationText = currentLocation.value === 'near-me' 
      ? 'near me'
      : `in ${currentLocation.name}`;
    return `${formattedName} ${locationText}`;
  }, [name, categoryType, currentLocation]);

  const getDisplayImage = () => {
    if (image && categoryType.toLowerCase().includes('pregnancy')) {
      return image;
    }
    
    const categoryKey = categoryType.toLowerCase();
    const selectedImage = CATEGORY_IMAGES[categoryKey];
    
    return selectedImage || DEFAULT_IMAGE;
  };

  const displayImage = getDisplayImage();

  const locationAwareDescription = useMemo(() => {
    if (!description) return '';
    return currentLocation.value === 'near-me'
      ? description.replace(/Bangalore/g, 'near me')
      : description.replace(/Bangalore/g, currentLocation.name);
  }, [description, currentLocation]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.leftContent}>
          <h1 className={styles.title}>{locationAwareTitle}</h1>
          <p className={styles.subtitle}>Category Overview</p>
          <p className={styles.description}>{locationAwareDescription}</p>
        </div>
        <div className={styles.rightContent}>
          <img
            src={displayImage}
            alt={locationAwareTitle || "Lab Test"}
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