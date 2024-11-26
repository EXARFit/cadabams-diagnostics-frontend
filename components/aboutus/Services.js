import React from 'react';
import styles from './Services.module.css';

const Services = () => {
  const services = [
    {
      title: "Diagnostic Services",
      items: [
        "X-Ray",
        "IVP/MCU/MCU and barium studies",
        "Hysterosalpingography",
        "Ultrasonography",
        "Laboratory services",
        "Cardiology services"
      ]
    },
    {
      title: "Specialized Procedures",
      items: [
        "USG guided fetal procedure",
        "USG guided Musculoskeletal procedures",
        "Pharmacologically induced joints injection",
        "Fine needle aspiration and biopsy",
        "Perinatal sonography"
      ]
    },
    {
      title: "Additional Services",
      items: [
        "24/7 Emergency Care",
        "Home Collection",
        "Online Reports",
        "Expert Consultation",
        "Second Opinion"
      ]
    }
  ];

  return (
    <section className={styles.servicesSection}>
      <h2 className={styles.sectionTitle}>Our Services</h2>
      <div className={styles.servicesGrid}>
        {services.map((service, index) => (
          <div key={index} className={styles.serviceCard}>
            <h3>{service.title}</h3>
            <ul>
              {service.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
