import React, { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './CenterPage.module.css';
import PropTypes from 'prop-types'; 

// Import components
import HeroBanner from '@/components/center/HeroBanner';
import Breadcrumb from '@/components/center/BreadCrumb';
import BookingForm from '@/components/center/BookingForm';
import CenterServices from '@/components/center/CenterServices';
import CenterGallery from '@/components/center/CenterGallery';
import VideoSection from '@/components/center/VideoSection';
import FAQ from '@/components/center/FAQ';
import CenterInfo from '@/components/center/CenterInfo';
import TestimonialSection from '@/components/center/TestimonialSection';
import TeamSection from '@/components/center/TeamSection';
import OtherCenters from '@/components/center/OtherCenters';
import BlogSection from '@/components/center/BlogSection';


const CenterPage = ({ centerData }) => {
    // Add null check for centerData
    if (!centerData) {
      return (
        <div className={styles.loadingContainer}>
          <p>Loading center information...</p>
        </div>
      );
    }
  
    // Safely destructure with default values
    const {
      basic_info = {},
      center_info = {},
      services = [],
      gallery = {},
      video_gallery = {},
      faq = [],
      testimonials = [],
      team = [],
      other_centers = [],
      health_insights = [],
      working_hours = {
        weekdays: { start: '09:00', end: '18:00' },
        sunday: { start: '09:00', end: '18:00' }
      }
    } = centerData;
  
    return (
      <div className={styles.pageContainer}>
        <div className={styles.mainContent}>
          {/* Only render Breadcrumb if location and city are available */}
          {basic_info.location && basic_info.city && (
            <Breadcrumb 
              location={basic_info.location} 
              city={basic_info.city} 
            />
          )}
  
          {/* Only render HeroBanner if required props are available */}
          {basic_info.center_name && (
            <HeroBanner 
              title={basic_info.center_name}
              subtitle={basic_info.center_sub_title || ''}
              image={basic_info.center_image || '/default-center-image.jpg'}
            />
          )}
  
          <div className={styles.contentWrapper}>
            {/* Main Content */}
            <div className={styles.leftContent}>
              {basic_info.center_name && (
                <section className={styles.section}>
                  <h1 className={styles.mainHeading}>
                    {basic_info.center_name}
                  </h1>
                  {basic_info.center_description && (
                    <div className={styles.description}>
                      {basic_info.center_description.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </section>
              )}
  
              {/* Only render components if their required data is available */}
              {services.length > 0 && (
                <CenterServices services={services} />
              )}
  
              {gallery && Object.keys(gallery).length > 0 && (
                <CenterGallery gallery={gallery} />
              )}
  
              {video_gallery && Object.keys(video_gallery).length > 0 && (
                <VideoSection videos={video_gallery} />
              )}
  
              {center_info && Object.keys(center_info).length > 0 && (
                <CenterInfo 
                  info={center_info}
                  workingHours={working_hours}
                />
              )}
  
              {testimonials.length > 0 && (
                <TestimonialSection testimonials={testimonials} />
              )}
  
              {team.length > 0 && (
                <TeamSection team={team} />
              )}
  
              {other_centers.length > 0 && (
                <OtherCenters centers={other_centers} />
              )}
  
              {health_insights.length > 0 && (
                <BlogSection insights={health_insights} />
              )}
  
              {faq.length > 0 && (
                <FAQ faq={faq} />
              )}
            </div>
  
            {/* Sidebar */}
            <div className={styles.rightSidebar}>
              {center_info && working_hours && (
                <div className={styles.stickyWrapper}>
                  <BookingForm 
                    centerInfo={center_info}
                    workingHours={working_hours}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  CenterPage.propTypes = {
    centerData: PropTypes.shape({
      basic_info: PropTypes.shape({
        center_name: PropTypes.string,
        center_description: PropTypes.string,
        center_image: PropTypes.string,
        center_sub_title: PropTypes.string,
        location: PropTypes.string,
        city: PropTypes.string,
        area: PropTypes.string
      }),
      center_info: PropTypes.object,
      services: PropTypes.array,
      gallery: PropTypes.object,
      video_gallery: PropTypes.object,
      faq: PropTypes.array,
      testimonials: PropTypes.array,
      team: PropTypes.array,
      other_centers: PropTypes.array,
      health_insights: PropTypes.array,
      working_hours: PropTypes.object
    })
  };
  
  CenterPage.defaultProps = {
    centerData: {
      basic_info: {},
      center_info: {},
      services: [],
      gallery: {},
      video_gallery: {},
      faq: [],
      testimonials: [],
      team: [],
      other_centers: [],
      health_insights: [],
      working_hours: {
        weekdays: { start: '09:00', end: '18:00' },
        sunday: { start: '09:00', end: '18:00' }
      }
    }
  };
  
  export default React.memo(CenterPage);