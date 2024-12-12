// pages/about/index.jsx
"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Building, Award, History, Target, 
  Activity, ChevronRight, Star, Calendar,
  MapPin, Phone, Mail, Clock, Heart, Shield,
  Stethoscope, Gift
} from 'lucide-react';
import { AuthProvider } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  // SEO Data
  const seoData = {
    title: "About Us | Leading Diagnostic Center in Bangalore | Cadabam's Diagnostics",
    description: "Discover Cadabam's Diagnostics - Bangalore's premier diagnostic center with 30+ years of excellence. Advanced imaging, expert medical team, and comprehensive healthcare services.",
    keywords: "Cadabams diagnostics, diagnostic center bangalore, medical imaging bangalore, healthcare services, diagnostic tests, medical team, radiology center",
    url: "https://www.cadabamsdiagnostics.com/about",
    imageUrl: "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png"
  };

  // State Management
  const [activeTab, setActiveTab] = useState('overview');

  // Data Constants
  const statistics = [
    { 
      label: "Patients Served", 
      value: "50,000+", 
      icon: Users,
      color: "#DB4B4B"
    },
    { 
      label: "Accuracy Rate", 
      value: "99%", 
      icon: Target,
      color: "#DB4B4B"
    },
    { 
      label: "Experience", 
      value: "30+", 
      icon: Calendar,
      color: "#DB4B4B"
    },
    { 
      label: "Specialists", 
      value: "25+", 
      icon: Star,
      color: "#DB4B4B"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: History },
    { id: 'services', label: 'Our Services', icon: Activity },
    { id: 'team', label: 'Medical Team', icon: Users },
    { id: 'facilities', label: 'Facilities', icon: Building },
    { id: 'values', label: 'Our Values', icon: Heart }
  ];

  const services = [
    {
      title: "Diagnostic Services",
      icon: Stethoscope,
      items: [
        "X-Ray & Digital Radiography",
        "IVP/MCU/MCU and barium studies",
        "Hysterosalpingography",
        "Advanced Ultrasonography",
        "Comprehensive Laboratory Services",
        "Cardiology Diagnostics"
      ]
    },
    {
      title: "Specialized Procedures",
      icon: Shield,
      items: [
        "USG Guided Fetal Procedures",
        "Musculoskeletal Interventions",
        "Joint Injections",
        "Fine Needle Aspiration",
        "Perinatal Sonography",
        "Genetic Testing"
      ]
    },
    {
      title: "Patient Care Services",
      icon: Gift,
      items: [
        "24/7 Emergency Care",
        "Home Sample Collection",
        "Online Report Access",
        "Expert Consultations",
        "Second Opinion Services",
        "Teleradiology"
      ]
    }
  ];

  const team = [
    {
      id: 1,
      name: "Dr. S Pradeep",
      role: "Senior Consultant Radiologist",
      qualifications: "MBBS, MD, DNB (Radiodiagnosis)",
      experience: "15+ Years",
      specializations: ["Fetal Medicine", "Interventional Radiology"],
      expertise: [
        "Fetal TIFFA ECHO Neurosonogram",
        "Doppler CVS Amniocentesis",
        "3D/4D Ultrasound",
        "Interventional Procedures"
      ],
      achievements: [
        "Best Radiologist Award 2022",
        "Published 20+ Research Papers",
        "International Radiology Board Member"
      ]
    },
    {
      id: 2,
      name: "Dr. Divya Cadabam",
      role: "Consultant Radiologist",
      qualifications: "MBBS, MD (Radiodiagnosis)",
      experience: "12+ Years",
      specializations: ["Women's Imaging", "Fetal Medicine"],
      expertise: [
        "Women's Imaging",
        "Fertility Imaging",
        "Fetal Medicine",
        "Advanced Ultrasonography"
      ],
      achievements: [
        "Excellence in Fetal Medicine 2023",
        "Research Excellence Award",
        "Featured in Medical Journal"
      ]
    }
  ];

  const facilities = [
    {
      title: "Advanced Imaging Center",
      description: "State-of-the-art imaging facility equipped with the latest diagnostic technology",
      features: [
        "3T MRI Scanner",
        "128 Slice CT Scanner",
        "Digital X-Ray",
        "4D Ultrasound"
      ],
      highlights: [
        "Rapid Results",
        "High Precision",
        "Patient Comfort"
      ]
    },
    {
      title: "Fetal Medicine Unit",
      description: "Specialized care for maternal and fetal health with comprehensive diagnostics",
      features: [
        "Advanced Ultrasound",
        "Fetal ECHO",
        "Genetic Testing",
        "NT Scan"
      ],
      highlights: [
        "Expert Care",
        "Latest Technology",
        "Comprehensive Support"
      ]
    },
    {
      title: "Laboratory Services",
      description: "Full-service diagnostic laboratory with advanced testing capabilities",
      features: [
        "Molecular Diagnostics",
        "Biochemistry",
        "Microbiology",
        "Serology"
      ],
      highlights: [
        "Quick Turnaround",
        "Accurate Results",
        "Wide Test Range"
      ]
    }
  ];

  const values = [
    {
      title: "Excellence",
      description: "Commitment to delivering the highest quality diagnostic services",
      icon: Star
    },
    {
      title: "Innovation",
      description: "Continuously adopting cutting-edge medical technologies",
      icon: Activity
    },
    {
      title: "Patient Care",
      description: "Putting patients first with compassionate, personalized care",
      icon: Heart
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  // Render Functions
  const renderOverviewSection = () => (
    <motion.div 
      className={styles.overviewSection}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.missionVision}>
        <motion.div 
          className={styles.mvCard}
          variants={itemVariants}
        >
          <Target className={styles.mvIcon} />
          <h3>Our Vision</h3>
          <p>To be the leading diagnostic center delivering exceptional healthcare through 
             innovation and expertise, setting new standards in patient care and medical accuracy.</p>
        </motion.div>
        <motion.div 
          className={styles.mvCard}
          variants={itemVariants}
        >
          <Activity className={styles.mvIcon} />
          <h3>Our Mission</h3>
          <p>Providing accurate diagnoses and quality healthcare services with state-of-the-art 
             technology and expert professionals, ensuring accessible and reliable healthcare for all.</p>
        </motion.div>
      </div>

      <motion.div 
        className={styles.valueProps}
        variants={containerVariants}
      >
        <h3>Why Choose Us?</h3>
        <div className={styles.valueGrid}>
          {values.map((value, index) => (
            <motion.div 
              key={index}
              className={styles.valueCard}
              variants={itemVariants}
            >
              <div className={styles.valueIcon}>
                <value.icon />
              </div>
              <h4>{value.title}</h4>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderServicesSection = () => (
    <motion.div 
      className={styles.servicesSection}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {services.map((service, index) => (
        <motion.div 
          key={index}
          className={styles.serviceCard}
          variants={itemVariants}
        >
          <div className={styles.serviceHeader}>
            <service.icon className={styles.serviceIcon} />
            <h3>{service.title}</h3>
          </div>
          <ul className={styles.serviceList}>
            {service.items.map((item, idx) => (
              <motion.li 
                key={idx}
                variants={itemVariants}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderTeamSection = () => (
    <motion.div 
      className={styles.teamSection}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {team.map((member) => (
        <motion.div 
          key={member.id}
          className={styles.teamCard}
          variants={itemVariants}
        >
          <div className={styles.teamHeader}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {member.name.charAt(0)}
              </div>
            </div>
            <div className={styles.teamInfo}>
              <h3>{member.name}</h3>
              <p className={styles.role}>{member.role}</p>
              <p className={styles.qualifications}>{member.qualifications}</p>
            </div>
          </div>
          <div className={styles.teamBody}>
            <div className={styles.experienceSection}>
              <h4>Experience</h4>
              <p>{member.experience}</p>
            </div>
            <div className={styles.specializationSection}>
              <h4>Specializations</h4>
              <div className={styles.tags}>
                {member.specializations.map((spec, idx) => (
                  <span key={idx} className={styles.tag}>{spec}</span>
                ))}
              </div>
            </div>
            <div className={styles.expertiseSection}>
              <h4>Areas of Expertise</h4>
              <ul>
                {member.expertise.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.achievementsSection}>
              <h4>Achievements</h4>
              <ul>
                {member.achievements.map((achievement, idx) => (
                  <li key={idx}>{achievement}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderFacilitiesSection = () => (
    <motion.div 
      className={styles.facilitiesSection}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {facilities.map((facility, index) => (
        <motion.div 
          key={index}
          className={styles.facilityCard}
          variants={itemVariants}
        >
          <div className={styles.facilityHeader}>
            <h3>{facility.title}</h3>
            <p>{facility.description}</p>
          </div>
          <div className={styles.facilityBody}>
            <div className={styles.features}>
              <h4>Key Features</h4>
              <ul>
                {facility.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className={styles.highlights}>
              <h4>Highlights</h4>
              <div className={styles.highlightTags}>
                {facility.highlights.map((highlight, idx) => (
                  <span key={idx} className={styles.highlightTag}>
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderValuesSection = () => (
    <motion.div 
      className={styles.valuesSection}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {values.map((value, index) => (
        <motion.div 
          key={index}
          className={styles.valueCard}
          variants={itemVariants}
        >
          <div className={styles.valueIconContainer}>
            <value.icon className={styles.valueIcon} />
          </div>
          <h3 className={styles.valueTitle}>{value.title}</h3>
          <p className={styles.valueDescription}>{value.description}</p>
        </motion.div>
      ))}
  
      <div className={styles.valuesHighlight}>
        <h3>Our Commitment</h3>
        <p>
          At Cadabams, our values guide every aspect of our service delivery, 
          ensuring that we maintain the highest standards in healthcare while 
          putting our patients first.
        </p>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewSection();
      case 'services':
        return renderServicesSection();
      case 'team':
        return renderTeamSection();
      case 'facilities':
        return renderFacilitiesSection();
      case 'values':
        return renderValuesSection();
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <Layout>
        <Head>
          {/* Basic Meta Tags */}
          <title>{seoData.title}</title>
          <meta name="description" content={seoData.description} />
          <meta name="keywords" content={seoData.keywords} />
          <meta name="robots" content="index, follow" />
          
          {/* Canonical Tag */}
          <link rel="canonical" href={seoData.url} />
          
          {/* Open Graph Tags */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={seoData.title} />
          <meta property="og:description" content={seoData.description} />
          <meta property="og:image" content={seoData.imageUrl} />
          <meta property="og:url" content={seoData.url} />
          <meta property="og:site_name" content="Cadabams Diagnostics" />
          <meta property="og:locale" content="en_IN" />
          <meta property="og:brand" content="Cadabams Diagnostics" />
          <meta property="og:email" content="info@cadabamsdiagnostics.com" />
          <meta property="og:phone_number" content="+918050381444" />
          <meta property="og:street-address" content="19th Main Road, HSR Layout" />
          <meta property="og:locality" content="Bangalore" />
          <meta property="og:region" content="Karnataka" />
          <meta property="og:postal-code" content="560102" />
          <meta property="og:country-name" content="India" />
          
          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@CadabamsDX" />
          <meta name="twitter:creator" content="@CadabamsDX" />
          <meta name="twitter:title" content={seoData.title} />
          <meta name="twitter:description" content={seoData.description} />
          <meta name="twitter:image" content={seoData.imageUrl} />
          <meta name="twitter:image:alt" content="Cadabams Diagnostics Center" />

          {/* Additional Meta Tags */}
          <meta name="format-detection" content="telephone=no" />
          <meta name="theme-color" content="#0047AB" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Cadabams Diagnostics" />
          
          {/* Article Specific Meta Tags */}
          <meta property="article:publisher" content="https://www.facebook.com/cadabamsdiagnostics" />
          <meta property="article:modified_time" content={new Date().toISOString()} />
          <meta property="article:author" content="Cadabams Diagnostics" />
          <meta property="article:section" content="About Us" />
          
          {/* Additional SEO Tags */}
          <meta name="geo.region" content="IN-KA" />
          <meta name="geo.placename" content="Bangalore" />
          <meta name="geo.position" content="12.9716;77.5946" />
          <meta name="ICBM" content="12.9716, 77.5946" />
          
          {/* Viewport and Charset */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta charSet="UTF-8" />
        </Head>

        <div className={styles.container}>
          {/* Hero Section */}
          <motion.div 
            className={styles.heroCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.heroContent}>
              <motion.h1 
                className={styles.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                About Cadabams
              </motion.h1>
              <motion.p 
                className={styles.subtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Leading the way in diagnostic excellence with cutting-edge technology 
                and compassionate care since 1990
              </motion.p>

              <motion.div 
                className={styles.statsGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {statistics.map((stat, index) => (
                  <motion.div
                    key={index}
                    className={styles.statCard}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <stat.icon className={styles.statIcon} style={{ color: stat.color }} />
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <motion.div 
              className={styles.imageContainer}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Image
                src="https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png-ezgif.com-webp-to-png-converter.webp"
                alt="Cadabams Doctor"
                width={300}
                height={300}
                className={styles.doctorImage}
                priority
              />
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className={styles.mainContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className={styles.tabs}>
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <tab.icon className={styles.tabIcon} />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                className={styles.tabContent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            className={styles.contactSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className={styles.contactGrid}>
              <div className={styles.contactInfo}>
                <h3>Get in Touch</h3>
                <div className={styles.contactDetails}>
                  {[
                    { icon: MapPin, text: "19th Main Road, HSR Layout Bangalore, Karnataka 560102" },
                    { icon: Phone, text: " +918050381444" },
                    { icon: Mail, text: "contact@cadabams.com" },
                    { icon: Clock, text: "Open 24/7" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className={styles.contactItem}
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <item.icon className={styles.contactIcon} />
                      <span>{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Animation Elements */}
          <div className={styles.floatingElements}>
            <motion.div
              className={`${styles.floatingBall} ${styles.ball1}`}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className={`${styles.floatingBall} ${styles.ball2}`}
              animate={{
                y: [10, 40, 0],
                x: [0, -50, 0],
                rotate: [0, -15, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className={`${styles.floatingBall} ${styles.ball3}`}
              animate={{
                y: [0, -20, 0],
                x: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </Layout>
    </AuthProvider>
  );
};

export default AboutUs;