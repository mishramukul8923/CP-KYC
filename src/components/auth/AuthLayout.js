"use client";
import styles from "./Auth.module.css";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="/icons/pdfLogocompanyWiki.png" alt="Corporate Professionals" className={styles.logo} />
        </Link>
      </div>
      <div className={styles.authCard}>
        {children}
      </div>
    </div>
  );
}
