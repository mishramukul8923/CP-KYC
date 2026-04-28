import styles from "./DefaultsViolations.module.css";

export default function DefaultsViolations({ alertsData, alertsLoading, alertsError }) {

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
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Regulator</th>
                <th style={{ width: "15%" }}>Entity</th>
                <th style={{ width: "25%" }}>Regulatory Charges</th>
                <th style={{ width: "25%" }}>Regulatory Action</th>
                <th style={{ width: "25%" }}>Further Developments</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, index) => (
                <tr key={index}>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const violations = alertsData?.regulatory_alerts || [];

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Company-Level Defaults & Violations</h3>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Regulator</th>
              <th style={{ width: "15%" }}>Entity</th>
              <th style={{ width: "25%" }}>Regulatory Charges</th>
              <th style={{ width: "20%" }}>Regulatory Action</th>
              <th style={{ width: "20%" }}>Further Developments</th>
            </tr>
          </thead>
          <tbody>
            {violations.length > 0 ? (
              violations.map((item, index) => (
                <tr key={index}>
                  <td>{item.regulator || "-"}</td>
                  <td>{item.entity || "-"}</td>
                  <td>
                    {item.regulatory_charges === "Not Available" ? (
                      <span className={styles.italicMuted}>{item.regulatory_charges}</span>
                    ) : (
                      item.regulatory_charges || "-"
                    )}
                  </td>
                  <td>{item.regulatory_action || "-"}</td>
                  <td>{item.further_developments || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#71717A', fontStyle: 'italic' }}>
                  No regulatory alerts found for this company.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}