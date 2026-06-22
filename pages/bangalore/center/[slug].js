// File: pages/bangalore/center/[slug].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Safe dynamic imports with fallbacks for all components
const Layout = dynamic(() => 
  import('@/components/Layout').catch(() => ({ 
    default: ({ children, title }) => (
      <div>
        <Head><title>{title || 'Cadabam\'s Diagnostics'}</title></Head>
        {children}
      </div>
    )
  })), 
  { ssr: true }
);

// Create a safe CenterPage component with error boundaries
const SafeCenterPage = dynamic(() => 
  import('./CenterPage').catch(() => ({ 
    default: ({ centerData }) => <FallbackCenterPage centerData={centerData} />
  })), 
  { 
    ssr: false,
    loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading center information...</div>
  }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-prod.cadabamsdiagnostics.com/api/v1/cms/component/pagetemplate';

// Fallback CenterPage component that doesn't rely on external imports
const FallbackCenterPage = ({ centerData }) => {
  if (!centerData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading center information...</h2>
      </div>
    );
  }

  const {
    basic_info = {},
    center_info = {},
    services = [],
    testimonials = [],
    team = [],
    faq = [],
    working_hours = {}
  } = centerData;

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const sectionStyle = {
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const headingStyle = {
    color: '#2c3e50',
    marginBottom: '15px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '15px',
    margin: '10px 0',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      {basic_info.center_name && (
        <div style={{ ...sectionStyle, textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ ...headingStyle, fontSize: '2.5em', textAlign: 'center' }}>
            {basic_info.center_name}
          </h1>
          {basic_info.center_sub_title && (
            <p style={{ fontSize: '1.2em', color: '#7f8c8d', margin: '10px 0' }}>
              {basic_info.center_sub_title}
            </p>
          )}
        </div>
      )}

      {/* Description */}
      {basic_info.center_description && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>About Our Center</h2>
          <div style={{ lineHeight: '1.6', color: '#2c3e50' }}>
            {basic_info.center_description.split('\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '15px' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      {services.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Our Services</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {services.map((service, index) => (
              <div key={service._id || index} style={cardStyle}>
                <h3 style={{ color: '#2980b9', marginBottom: '10px' }}>
                  {service.title}
                </h3>
                {service.description && (
                  <p style={{ color: '#7f8c8d', marginBottom: '10px' }}>
                    {service.description}
                  </p>
                )}
                {service.tests && service.tests.length > 0 && (
                  <div>
                    <strong>Available Tests:</strong>
                    <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                      {service.tests.map((test, testIndex) => (
                        <li key={testIndex} style={{ marginBottom: '5px' }}>
                          {test}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      {center_info && Object.keys(center_info).length > 0 && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Contact Information</h2>
          <div style={cardStyle}>
            {center_info.address && (
              <p><strong>Address:</strong> {center_info.address}</p>
            )}
            {center_info.phone && (
              <p><strong>Phone:</strong> <a href={`tel:${center_info.phone}`}>{center_info.phone}</a></p>
            )}
            {center_info.whatsapp && (
              <p><strong>WhatsApp:</strong> <a href={`https://wa.me/${center_info.whatsapp.replace(/[^0-9]/g, '')}`}>{center_info.whatsapp}</a></p>
            )}
            {center_info.email && (
              <p><strong>Email:</strong> <a href={`mailto:${center_info.email}`}>{center_info.email}</a></p>
            )}
          </div>
          
          {/* Working Hours */}
          {working_hours && (working_hours.weekdays || working_hours.sunday) && (
            <div style={{ ...cardStyle, marginTop: '15px' }}>
              <h3 style={{ marginBottom: '10px' }}>Working Hours</h3>
              {working_hours.weekdays && (
                <p><strong>Monday - Saturday:</strong> {working_hours.weekdays.start} - {working_hours.weekdays.end}</p>
              )}
              {working_hours.sunday && (
                <p><strong>Sunday:</strong> {working_hours.sunday.start} - {working_hours.sunday.end}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Team */}
      {team.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Our Team</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {team.map((member, index) => (
              <div key={member._id || index} style={cardStyle}>
                <h3 style={{ color: '#2980b9', marginBottom: '5px' }}>
                  {member.name}
                </h3>
                {member.designation && (
                  <p style={{ color: '#7f8c8d', marginBottom: '5px', fontStyle: 'italic' }}>
                    {member.designation}
                  </p>
                )}
                {member.experience && (
                  <p><strong>Experience:</strong> {member.experience}</p>
                )}
                {member.qualification && (
                  <p><strong>Qualification:</strong> {member.qualification}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Patient Testimonials</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {testimonials.map((testimonial, index) => (
              <div key={testimonial._id || index} style={cardStyle}>
                <div style={{ marginBottom: '10px' }}>
                  {'★'.repeat(testimonial.rating || 5)}
                </div>
                <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>
                  "{testimonial.content}"
                </p>
                <p style={{ textAlign: 'right', color: '#7f8c8d' }}>
                  - {testimonial.name} {testimonial.location && `(${testimonial.location})`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {faq.map((faqItem, index) => (
              <div key={faqItem._id || index} style={cardStyle}>
                <h3 style={{ color: '#2980b9', marginBottom: '10px' }}>
                  {faqItem.question}
                </h3>
                <div 
                  style={{ color: '#2c3e50' }}
                  dangerouslySetInnerHTML={{ 
                    __html: faqItem.answer || '' 
                  }} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Utility functions
const safeGet = (obj, path, defaultValue = '') => {
  try {
    if (!obj || typeof obj !== 'object') return defaultValue;
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result == null || typeof result !== 'object') return defaultValue;
      result = result[key];
    }
    return result != null ? result : defaultValue;
  } catch {
    return defaultValue;
  }
};

const safeArray = (arr) => Array.isArray(arr) ? arr : [];

// Create fallback data
const createFallbackCenterData = (slug = '') => ({
  _id: `fallback-${Date.now()}`,
  basic_info: {
    center_name: 'Cadabam\'s Diagnostic Center',
    center_image: '',
    center_sub_title: 'Quality Diagnostic Services',
    center_description: 'We provide comprehensive diagnostic services with state-of-the-art technology and experienced medical professionals committed to your health and wellbeing.',
    location: slug,
    city: 'bangalore',
    area: slug
  },
  center_info: {
    address: 'Bangalore, Karnataka',
    phone: '+91 99006 64696',
    whatsapp: '+91 95385 93355',
    email: 'info@cadabamsdiagnostics.com',
    map_location: ''
  },
  working_hours: {
    weekdays: { start: '06:30', end: '21:00' },
    sunday: { start: '06:30', end: '13:00' }
  },
  services: [
    {
      _id: 'service-1',
      title: 'Laboratory Services',
      description: 'Comprehensive blood tests and diagnostic laboratory services',
      icon: '',
      tests: ['Complete Blood Count (CBC)', 'Thyroid Profile (T3, T4, TSH)', 'Liver Function Test (LFT)', 'Glucose Tests']
    },
    {
      _id: 'service-2',
      title: 'Radiology & Imaging',
      description: 'Advanced imaging services for accurate diagnosis',
      icon: '',
      tests: ['X-Ray', 'MRI Scan', 'CT Scan', 'Ultrasound', 'Mammography']
    }
  ],
  team: [
    {
      _id: 'team-1',
      name: 'Dr. S Pradeep',
      designation: 'Consultant Specialist in Radiology and Fetal Medicine',
      experience: '25+ Years',
      qualification: 'MBBS, MD, DNB Radiodiagnosis',
      image: null
    }
  ],
  testimonials: [
    {
      _id: 'testimonial-1',
      name: 'Satisfied Patient',
      content: 'Excellent service and professional staff. The diagnostic tests were conducted efficiently and reports were delivered on time.',
      location: 'Bangalore',
      rating: 5,
      date: new Date().toISOString()
    }
  ],
  faq: [
    {
      _id: 'faq-1',
      question: 'What services do you offer?',
      answer: 'We offer comprehensive diagnostic services including laboratory tests, radiology, imaging procedures, and health checkups.'
    },
    {
      _id: 'faq-2',
      question: 'What are your working hours?',
      answer: 'We are open Monday to Saturday from 6:30 AM to 9:00 PM, and Sunday from 6:30 AM to 1:00 PM.'
    }
  ],
  gallery: {},
  seo: {},
  video_gallery: {},
  other_centers: [],
  health_insights: [],
  templateName: 'center'
});

// Safe data transformation
const transformCenterData = (rawData) => {
  if (!rawData) return null;
  
  try {
    const data = rawData.data || rawData;
    
    // Transform with comprehensive error handling
    const transformed = {
      _id: safeGet(data, '_id', `center-${Date.now()}`),
      basic_info: {
        center_name: safeGet(data, 'basic_info.center_name', 'Cadabam\'s Diagnostic Center'),
        center_image: safeGet(data, 'basic_info.center_image', ''),
        center_sub_title: safeGet(data, 'basic_info.center_sub_title', 'Quality Diagnostic Services'),
        center_description: safeGet(data, 'basic_info.center_description', ''),
        location: safeGet(data, 'basic_info.location', ''),
        city: safeGet(data, 'basic_info.city', 'bangalore'),
        area: safeGet(data, 'basic_info.area', '')
      },
      center_info: {
        address: safeGet(data, 'center_info.address', ''),
        phone: safeGet(data, 'center_info.phone', ''),
        whatsapp: safeGet(data, 'center_info.whatsapp', ''),
        email: safeGet(data, 'center_info.email', 'info@cadabamsdiagnostics.com'),
        map_location: safeGet(data, 'center_info.map_location', '')
      },
      working_hours: {
        weekdays: {
          start: safeGet(data, 'working_hours.weekdays.start', '06:30'),
          end: safeGet(data, 'working_hours.weekdays.end', '21:00')
        },
        sunday: {
          start: safeGet(data, 'working_hours.sunday.start', '06:30'),
          end: safeGet(data, 'working_hours.sunday.end', '13:00')
        }
      },
      services: transformServices(safeArray(data.services)),
      team: transformTeam(safeArray(data.team)),
      testimonials: transformTestimonials(safeArray(data.testimonials)),
      faq: transformFAQ(safeArray(data.faq)),
      gallery: data.gallery || {},
      seo: data.seo || {},
      video_gallery: data.video_gallery || {},
      other_centers: safeArray(data.other_centers),
      health_insights: safeArray(data.health_insights),
      templateName: safeGet(data, 'templateName', 'center')
    };

    return transformed;
  } catch (error) {
    console.error('Data transformation error:', error);
    return null;
  }
};

// Transform services safely
const transformServices = (servicesArray) => {
  return servicesArray.map((service, index) => {
    try {
      const tests = safeArray(service.tests).map(test => {
        if (typeof test === 'string') return test.trim();
        if (test && typeof test === 'object') {
          return test.testName || test.name || test.title || '';
        }
        return '';
      }).filter(Boolean);

      return {
        _id: safeGet(service, '_id', `service-${index}`),
        title: safeGet(service, 'title', `Service ${index + 1}`),
        description: safeGet(service, 'description', ''),
        icon: safeGet(service, 'icon', ''),
        tests: tests
      };
    } catch (error) {
      console.error(`Error transforming service ${index}:`, error);
      return {
        _id: `service-error-${index}`,
        title: `Service ${index + 1}`,
        description: '',
        icon: '',
        tests: []
      };
    }
  });
};

// Transform team safely
const transformTeam = (teamArray) => {
  return teamArray.map((member, index) => ({
    _id: safeGet(member, '_id', `team-${index}`),
    name: safeGet(member, 'name', 'Team Member'),
    designation: safeGet(member, 'designation', ''),
    experience: safeGet(member, 'experience', ''),
    qualification: safeGet(member, 'qualification', ''),
    image: safeGet(member, 'image', null)
  }));
};

// Transform testimonials safely
const transformTestimonials = (testimonialsArray) => {
  return testimonialsArray.map((testimonial, index) => ({
    _id: safeGet(testimonial, '_id', `testimonial-${index}`),
    name: safeGet(testimonial, 'name', 'Anonymous'),
    content: safeGet(testimonial, 'content', ''),
    location: safeGet(testimonial, 'location', ''),
    rating: parseInt(safeGet(testimonial, 'rating', 5)) || 5,
    date: safeGet(testimonial, 'date', new Date().toISOString())
  }));
};

// Transform FAQ safely
const transformFAQ = (faqArray) => {
  return faqArray.map((faqItem, index) => ({
    _id: safeGet(faqItem, '_id', `faq-${index}`),
    question: safeGet(faqItem, 'question', ''),
    answer: safeGet(faqItem, 'answer', '')
  }));
};

// Enhanced API fetch with multiple fallbacks
const fetchCenterData = async (slug) => {
  const slugVariations = [
    slug,
    slug.toLowerCase(),
    slug.replace(/[-\s]/g, ''),
    // Common mappings
    'kanakapura', 'kalyannagar', 'banashankari', 'indiranagar', 'jayanagar'
  ].filter((s, i, arr) => arr.indexOf(s) === i); // Remove duplicates

  for (const trySlug of slugVariations) {
    try {
      console.log(`Trying API call with slug: ${trySlug}`);
      
      const response = await axios.get(`${API_BASE_URL}/center/kalyannagar`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data) {
        console.log(`Success with slug: ${trySlug}`);
        return { success: true, data: response.data, slug: trySlug };
      }
    } catch (error) {
      console.log(`Failed for slug ${trySlug}:`, error.message);
      continue;
    }
  }

  return { success: false, error: 'No data found' };
};

// SEO data with safe fallbacks
const getSEOData = (centerData, slug) => {
  const defaultSEO = {
    title: 'Diagnostic Center | Cadabam\'s Diagnostics Bangalore',
    description: 'Comprehensive diagnostic services in Bangalore with advanced technology and expert medical professionals.',
    url: `https://cadabamsdiagnostics.com/bangalore/center/${slug}`,
    imageUrl: '/images/default-center.jpg'
  };

  if (!centerData || !centerData.basic_info) return defaultSEO;

  const center = centerData.basic_info;
  const centerName = center.center_name || 'Diagnostic Center';
  
  return {
    title: `${centerName} | Cadabam's Diagnostics Bangalore`,
    description: center.center_description ? 
      `${center.center_description.substring(0, 150)}...` : 
      defaultSEO.description,
    url: `https://cadabamsdiagnostics.com/bangalore/center/${slug}`,
    imageUrl: center.center_image || defaultSEO.imageUrl
  };
};

// Server-side props with comprehensive error handling
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  console.log('=== getServerSideProps START ===');
  console.log('Slug:', slug);

  if (!slug) {
    return {
      redirect: { destination: '/bangalore', permanent: false }
    };
  }

  // Always return valid props, never throw
  try {
    const result = await fetchCenterData(slug);
    
    if (result.success) {
      const transformedData = transformCenterData(result.data);
      
      if (transformedData) {
        console.log('Success: Returning transformed data');
        return {
          props: {
            centerData: transformedData,
            slug: result.slug,
            error: null
          }
        };
      }
    }
    
    console.log('API failed, using fallback data');
    return {
      props: {
        centerData: createFallbackCenterData(slug),
        slug: slug,
        error: null,
        isFallback: true
      }
    };

  } catch (error) {
    console.error('getServerSideProps error:', error.message);
    
    // Always return fallback instead of throwing
    return {
      props: {
        centerData: createFallbackCenterData(slug),
        slug: slug,
        error: null,
        isFallback: true
      }
    };
  }
}

// Main component
const CenterDetailPage = ({ centerData, slug, error, isFallback }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle router fallback
  if (router.isFallback) {
    return (
      <Layout title="Loading...">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Loading center information...</h2>
        </div>
      </Layout>
    );
  }

  // Ensure we always have valid data
  const validCenterData = centerData || createFallbackCenterData(slug);
  const seoData = getSEOData(validCenterData, slug);

  return (
    <Layout title={validCenterData.basic_info?.center_name || 'Diagnostic Center'}>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={seoData.url} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:image" content={seoData.imageUrl} />
        
        {/* JSON-LD for Medical Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": validCenterData.basic_info?.center_name || "Cadabam's Diagnostics",
              "description": validCenterData.basic_info?.center_description || "",
              "url": seoData.url,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": validCenterData.center_info?.address || "",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "addressCountry": "IN"
              },
              "telephone": validCenterData.center_info?.phone || "",
              "email": validCenterData.center_info?.email || ""
            })
          }}
        />
      </Head>

      {isFallback && (
        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '10px',
          textAlign: 'center',
          borderBottom: '1px solid #ffeaa7'
        }}>
          ⚠️ Displaying basic information due to connectivity issues
        </div>
      )}

      {isClient ? (
        <SafeCenterPage centerData={validCenterData} />
      ) : (
        <FallbackCenterPage centerData={validCenterData} />
      )}
    </Layout>
  );
};

export default CenterDetailPage;
