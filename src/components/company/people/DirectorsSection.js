import React from 'react';
import styles from './DirectorsSection.module.css';
import { formatDateToIST } from '@/utils/dateFormatter';
import DirectorProfile from './DirectorProfile';
import { useCompanySection } from '@/components/company/context/CompanySectionContext';

const DirectorsSection = ({ directorsData, directorsLoading, directorsError }) => {
  const { setActiveSection } = useCompanySection() || {};

  if (directorsError) {
    return (
      <div className={styles.container}>
        <div style={{ color: "red", fontWeight: 500 }}>
          {directorsError}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Current Directors', value: directorsData?.summary?.current_directors ?? "-", colorClass: styles.blueStat },
    { label: 'Past Directors', value: directorsData?.summary?.past_directors ?? "-", colorClass: styles.greenStat },
    { label: 'Current KMPs', value: directorsData?.summary?.current_kmp ?? "-", colorClass: styles.redStat },
    { label: 'Past KMPs', value: directorsData?.summary?.past_kmp ?? "-", colorClass: styles.purpleStat },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Directors & KMP Details</h1>
        <div className={styles.headerInfo}>
          {directorsLoading || !directorsData ? (
            <>
              {/* <div className={`${styles.skeleton} ${styles.skeletonHeaderInfo}`} />
              <div className={styles.infoDivider}></div> */}
              <div className={`${styles.skeleton} ${styles.skeletonHeaderInfo}`} />
            </>
          ) : (
            <>
              {/* <span className={styles.infoGroup}>
                <span className={styles.infoLabel}>Source:</span>
                <span className={styles.infoValue}>{directorsData?.summary?.source || "-"}</span>
              </span>
              <span className={styles.infoDivider}></span> */}
              <span className={styles.infoGroup}>
                <span className={styles.infoLabel}>Last Updated:</span>
                <span className={styles.infoValue}>{formatDateToIST(directorsData?.summary?.last_updated) || "-"}</span>
              </span>
            </>
          )}
        </div>
      </div>

      <div className={styles.blurContainer}>
        {!directorsLoading && !directorsError && directorsData && (!directorsData.directors || directorsData.directors.length === 0) && (
          <div className={styles.overlay}>
            <span className={styles.overlayTitle}>Data not available.</span>
            <span className={styles.overlaySubtitle}>Need MCA Documents.</span>
            <div className={styles.lockIcon} onClick={() => { setActiveSection?.("documents"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
            </div>
          </div>
        )}

        <div className={!directorsLoading && directorsData && (!directorsData.directors || directorsData.directors.length === 0) ? styles.blurContent : ""}>
          <div className={styles.statsGrid}>
            {directorsLoading || !directorsData ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className={`${styles.skeleton} ${styles.skeletonStatCard}`} />
              ))
            ) : (
              stats.map((stat, index) => (
                <div key={index} className={`${styles.statCard} ${stat.colorClass}`}>
                  <p className={styles.statLabel}>{stat.label}</p>
                  <p className={styles.statValue}>{stat.value}</p>
                </div>
              ))
            )}
          </div>

          {directorsLoading || !directorsData ? (
            <div className={`${styles.skeleton} ${styles.skeletonProfileCard}`} />
          ) : (
            <DirectorProfile
              directors={directorsData?.directors}
              companyName={directorsData?.company_name || ""}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorsSection;