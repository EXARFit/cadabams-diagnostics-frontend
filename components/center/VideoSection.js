import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './VideoSection.module.css';
import { FaPlay, FaTimes } from 'react-icons/fa';

const VideoSection = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState(null);

  const getYoutubeId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : url.split('/').pop();
  };

  const videoList = [
    {
      id: 'overview',
      ...videos.overview,
      youtubeId: getYoutubeId(videos.overview.url)
    },
    {
      id: 'testing_process',
      ...videos.testing_process,
      youtubeId: getYoutubeId(videos.testing_process.url)
    },
    {
      id: 'testimonials',
      ...videos.testimonials,
      youtubeId: getYoutubeId(videos.testimonials.url)
    }
  ];

  const handleVideoClick = (video) => {
    setActiveVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveVideo(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className={styles.videoSection}>
      <h2 className={styles.sectionTitle}>Video Gallery</h2>
      <p className={styles.sectionDescription}>
      Experience over 32 years of trusted care with advanced imaging and compassionate service, now near you.      </p>

      <div className={styles.videoGrid}>
        {videoList.map((video) => (
          <div key={video.id} className={styles.videoCard}>
            <div
              className={styles.thumbnailWrapper}
              onClick={() => handleVideoClick(video)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleVideoClick(video)}
            >
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.description.split('\n')[0]}
                className={styles.thumbnail}
              />
              <div className={styles.playButton}>
                <FaPlay />
              </div>
            </div>
            <h3 className={styles.videoTitle}>{video.description.split('\n')[0]}</h3>
            <p className={styles.videoDescription}>
              {video.description.split('\n')[1]}
            </p>
          </div>
        ))}
      </div>

      {activeVideo && (
        <div 
          className={styles.videoModal} 
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className={styles.modalContent} 
            onClick={e => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Close video"
            >
              <FaTimes />
            </button>
            <div className={styles.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.description.split('\n')[0]}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.videoFrame}
              />
            </div>
            <h3 className={styles.modalTitle}>
              {activeVideo.description.split('\n')[0]}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

VideoSection.propTypes = {
  videos: PropTypes.shape({
    overview: PropTypes.shape({
      url: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    }).isRequired,
    testing_process: PropTypes.shape({
      url: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    }).isRequired,
    testimonials: PropTypes.shape({
      url: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default React.memo(VideoSection);
