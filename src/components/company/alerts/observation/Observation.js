import styles from "./Observation.module.css";

const SECTIONS_CONFIG = [
  // {
  //   id: "risk-cat",
  //   title: "Risk Categorisation & EDD Flag",
  //   icon: "/icons/alert-icon.svg",
  //   headers: ["Risk Category", "EDD Required", "Key Risk Drivers", "Last Assessed", "Source"],
  //   data: [
  //     { cat: "High", edd: "Yes", drivers: "Director disqualification, SEBI investigation, GST cancellation, adverse media coverage", date: "08 Jan 2026", src: "Automated Risk Engine" }
  //   ]
  // },
  // ... more sections
];

export default function Observation({ alertsData, alertsLoading, alertsError }) {

  if (alertsError) {
    return (
      <div className={styles.container}>
        <div style={{ color: "red", fontWeight: 500 }}>
          {alertsError}
        </div>
      </div>
    );
  }

  if (alertsLoading || !alertsData) {
    return (
      <div className={styles.container}>
        {[...Array(3)].map((_, sIdx) => (
          <section key={sIdx} className={styles.section}>
            <div className={`${styles.skeleton} ${styles.skeletonSectionTitle}`} />
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {[...Array(5)].map((_, hIdx) => <th key={hIdx}><div className={`${styles.skeleton} ${styles.skeletonRow}`} style={{ width: '80px' }} /></th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(2)].map((_, rIdx) => (
                    <tr key={rIdx}>
                      {[...Array(5)].map((_, cIdx) => <td key={cIdx}><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    );
  }

  const renderCell = (val, key) => {
    if (val === "High") return <span className={`${styles.badge} ${styles.high}`}><span className={styles.dotRed}></span>High</span>;
    if (val === "Yes") return <span className={`${styles.badge} ${styles.yes}`}>Yes</span>;
    if (val === "Pending") return <span className={`${styles.badge} ${styles.pending}`}>Pending</span>;
    if (key === "hasAction")
      return (
        <div className={styles.actionIcon}>
          <img
            src="/icons/eye.svg"
            alt="View"
            width="20"
            height="20"
          />
        </div>
      );

    return val;
  };

  // Currently, the component uses SECTIONS_CONFIG which is empty. 
  // If alertsData has specific observations, we would map them here.
  // For now, we'll keep the existing structure but show an empty state if no config.

  if (SECTIONS_CONFIG.length === 0) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '40px', color: '#71717A', fontStyle: 'italic', border: '1px dashed #e2e8f0', borderRadius: '12px' }}>
          No specific observations found for this company.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {SECTIONS_CONFIG.map((section) => (
        <section key={section.id} className={styles.section}>
          <h3 className={styles.sectionTitle}>
            {section.icon && <img src={section.icon} alt="" width="22" height="22" />}
            {section.title}
          </h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>{section.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {section.data.map((row, i) => (
                  <tr key={i}>
                    {Object.entries(row).map(([key, val], j) => (
                      <td key={j}>{renderCell(val, key)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}