// File: CenterPage.js
import React from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

// Safe dynamic imports with fallbacks for all components
const HeroBanner = dynamic(() => 
  import('@/components/center/HeroBanner').catch(() => ({ 
    default: ({ title, subtitle, image }) => (
      <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
        <h1 style={{ fontSize: '2.5em', marginBottom: '10px', color: '#2c3e50' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '1.2em', color: '#7f8c8d' }}>{subtitle}</p>}
      </div>
    )
  })), 
  { ssr: false }
);

const Breadcrumb = dynamic(() => 
  import('@/components/center/BreadCrumb').catch(() => ({ 
    default: ({ location, city }) => (
      <nav style={{ padding: '10px 20px', fontSize: '14px', color: '#7f8c8d' }}>
        <a href="/" style={{ textDecoration: 'none', color: '#3498db' }}>Home</a>
        {' > '}
        <a href="/bangalore" style={{ textDecoration: 'none', color: '#3498db' }}>{city}</a>
        {' > '}
        <span>{location}</span>
      </nav>
    )
  })), 
  { ssr: false }
);

const BookingForm = dynamic(() => 
  import('@/components/center/BookingForm').catch(() => ({ 
    default: ({ centerInfo, workingHours }) => (
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#2980b9' }}>Book Appointment</h3>
        {centerInfo?.phone && (
          <div style={{ marginBottom: '10px' }}>
            <strong>Call:</strong>
            <br />
            <a href={`tel:${centerInfo.phone}`} style={{ 
              color: '#27ae60', 
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              {centerInfo.phone}
            </a>
          </div>
        )}
        {centerInfo?.whatsapp && (
          <div style={{ marginBottom: '15px' }}>
            <a 
              href={`https://wa.me/${centerInfo.whatsapp.replace(/[^0-9]/g, '')}`}
              style={{ 
                display: 'inline-block',
                backgroundColor: '#25d366',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '5px',
                textDecoration: 'none',
                width: '100%',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              📱 WhatsApp
            </a>
          </div>
        )}
        {workingHours && (
          <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
            <strong>Hours:</strong><br />
            {workingHours.weekdays && `Mon-Sat: ${workingHours.weekdays.start}-${workingHours.weekdays.end}`}<br />
            {workingHours.sunday && `Sun: ${workingHours.sunday.start}-${workingHours.sunday.end}`}
          </div>
        )}
      </div>
    )
  })), 
  { ssr: false }
);

const CenterServices = dynamic(() => 
  import('@/components/center/CenterServices').catch(() => ({ 
    default: ({ services }) => (
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '2em', 
          marginBottom: '20px', 
          color: '#2c3e50',
          borderBottom: '2px solid #3498db',
          paddingBottom: '10px'
        }}>
          Our Services
        </h2>
        <div style={{ display: 'grid', gap: '20px' }}>
          {services.map((service, index) => (
            <div key={service._id || index} style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e1e8ed'
            }}>
              <h3 style={{ color: '#2980b9', marginBottom: '10px' }}>
                {service.title}
              </h3>
              {service.description && (
                <p style={{ color: '#7f8c8d', marginBottom: '15px', lineHeight: '1.6' }}>
                  {service.description}
                </p>
              )}
              {service.tests && service.tests.length > 0 && (
                <div>
                  <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Available Tests:</h4>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '8px'
                  }}>
                    {service.tests.map((test, testIndex) => (
                      <li key={testIndex} style={{
                        padding: '8px 12px',
                        backgroundColor: '#ecf0f1',
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: '#2c3e50'
                      }}>
                        ✓ {test}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  })), 
  { ssr: false }
);

const CenterGallery = dynamic(() => 
  import('@/components/center/CenterGallery').catch(() => ({ 
    default: ({ gallery }) => {
      const images = Object.entries(gallery || {}).filter(([key, value]) => value);
      if (images.length === 0) return null;
      
      return (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '2em', 
            marginBottom: '20px', 
            color: '#2c3e50',
            borderBottom: '2px solid #3498db',
            paddingBottom: '10px'
          }}>
            Gallery
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '15px' 
          }}>
            {images.map(([key, value]) => (
              <div key={key} style={{
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={value} 
                  alt={key.replace('_', ' ')} 
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: 'white',
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}>
                  {key.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  })), 
  { ssr: false }
);

const VideoSection = dynamic(() => 
  import('@/components/center/VideoSection').catch(() => ({ 
    default: ({ videos }) => {
      const videoEntries = Object.entries(videos || {}).filter(([key, value]) => value?.url);
      if (videoEntries.length === 0) return null;
      
      return (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '2em', 
            marginBottom: '20px', 
            color: '#2c3e50',
            borderBottom: '2px solid #3498db',
            paddingBottom: '10px'
          }}>
            Videos
          </h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            {videoEntries.map(([key, value]) => (
              <div key={key} style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
                  {key.replace('_', ' ')}
                </h3>
                {value.description && (
                  <p style={{ marginBottom: '15px', color: '#7f8c8d' }}>
                    {value.description}
                  </p>
                )}
                <a 
                  href={value.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    textDecoration: 'none'
                  }}
                >
                  ▶️ Watch Video
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    }
  })), 
  { ssr: false }
);

const FAQ = dynamic(() => 
  import('@/components/center/FAQ').catch(() => ({ 
    default: ({ faq }) => (
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '2em', 
          marginBottom: '20px', 
          color: '#2c3e50',
          borderBottom: '2px solid #3498db',
          paddingBottom: '10px'
        }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {faq.map((faqItem, index) => (
            <details key={faqItem._id || index} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e1e8ed'
            }}>
              <summary style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#2980b9',
                cursor: 'pointer',
                marginBottom: '10px'
              }}>
                {faqItem.question}
              </summary>
              <div 
                style={{ color: '#2c3e50', lineHeight: '1.6', marginTop: '10px' }}
                dangerouslySetInnerHTML={{ __html: faqItem.answer || '' }}
              />
            </details>
          ))}
        </div>
      </div>
    )
  })), 
  { ssr: false }
);

const CenterInfo = dynamic(() => 
  import('@/components/center/CenterInfo').catch(() => ({ 
    default: ({ info, workingHours }) => (
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '2em', 
          marginBottom: '20px', 
          color: '#2c3e50',
          borderBottom: '2px solid #3498db',
          paddingBottom: '10px'
        }}>
          Contact Information
        </h2>
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {info.address && (
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#2c3e50' }}>📍 Address:</strong>
              <p style={{ margin: '5px 0', color: '#7f8c8d' }}>{info.address}</p>
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            {info.phone && (
              <div>
                <strong style={{ color: '#2c3e50' }}>📞 Phone:</strong>
                <br />
                <a href={`tel:${info.phone}`} style={{ color: '#27ae60', textDecoration: 'none' }}>
                  {info.phone}
                </a>
              </div>
            )}
            
            {info.whatsapp && (
              <div>
                <strong style={{ color: '#2c3e50' }}>💬 WhatsApp:</strong>
                <br />
                <a href={`https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}`} style={{ color: '#25d366', textDecoration: 'none' }}>
                  {info.whatsapp}
                </a>
              </div>
            )}
            
            {info.email && (
              <div>
                <strong style={{ color: '#2c3e50' }}>✉️ Email:</strong>
                <br />
                <a href={`mailto:${info.email}`} style={{ color: '#3498db', textDecoration: 'none' }}>
                  {info.email}
                </a>
              </div>
            )}
          </div>
          
          {workingHours && (workingHours.weekdays || workingHours.sunday) && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '5px' }}>
              <strong style={{ color: '#2c3e50' }}>🕒 Working Hours:</strong>
              <div style={{ marginTop: '8px' }}>
                {workingHours.weekdays && (
                  <div>
                    <span style={{ fontWeight: 'bold' }}>Monday - Saturday:</span> {workingHours.weekdays.start} - {workingHours.weekdays.end}
                  </div>
                )}
                {workingHours.sunday && (
                  <div>
                    <span style={{ fontWeight: 'bold' }}>Sunday:</span> {workingHours.sunday.start} - {workingHours.sunday.end}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  })), 
  { ssr: false }
);

const TestimonialSection = dynamic(() => 
  import('@/components/center/TestimonialSection').catch(() => ({ 
    default: ({ testimonials }) => (
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '2em', 
          marginBottom: '20px', 
          color: '#2c3e50',
          borderBottom: '2px solid #3498db',
          paddingBottom: '10px'
        }}>
          Patient Testimonials
        </h2>
        <div style={{ display: 'grid', gap: '20px' }}>
          {testimonials.map((testimonial, index) => (
            <div key={testimonial._id || index} style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #f39c12'
            }}>
              <div style={{ marginBottom: '10px' }}>
                {Array.from({ length: testimonial.rating || 5 }, (_, i) => '⭐').join('')}
              </div>
              <p style={{ 
                fontStyle: 'italic', 
                marginBottom: '15px', 
                color: '#2c3e50',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                "{testimonial.content}"
              </p>
              <div style={{ textAlign: 'right', color: '#7f8c8d', fontSize: '14px' }}>
                <strong>{testimonial.name}</strong>
                {testimonial.location && ` • ${testimonial.location}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  })), 
  { ssr: false }
);

const TeamSection = dynamic(() => 
  import('@/components/center/TeamSection').catch(() => ({ 
    default: ({ team }) => (
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '2em', 
          marginBottom: '20px', 
          color: '#2c3e50',
          borderBottom: '2px solid #3498db',
          paddingBottom: '10px'
        }}>
          Our Medical Team
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {team.map((member, index) => (
            <div key={member._id || index} style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              {member.image && (
                <img 
                  src={member.image} 
                  alt={member.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 15px',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <h3 style={{ color: '#2980b9', marginBottom: '8px' }}>
                {member.name}
              </h3>
              {member.designation && (
                <p style={{ 
                  color: '#7f8c8d', 
                  fontStyle: 'italic',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  {member.designation}
                </p>
              )}
              {member.experience && (
                <p style={{ marginBottom: '8px', fontSize: '14px' }}>
                  <strong>Experience:</strong> {member.experience}
                </p>
              )}
              {member.qualification && (
                <p style={{ fontSize: '14px', color: '#2c3e50' }}>
                  <strong>Qualification:</strong> {member.qualification}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  })), 
  { ssr: false }
);

const OtherCenters = dynamic(() => 
  import('@/components/center/OtherCenters').catch(() => ({ 
    default: ({ centers }) => {
      if (!centers || centers.length === 0) return null;
      
      return (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '2em', 
            marginBottom: '20px', 
            color: '#2c3e50',
            borderBottom: '2px solid #3498db',
            paddingBottom: '10px'
          }}>
            Other Centers
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '15px' 
          }}>
            {centers.slice(0, 4).map((center, index) => (
              <div key={center._id || index} style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #e1e8ed'
              }}>
                <h4 style={{ color: '#2980b9', marginBottom: '10px' }}>
                  {center.basic_info?.center_name || `Center ${index + 1}`}
                </h4>
                {center.basic_info?.location && (
                  <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
                    📍 {center.basic_info.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
  })), 
  { ssr: false }
);

const BlogSection = dynamic(() => 
  import('@/components/center/BlogSection').catch(() => ({ 
    default: ({ insights }) => {
      if (!insights || insights.length === 0) return null;
      
      return (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '2em', 
            marginBottom: '20px', 
            color: '#2c3e50',
            borderBottom: '2px solid #3498db',
            paddingBottom: '10px'
          }}>
            Health Insights
          </h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {insights.map((insight, index) => (
              <div key={insight._id || index} style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#2980b9', marginBottom: '10px' }}>
                  Health Insight #{index + 1}
                </h3>
                <p style={{ color: '#7f8c8d' }}>
                  Stay informed with our latest health insights and medical updates.
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  })), 
  { ssr: false }
);

// Main CenterPage component with error boundaries
const CenterPage = ({ centerData }) => {
  // Error boundary for the entire component
  if (!centerData) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        minHeight: '400px'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          Loading center information...
        </h2>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
      </div>
    );
  }

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
    working_hours = {}
  } = centerData;

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  };

  const mainContentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };

  const contentWrapperStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '30px',
    alignItems: 'start'
  };

  const leftContentStyle = {
    backgroundColor: 'transparent'
  };

  const rightSidebarStyle = {
    position: 'sticky',
    top: '20px'
  };

  // Responsive styles for mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  if (isMobile) {
    contentWrapperStyle.gridTemplateColumns = '1fr';
    rightSidebarStyle.position = 'static';
  }

  return (
    <div style={containerStyle}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .content-wrapper {
            grid-template-columns: 1fr !important;
          }
          .sidebar {
            position: static !important;
          }
        }
      `}</style>
      
      <div style={mainContentStyle}>
        {/* Breadcrumb */}
        {basic_info.location && basic_info.city && (
          <Breadcrumb 
            location={basic_info.location} 
            city={basic_info.city} 
          />
        )}

        {/* Hero Banner */}
        {basic_info.center_name && (
          <HeroBanner 
            title={basic_info.center_name}
            subtitle={basic_info.center_sub_title || ''}
            image={basic_info.center_image || ''}
          />
        )}

        <div style={contentWrapperStyle} className="content-wrapper">
          {/* Left Content */}
          <div style={leftContentStyle}>
            {/* Description Section */}
            {basic_info.center_description && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                  fontSize: '2em', 
                  marginBottom: '20px', 
                  color: '#2c3e50',
                  borderBottom: '2px solid #3498db',
                  paddingBottom: '10px'
                }}>
                  About {basic_info.center_name || 'Our Center'}
                </h2>
                <div style={{
                  backgroundColor: 'white',
                  padding: '25px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  lineHeight: '1.7',
                  color: '#2c3e50'
                }}>
                  {basic_info.center_description.split('\n').map((paragraph, index) => (
                    <p key={index} style={{ marginBottom: paragraph ? '15px' : '0' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {services.length > 0 && (
              <CenterServices services={services} />
            )}

            {/* Gallery */}
            {gallery && Object.keys(gallery).length > 0 && (
              <CenterGallery gallery={gallery} />
            )}

            {/* Video Section */}
            {video_gallery && Object.keys(video_gallery).length > 0 && (
              <VideoSection videos={video_gallery} />
            )}

            {/* Contact Info */}
            {center_info && Object.keys(center_info).length > 0 && (
              <CenterInfo 
                info={center_info}
                workingHours={working_hours}
              />
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <TestimonialSection testimonials={testimonials} />
            )}

            {/* Team */}
            {team.length > 0 && (
              <TeamSection team={team} />
            )}

            {/* Other Centers */}
            {other_centers.length > 0 && (
              <OtherCenters centers={other_centers} />
            )}

            {/* Blog/Health Insights */}
            {health_insights.length > 0 && (
              <BlogSection insights={health_insights} />
            )}

            {/* FAQ */}
            {faq.length > 0 && (
              <FAQ faq={faq} />
            )}
          </div>

          {/* Right Sidebar */}
          <div style={rightSidebarStyle} className="sidebar">
            {center_info && working_hours && (
              <BookingForm 
                centerInfo={center_info}
                workingHours={working_hours}
              />
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
  centerData: null
};

export default React.memo(CenterPage);
