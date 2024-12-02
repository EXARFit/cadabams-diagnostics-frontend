import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.logo}>
            <img
              src="https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1728018316689-966136917.png"
              alt="Cadabams"
            />
          </div>
        </div>
        
        <div className={styles.links}>
          {/* Company Column */}
          <div className={styles.column}>
            <h3>Company</h3>
            <ul>
              <li>
                <Link href="/aboutus">About Us</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/blogs">Blogs</Link>
              </li>
              <li>
                <Link href="/contact-us">Contact Us</Link>
              </li>
              <li>
                <Link href="/nabl-data">NABL Data</Link>
              </li>
              <li>
                <Link href="/responsible-disclosure">Responsible Disclosure</Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className={styles.column}>
            <h3>Services</h3>
            <ul>
              <li>
                <Link href="/lab-tests">Lab Tests</Link>
              </li>
              <li>
                <Link href="/xray-scans">XRay Scans</Link>
              </li>
              <li>
                <Link href="/mri-scans">MRI Scans</Link>
              </li>
              <li>
                <Link href="/ultrasound-scans">Ultrasound Scans</Link>
              </li>
              <li>
                <Link href="/pregnancy-scans">Pregnancy Scans</Link>
              </li>
              <li>
                <Link href="/msk-scans">MSK Scans</Link>
              </li>
              <li>
                <Link href="/preventative-health-checkups">
                  Preventative Health Checkups
                </Link>
              </li>
            </ul>
          </div>

          {/* Diagnostic Centres Column */}
          <div className={styles.column}>
            <h3>Diagnostic Centres</h3>
            <ul>
              <li>
                <Link href="/bangalore/center/indiranagar">Indiranagar</Link>
              </li>
              <li>
                <Link href="/bangalore/center/banashankari">Banashankari</Link>
              </li>
              <li>
                <Link href="/bangalore/center/jayanagar">Jayanagar</Link>
              </li>
            </ul>
          </div>

          {/* Popular Lab Tests Column */}
          <div className={styles.column}>
            <h3>Popular Lab Tests</h3>
            <ul>
              <li>
                <Link href="/bangalore/lab-test/complete-blood-count-test-with-esr">
                  Complete Blood Count (CBC)
                </Link>
              </li>
              <li>
                <Link href="/bangalore/lab-test/glucose-fasting-test-gft">
                  Glucose Fasting Test
                </Link>
              </li>
              <li>
                <Link href="/bangalore/lab-test/urine-analysis">
                  Urine Analysis
                </Link>
              </li>
              <li>
                <Link href="/bangalore/lab-test/lipid-profile-test-lpt">
                  Lipid Profile Test
                </Link>
              </li>
              <li>
                <Link href="/bangalore/lab-test/liver-function-test-lft">
                  Liver Function Test
                </Link>
              </li>
              <li>
                <Link href="/bangalore/lab-test//thyroid-simulation-harmone-tsh">
                  Thyroid Stimulating Test (TSH)
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Radiology Tests Column */}
          <div className={styles.column}>
            <h3>Popular Radiology Tests</h3>
            <ul>
              <li>
                <Link href="/bangalore/radiology-scan/whole-abdomen">
                  Abdomen Ultrasound
                </Link>
              </li>
              <li>
                <Link href="/bangalore/radiology-scan/pelvic">
                  Pelvic Ultrasound
                </Link>
              </li>
              <li>
                <Link href="/bangalore/radiology-scan/pregnancy-tiffa">
                  Pregnancy TIFFA Scan
                </Link>
              </li>
              <li>
                <Link href="/bangalore/radiology-scan/lumbar-spine">
                  Lumbar Spine MRI
                </Link>
              </li>
              <li>
                <Link href="/bangalore/radiology-scan/chest-xray">
                  Chest XRay
                </Link>
              </li>
              <li>
                <Link href="/bangalore/radiology-scan/musculoskeletal">
                  Musculoskeletal Ultrasound
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.copyright}>
            © 2023 Cadabams Health Care Pvt. Ltd. All rights reserved
          </div>
          <div className={styles.terms}>
            <Link href="/terms">Terms</Link> |{' '}
            <Link href="/privacy-policy">Privacy Policy</Link> |{' '}
            <Link href="/cookie-policy">Cookie Policy</Link> |{' '}
            <Link href="/refund-policy">Refund Policy</Link> |{' '}
            <Link href="/legal">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}