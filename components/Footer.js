import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
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
          <div className={styles.socialIcons}>
            <a href="#" className={styles.icon} aria-label="Instagram">
              <Instagram />
            </a>
            <a href="#" className={styles.icon} aria-label="Facebook">
              <Facebook />
            </a>
            <a href="#" className={styles.icon} aria-label="LinkedIn">
              <Linkedin />
            </a>
            <a href="#" className={styles.icon} aria-label="Twitter">
              <Twitter />
            </a>
          </div>
          <div className={styles.appStores}>
            <a href="#">
              <img src="/placeholder.svg?height=40&width=120" alt="App Store" />
            </a>
            <a href="#">
              <img
                src="/placeholder.svg?height=40&width=120"
                alt="Google Play"
              />
            </a>
          </div>
        </div>
        <div className={styles.links}>
          <div className={styles.column}>
            <h3>Company</h3>
            <ul>
              <li>
                <a href="/aboutus">About Us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <Link href="/blogs">Blogs</Link>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">NABL Data</a>
              </li>
              <li>
                <a href="#">Responsible Disclosure</a>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>Partners</h3>
            <ul>
              <li>
                <a href="#">For Doctors</a>
              </li>
              <li>
                <a href="#">For Corporates</a>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>Lab tests across Bangalore</h3>
            <ul>
              <li>
                <Link href="/bangalore/lab-test-in-whitefield">
                  Lab test in Whitefield
                </Link>
              </li>
              <li>
                <Link href="/bangalore/lab-test-in-indiranagar">
                  Lab test in Indiranagar
                </Link>
              </li>
              <li>
                <Link href="/bangalore/lab-test-in-koramangala">
                  Lab test in Koramangala
                </Link>
              </li>
              <li>
                <Link href="/bangalore/lab-test-in-jayanagar">
                  Lab test in Jayanagar
                </Link>
              </li>
              <li>
                <Link href="/bangalore/lab-test-in-hebbal">
                  Lab test in Hebbal
                </Link>
              </li>
              <li>
                <Link href="/bangalore/lab-test-in-hsr-layout">
                  Lab test in HSR Layout
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>Health checkups across Bangalore</h3>
            <ul>
              <li>
                <Link href="/bangalore/full-body-checkup-in-whitefield">
                  Full Body Checkup in Whitefield
                </Link>
              </li>
              <li>
                <Link href="/bangalore/full-body-checkup-in-indiranagar">
                  Full Body Checkup in Indiranagar
                </Link>
              </li>
              <li>
                <Link href="/bangalore/full-body-checkup-in-koramangala">
                  Full Body Checkup in Koramangala
                </Link>
              </li>
              <li>
                <Link href="/bangalore/full-body-checkup-in-jayanagar">
                  Full Body Checkup in Jayanagar
                </Link>
              </li>
              <li>
                <Link href="/bangalore/full-body-checkup-in-hebbal">
                  Full Body Checkup in Hebbal
                </Link>
              </li>
              <li>
                <Link href="/bangalore/full-body-checkup-in-hsr-layout">
                  Full Body Checkup in HSR Layout
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
            <Link href="/terms-of-use">Terms</Link> |
            <Link href="/privacy-policy">Privacy Policy</Link> |
            <Link href="/cookie-policy">Cookie Policy</Link> |
            <Link href="/refund-policy">Refund Policy</Link> |
            <Link href="/legal">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
