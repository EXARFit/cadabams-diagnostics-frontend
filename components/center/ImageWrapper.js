// components/common/ImageWrapper.js
import React, { useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

const ImageWrapper = ({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false,
  defaultImage = 'https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1730005867395-757505894.webp'
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    if (!isError) {
      setImgSrc(defaultImage);
      setIsError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
      unoptimized={false}
      loading={priority ? "eager" : "lazy"}
    />
  );
};

ImageWrapper.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string,
  priority: PropTypes.bool,
  defaultImage: PropTypes.string
};

export default ImageWrapper;