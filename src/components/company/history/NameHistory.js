import React from 'react';
import styles from './NameHistory.module.css';
import { useCompanySection } from "@/components/company/context/CompanySectionContext";

const NameHistory = ({ companyData, loading, error }) => {
  const { setActiveSection } = useCompanySection();

  if (loading || !companyData) {
    return (
      <div className={styles.container}>
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Former Name</th>
                <th className={styles.th}>Changed From</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(2)].map((_, index) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
                  </td>
                  <td className={styles.td}>
                    <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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


  const historyData = companyData?.name_history || [];
  const hasData = historyData.length > 0;

  // Use mock data if no real data is available for the blurred state
  const displayData = hasData ? historyData : [
    { name: "Vishal Chemical (India) Limited", tillDate: "19 Sep 1987" },
    { name: "Sample Company Private Limited", tillDate: "10 Jan 2010" }
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Name History</h2>

      <div className={styles.blurContainer}>
        {!hasData && (
          <div className={styles.overlay}>
            <span className={styles.overlayTitle}>Content Not Available</span>
            <span className={styles.overlaySubtitle}>Need MCA Documents.</span>
            <div className={styles.lockIcon} onClick={() => { setActiveSection("documents"); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
            </div>
          </div>
        )}

        <div className={`${styles.tableWrapper} ${!hasData ? styles.blurTable : ""}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Till Date</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item, index) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.td}>{item.name || "-"}</td>
                  <td className={styles.td}>{item.till_date || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NameHistory;