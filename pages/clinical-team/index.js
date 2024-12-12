// pages/clinical-team/index.jsx
"use client";
import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  Award, Users, Star, Target,
  Calendar, Heart, Shield,
  Mail, Phone, ChevronRight,
  Check
} from 'lucide-react';
import Layout from '../../components/Layout';
import { AuthProvider } from '../../contexts/AuthContext';
import styles from './ClinicalTeam.module.css';
import { useRouter } from 'next/router';

const ClinicalTeam = () => {
  const router = useRouter();

  // SEO Data
  const seoData = {
    title: "Clinical Team | Expert Radiologists & Specialists | Cadabam's Diagnostics",
    description: "Meet our expert team of radiologists and specialists at Cadabam's Diagnostics. Led by Dr. S Pradeep, Dr. Divya Cadabam, and Dr. Shreyas Cadabam, offering specialized diagnostic services in Bangalore.",
    keywords: "Cadabams clinical team, radiologists bangalore, Dr S Pradeep, Dr Divya Cadabam, Dr Shreyas Cadabam, diagnostic specialists, fetal medicine experts, interventional radiology",
    url: "https://www.cadabamsdiagnostics.com/clinical-team",
    imageUrl: "https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/compressed_9815643070a25aed251f2c91def2899b.png"
  };
  
  const stats = [
    {
      value: "25+",
      label: "Years Experience",
      icon: Calendar,
      color: "#DB4B4B"
    },
    {
      value: "1000+",
      label: "Procedures Done",
      icon: Shield,
      color: "#DB4B4B"
    },
    {
      value: "95%",
      label: "Patient Satisfaction",
      icon: Star,
      color: "#DB4B4B"
    },
    {
      value: "100%",
      label: "Diagnostic Accuracy",
      icon: Target,
      color: "#DB4B4B"
    }
  ];

  const doctors = [
    {
      name: "Dr S Pradeep",
      role: "MBBS, MD, DNB Radiodiagnosis",
      position: "Consultant specialist in Radiology and Fetal Medicine",
      description: "Dr. S Pradeep is a registered radiologist with 25 years of immense experience conducting diagnostic and medical imaging procedures to detect diseases. He has expertise in skills which includes Fetal TIFFA ECHO Neurosonogram Doppler CVS Amniocentesis and Fetal reductions.",
      education: [
        "MBBS – PSG Coimbatore",
        "MD – JJMMC Davangere",
        "DNB – CMC Vellore",
        "Fetal Intervention – Hong Kong",
        "25 years experience"
      ],
      expertise: [
        "Fetal TIFFA, ECHO, Neurosonogram",
        "Doppler CVS, Amniocentesis",
        "3D TVS, Perianal Sonofistulography",
        "Elastography and Neonatal Scans",
        "Whole body FNAC and Biopsy"
      ],
      achievements: [
        "Gold Medalist",
        "National and International Award Winner",
        "Chaptered in Text Book of Fetal Echo",
        "Performed more than 1000 Amniocentesis"
      ]
    },
    {
      name: "Dr Divya Cadabam",
      role: "MBBS, MD Radiodiagnosis",
      position: "Consultant specialist in Radiology and Fetal Medicine",
      description: "Dr. Divya Cadabam is a reputed doctor in the field of radiodiagnosis. With fellowship in Fetal Medicine and Advanced Ultrasonography, she specializes in Women's Imaging, Infertility Imaging, and Fetal Interventions.",
      education: [
        "MBBS – M.S. Ramaiah Medical College",
        "MD – Vydehi Institute Of Medical Sciences",
        "Fellowship in Fetal Medicine",
        "Advanced Ultrasonography"
      ],
      expertise: [
        "Women's Imaging & Diagnostics",
        "Infertility Imaging",
        "Fetal Medicine",
        "Advanced Ultrasonography",
        "Breast Imaging"
      ],
      achievements: [
        "Expert in Fetal Medicine",
        "Specialized in Women's Health",
        "Advanced Imaging Techniques",
        "Patient-Centered Care"
      ]
    },
    {
      name: "Dr Shreyas Cadabam",
      role: "MBBS, MD Radiodiagnosis",
      position: "Consultant specialist in Radiology and Interventional MSK imaging",
      description: "Dr. Shreyas Cadabam is an Interventional Musculoskeletal Radiologist with vast experience. His expertise includes MSK Interventions, Biopsies, FNAC and specialized imaging.",
      education: [
        "MBBS",
        "MD Radiodiagnosis",
        "Interventional MSK Fellowship",
        "Advanced Training in Interventional Procedures"
      ],
      expertise: [
        "MSK Interventions",
        "Ultrasound Guided Procedures",
        "Joint Injections",
        "Sports Medicine Imaging",
        "Interventional Procedures"
      ],
      achievements: [
        "Specialized in MSK Imaging",
        "Advanced Intervention Techniques",
        "Expert in Sports Medicine",
        "Pioneering Treatment Methods"
      ]
    }
  ];

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

  const handleContactClick = () => {
    router.push('/contact-us');
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
          <meta name="twitter:image:alt" content="Cadabams Diagnostics Clinical Team" />

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
          <meta property="article:section" content="Clinical Team" />
          
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
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.title}
              >
                Our Clinical Team
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={styles.subtitle}
              >
                Meet our team of dedicated professionals delivering excellence in healthcare
              </motion.p>

              {/* Stats Grid */}
              <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={styles.statCard}
                  >
                    <div className={styles.statIconWrapper}>
                      <stat.icon className={styles.statIcon} />
                    </div>
                    <h3 className={styles.statValue}>{stat.value}</h3>
                    <p className={styles.statLabel}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <motion.div 
            className={styles.teamSection}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {doctors.map((doctor, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={styles.doctorCard}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.avatar}>{doctor.name[0]}</div>
                  </div>
                  <div className={styles.headerInfo}>
                    <h3>{doctor.name}</h3>
                    <p className={styles.role}>{doctor.role}</p>
                    <p className={styles.position}>{doctor.position}</p>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.description}>{doctor.description}</p>

                  <div className={styles.section}>
                    <h4>Education & Experience</h4>
                    <ul>
                      {doctor.education.map((item, idx) => (
                        <li key={idx}>
                          <Check className={styles.checkIcon} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.section}>
                    <h4>Areas of Expertise</h4>
                    <ul>
                      {doctor.expertise.map((item, idx) => (
                        <li key={idx}>
                          <Check className={styles.checkIcon} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.section}>
                    <h4>Achievements</h4>
                    <ul>
                      {doctor.achievements.map((item, idx) => (
                        <li key={idx}>
                          <Check className={styles.checkIcon} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.actions}>
                    {/* <button className={styles.appointmentButton}>
                      Book Appointment
                      <ChevronRight className={styles.buttonIcon} />
                    </button> */}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            className={styles.contactSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.contactCard}>
              <h3>Get in Touch</h3>
              <p>Book an appointment with our specialists today</p>
              
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} />
                  <span>+91 99001 26611</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail className={styles.contactIcon} />
                  <span>info@cadabams.com</span>
                </div>
              </div>

              <button 
                className={styles.contactButton}
                onClick={handleContactClick}
              >
                Contact Us
                <ChevronRight className={styles.buttonIcon} />
              </button>
            </div>
          </motion.div>

          {/* Floating Elements */}
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
                y: [0, 30, 0],
                x: [0, -20, 0],
                rotate: [0, -10, 0]
              }}
              transition={{
                duration: 10,
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

export default ClinicalTeam;