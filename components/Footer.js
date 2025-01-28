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
                <Link href="/about-us">About Us</Link>
              </li>
              <li>
                <Link href="/management-team">Management Team</Link>
              </li>
              <li>
                <Link href="/clinical-team">Clinical Team</Link>
              </li>
              {/* <li>
                <Link href="/careers">Careers</Link>
              </li> */}
              <li>
                <Link href="/blogs">Blogs</Link>
              </li>
              <li>
                <Link href="/contact-us">Contact Us</Link>
              </li>
              {/* <li>
                <Link href="/nabl-data">NABL Data</Link>
              </li>
              <li>
                <Link href="/responsible-disclosure">Responsible Disclosure</Link>
              </li> */}
            </ul>
          </div>

          {/* Services Column */}
          <div className={styles.column}>
            <h3>Services</h3>
            <ul>
              <li>
                <Link href="/lab-test">Lab Tests</Link>
              </li>
              <li>
                <Link href="/xray-scan">XRay Scans</Link>
              </li>
              <li>
                <Link href="/mri-scan">MRI Scans</Link>
              </li>
              <li>
                <Link href="/ultrasound-scan">Ultrasound Scans</Link>
              </li>
              <li>
                <Link href="/pregnancy-scan">Pregnancy Scans</Link>
              </li>
              <li>
                <Link href="/msk-scan">MSK Scans</Link>
              </li>
              {/* <li>
                <Link href="/preventative-health-checkups">
                  Preventative Health Checkups
                </Link>
              </li> */}
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
                <Link href="/bangalore/ultrasound-scan/abdominal-ultrasound">
                  Abdomen Ultrasound
                </Link>
              </li>
              <li>
                <Link href="/bangalore/ultrasound-scan/ultrasound-of-transvaginal-scan-tvs">
                  Pelvic Ultrasound
                </Link>
              </li>
              <li>
                <Link href="/bangalore/pregnancy-scan/pregnancy-tiffa-anomaly-scan-level-2-ultrasound">
                  Pregnancy TIFFA Scan
                </Link>
              </li>
              <li>
                <Link href="/bangalore/mri-scan/lumbar-lumbosacral-spine-without-contrast-mri">
                  Lumbar Spine MRI
                </Link>
              </li>
              <li>
                <Link href="/bangalore/xray-scan/chest-x-ray">
                  Chest XRay
                </Link>
              </li>
              <li>
                <Link href="/bangalore/ultrasound-scan/musculoskeletal-ultrasound-msk">
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
            <Link href="/terms-of-use">Terms</Link> |{' '}
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