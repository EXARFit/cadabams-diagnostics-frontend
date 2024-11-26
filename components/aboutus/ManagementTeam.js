import React from 'react';
import styles from './ManagementTeam.module.css';

const ManagementTeam = () => {
  const team = [
    {
      name: "Mr. Cadabam M. Ramesh",
      role: "CHAIRMAN, CADABAM'S GROUP",
      description: "Mr. Cadabam M. Ramesh, the nucleus of the organization, envisioned Cadabams as a place for treatment and solace for any form of healthcare concerns and issues.",
    },
    {
      name: "Mrs. Sudha R. Cadabam",
      role: "DIRECTOR",
      description: "With over two decades of experience in healthcare management, Mrs. Sudha has been instrumental in shaping the organization's patient-centric approach.",
    },
    {
      name: "M.K. Saraswathi",
      role: "EXECUTIVE DIRECTOR",
      description: "A veteran in healthcare administration, bringing valuable expertise in operational excellence and strategic planning to the organization.",
    },
    {
      name: "Sandesh Cadabam",
      role: "DIRECTOR",
      description: "Leading innovation and technological advancement in our diagnostic services.",
    },
    {
      name: "Neha S. Cadabam",
      role: "DIRECTOR",
      description: "Focusing on quality improvement and patient experience enhancement.",
    }
  ];

  return (
    <section className={styles.managementSection}>
      <h2 className={styles.sectionTitle}>Management Team</h2>
      <div className={styles.teamGrid}>
        {team.map((member, index) => (
          <div key={index} className={styles.memberCard}>
            <h3>{member.name}</h3>
            <p className={styles.role}>{member.role}</p>
            <p className={styles.description}>{member.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ManagementTeam;