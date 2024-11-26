import React from 'react';
import styles from './ClinicalTeam.module.css';

const ClinicalTeam = () => {
  const clinicalTeam = [
    {
      name: "Dr S Pradeep",
      role: "Consultant specialist in Radiology and Fetal Medicine",
      qualifications: "MBBS, MD, DNB (Radiodiagnosis)",
      expertise: [
        "Fetal TIFFA ECHO Neurosonogram",
        "Doppler CVS Amniocentesis",
        "Fetal reductions",
        "3D TVS",
        "Sonofetulography"
      ]
    },
    {
      name: "Dr Divya Cadabam",
      role: "Consultant specialist in Radiology and Fetal Medicine",
      qualifications: "MBBS, MD Radiodiagnosis",
      expertise: [
        "Women's Imaging",
        "Fertility Imaging",
        "Fetal Diagnosing Imaging",
        "Fetal Interventions",
        "Advanced Ultrasonography"
      ]
    },
    {
      name: "Dr Shreyas Cadabam",
      role: "Consultant specialist in Radiology and Interventional Musculoskeletal Imaging",
      qualifications: "MBBS, MD Radiodiagnosis",
      expertise: [
        "Musculoskeletal Imaging",
        "Interventional Radiology",
        "Advanced Diagnostic Imaging",
        "Joint Injections",
        "Sports Injury Imaging"
      ]
    }
  ];

  return (
    <section className={styles.clinicalSection}>
      <h2 className={styles.sectionTitle}>Clinical Team</h2>
      <div className={styles.teamGrid}>
        {clinicalTeam.map((member, index) => (
          <div key={index} className={styles.memberCard}>
            <div className={styles.memberInfo}>
              <h3>{member.name}</h3>
              <p className={styles.qualifications}>{member.qualifications}</p>
              <p className={styles.role}>{member.role}</p>
            </div>
            <div className={styles.expertise}>
              <h4>Areas of Expertise:</h4>
              <ul>
                {member.expertise.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClinicalTeam;