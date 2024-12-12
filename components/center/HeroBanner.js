import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import styles from './HeroBanner.module.css';

const HeroBanner = ({ title, subtitle, image }) => {
  const [imageError, setImageError] = useState(false);
  
  const features = [
    {
      icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
      text: "NABL Accredited Lab"
    },
    {
      icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
      text: "60 Mins Collection"
    },
    {
      icon: "M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75",
      text: "Reports in 24 Hours"
    },
    {
      icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
      text: "Expert Team"
    }
  ];

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerContent}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>
            {title}
           </h1>
           {/* <h2 className={styles.highlight}>
           {subtitle}
           </h2> */}
          
          
          <div className={styles.features}>
            {features.map((feature, index) => (
              <div key={index} className={styles.feature}>
                <div className={styles.iconWrapper}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={styles.icon}
                  >
                    <path d={feature.icon} />
                  </svg>
                </div>
                <span className={styles.featureText}>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.imageWrapper}>
          {!imageError ? (
            <Image
              src={image}
              alt={title}
              width={500}
              height={300}
              className={styles.bannerImage}
              priority
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <Image
              src="/default-center-image.jpg" // Your fallback image
              alt={title}
              width={500}
              height={300}
              className={styles.bannerImage}
              priority
              unoptimized
            />
          )}
        </div>
      </div>
    </div>
  );
};

HeroBanner.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired
};

HeroBanner.defaultProps = {
  image: '/default-center-image.jpg' // Your fallback image
};

export default React.memo(HeroBanner);