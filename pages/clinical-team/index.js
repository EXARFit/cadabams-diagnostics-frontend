// pages/clinical-team/index.jsx
"use client";
import React from 'react';
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

const ClinicalTeam = () => {
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

  return (
    <AuthProvider>
      <Layout title="Clinical Team | Cadabams Diagnostics">
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
                    <button className={styles.appointmentButton}>
                      Book Appointment
                      <ChevronRight className={styles.buttonIcon} />
                    </button>
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

              <button className={styles.contactButton}>
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