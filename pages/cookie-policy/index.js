import React from "react";
import { AuthProvider } from "../../contexts/AuthContext";
import Layout from "@/components/Layout";
import styles from "./CookiePolicy.module.css";

const CookiePolicy = () => {
  const sections = [
    {
      title: "Introduction",
      content:
        "This Cookie Policy explains how Your Health Lab uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.",
    },
    {
      title: "What are cookies?",
      content:
        "Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.",
    },
    {
      title: "Why do we use cookies?",
      content:
        "We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as 'essential' or 'strictly necessary' cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our website. Third parties serve cookies through our website for advertising, analytics and other purposes.",
    },
    {
      title: "Types of cookies we use",
      content:
        "The specific types of first and third-party cookies served through our website and the purposes they perform are described below:\n\n1. Essential website cookies\n2. Performance and functionality cookies\n3. Analytics and customization cookies\n4. Advertising cookies\n5. Social networking cookies",
    },
    {
      title: "How can you control cookies?",
      content:
        "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.",
    },
    {
      title: "Changes to our Cookie Policy",
      content:
        "We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.",
    },
    {
      title: "Contact us",
      content:
        "If you have any questions about our use of cookies or other technologies, please email us at privacy@yourhealthlab.com or by post to: Your Health Lab, [Your Address Here].",
    },
  ];

  return (
    <AuthProvider>
      <Layout title="Cookie Policy | Your Health Lab">
        <div className={styles.container}>
          <h1 className={styles.title}>Cookie Policy</h1>
          <p className={styles.intro}>
            This Cookie Policy explains how Your Health Lab uses cookies and
            similar technologies to recognize you when you visit our website.
          </p>
          {sections.map((section, index) => (
            <div key={index} className={styles.sectionContainer}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <p className={styles.sectionContent}>{section.content}</p>
            </div>
          ))}
        </div>
      </Layout>
    </AuthProvider>
  );
};

export default CookiePolicy;
