import React from 'react';
import styles from './CompanyOverview.module.css';
import { formatDateToIST } from '@/utils/dateFormatter';


const CompanyOverview = ({ companyData, loading, error }) => {
  if (loading || !companyData) {
    return (
      <div className={styles.container}>
        <div className={`${styles.skeleton} ${styles.skeletonHeader}`} />
        <div className={styles.aboutSection}>
          <div className={`${styles.skeleton} ${styles.skeletonAboutTitle}`} />
          <div className={`${styles.skeleton} ${styles.skeletonAboutContent}`} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ color: "red", fontWeight: 500 }}>
          {error}
        </div>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Company Details</h1>
        <div className={styles.metaInfo}>
          {/* <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Source:</span>
            <span className={styles.metaValue}>{companyData?.header?.source || "-"}</span>
          </div>
          <div className={styles.divider}></div> */}
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Last Updated:</span>
            <span className={styles.metaValueText}>{formatDateToIST(companyData?.header?.last_updated) || "-"}</span>
          </div>
        </div>
      </div>

      <div className={styles.aboutSection}>
        <div className={styles.sectionTitle}>About</div>

        <div className={styles.contentBox}>
          <p className={styles.description}>
            {companyData?.about?.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;