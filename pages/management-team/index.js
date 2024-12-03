// pages/management-team/index.jsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Users, Star, Target,
  Linkedin, Mail, Phone,
  Calendar, Check,
  ChevronRight
} from 'lucide-react';
import Layout from '../../components/Layout';
import { AuthProvider } from '../../contexts/AuthContext';
import styles from './ManagementTeam.module.css';

const ManagementTeam = () => {
  const stats = [
    {
      value: "30+",
      label: "Years of Excellence",
      icon: Calendar,
      color: "#DB4B4B"
    },
    {
      value: "100+",
      label: "Team Members",
      icon: Users,
      color: "#DB4B4B"
    },
    {
      value: "95%",
      label: "Patient Satisfaction",
      icon: Star,
      color: "#DB4B4B"
    },
    {
      value: "5",
      label: "Specialized Departments",
      icon: Target,
      color: "#DB4B4B"
    }
  ];

  const teamMembers = [
    {
      name: "Cadabam M Ramesh",
      role: "CHAIRMAN, CADABAM'S GROUP",
      description: "Mr. Cadabam M. Ramesh, the nucleus of the organization, envisioned Cadabams as a place for treatment and solace for any form of healthcare concerns and issues. Incepted with a vision of delivering excellence to the patients, Mr. Cadabam has provided an unparalleled service by facilitating new outcomes in the Cadabam's Group.",
      achievements: [
        "Steering board priorities",
        "Focus on infrastructure development",
        "Emphasis on quality healthcare",
        "Creation of nurturing work environment"
      ]
    },
    {
      name: "Sudha R. Cadabam",
      role: "VICE CHAIRPERSON, CADABAM'S GROUP",
      description: "Mrs. Sudha R. Cadabam's prior experience oversees the Cadabam's Group's growth and sustainability. With 20 years of expertise, she molds, structures, and enables smooth & ideal functioning at the Cadabam's Group.",
      achievements: [
        "20+ years of healthcare expertise",
        "Focus on organizational growth",
        "Patient care enhancement",
        "Staff development initiatives"
      ]
    },
    {
      name: "M.K. Saraswathi",
      role: "VICE CHAIRPERSON, CADABAM'S GROUP",
      description: "Ms. M. K. Saraswathi has made an immense contribution to Cadabam's with her expertise of over two decades in the field of psychology. With her administrative skills and strategies, she designed the healthcare system in structuring the operational efficiency.",
      achievements: [
        "20+ years in psychology",
        "Healthcare system design",
        "Operational efficiency",
        "Department supervision"
      ]
    },
    {
      name: "Sandesh Cadabam",
      role: "DIRECTOR",
      description: "Mr. Sandesh R. Cadabam, a promising entrepreneur of the organization, is passionate about providing healthcare with international standards. With MSc. in International Business & Management from Manchester Business School, UK, he brings innovative strategic methods and modern thought to the organization.",
      achievements: [
        "International healthcare expertise",
        "Strategic innovation",
        "Team development",
        "Quality healthcare focus"
      ]
    },
    {
      name: "Neha S. Cadabam",
      role: "EXECUTIVE DIRECTOR & PSYCHOLOGIST",
      description: "Neha Cadabam is a Psychologist at Cadabam's Hospitals with over 11 years of experience in mental health. She specializes in preventive and promotive mental healthcare, helping individuals improve their mental health and promoting lifestyle changes.",
      achievements: [
        "11+ years in mental health",
        "Certified NLP Practitioner",
        "Multi-lingual expertise",
        "Specialized counseling approaches"
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
      <Layout title="Management Team | Cadabams Diagnostics">
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
                Our Management Team
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={styles.subtitle}
              >
                Meet the visionaries leading Cadabams towards excellence in healthcare
              </motion.p>
            </div>
          </div>

          {/* Stats Section */}
          <div className={styles.statsSection}>
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

          {/* Team Members Section */}
          <motion.div 
            className={styles.teamSection}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={styles.teamCard}
              >
                <div className={styles.teamHeader}>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.avatar}>{member.name[0]}</div>
                  </div>
                  <div className={styles.headerInfo}>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
                <div className={styles.teamBody}>
                  <p className={styles.description}>{member.description}</p>
                  <div className={styles.achievements}>
                    <h4>Key Contributions</h4>
                    <ul>
                      {member.achievements.map((achievement, idx) => (
                        <li key={idx}>
                          <Check className={styles.checkIcon} />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.contactButton}>
                      <Mail className={styles.buttonIcon} />
                      Contact
                    </button>
                    <button className={styles.linkedinButton}>
                      <Linkedin className={styles.buttonIcon} />
                      Connect
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
              <h3>Get in Touch with Our Management</h3>
              <p>Have questions or want to learn more about our leadership team?</p>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} />
                  <span>+91 1234567890</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail className={styles.contactIcon} />
                  <span>management@cadabams.com</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Elements for Visual Appeal */}
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

export default ManagementTeam;