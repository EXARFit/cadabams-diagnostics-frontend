import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import styles from './TeamSection.module.css';
import ImageWrapper from './ImageWrapper';

const TeamSection = ({ team }) => {
  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleLinkedInClick = (url) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <div className={styles.teamSection}>
      <h2 className={styles.sectionTitle}>Meet Our Team</h2>
      <p className={styles.sectionDescription}>
        Our team of expert pathologists and technicians ensures accurate and reliable diagnostic services
      </p>

      <div className={styles.teamGrid}>
        {team.map((member, index) => (
          <div 
            key={member._id || index} 
            className={styles.teamCard}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.imageWrapper}>
            <ImageWrapper
  src={member.image}
  alt={member.name}
  width={200}
  height={200}
  className={styles.memberImage}
  defaultImage="/images/default-team-member.jpg"
/>
              <div className={styles.overlay}>
                <div className={styles.socialLinks}>
                  <button
                    onClick={() => handleLinkedInClick(member.linkedin)}
                    className={styles.socialLink}
                    aria-label={`Visit ${member.name}'s LinkedIn profile`}
                  >
                    <FaLinkedin />
                  </button>
                  <button
                    onClick={() => handleEmailClick(member.email)}
                    className={styles.socialLink}
                    aria-label={`Email ${member.name}`}
                  >
                    <FaEnvelope />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.memberInfo}>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.designation}</p>
              <p className={styles.qualification}>{member.qualification}</p>
              <p className={styles.experience}>{member.experience}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

TeamSection.propTypes = {
  team: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string.isRequired,
      designation: PropTypes.string.isRequired,
      qualification: PropTypes.string.isRequired,
      experience: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      email: PropTypes.string,
      linkedin: PropTypes.string
    })
  ).isRequired
};

export default React.memo(TeamSection);