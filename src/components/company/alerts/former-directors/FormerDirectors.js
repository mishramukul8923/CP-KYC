import styles from "./FormerDirectors.module.css";

export default function FormerDirectors({ alertsData, alertsLoading, alertsError }) {

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
                <th>Director Name</th>
                <th>Related Entity</th>
                <th>Default Type</th>
                <th>Regulatory Action</th>
                <th>Period</th>
                <th>Status</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, index) => (
                <tr key={index}>
                  <td className={styles.directorCell}>
                    <div className={styles.directorWrapper}>
                      <div className={`${styles.skeleton} ${styles.skeletonAvatar}`} />
                      <div className={`${styles.skeleton} ${styles.skeletonRow}`} style={{ width: '100px' }} />
                    </div>
                  </td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
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

  const data = alertsData?.former_directors || [];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Former Director Disqualifications & Defaults</h3>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Director Name</th>
              <th>Related Entity</th>
              <th>Default Type</th>
              <th>Regulatory Action</th>
              <th>Period</th>
              <th>Status</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index}>
                  <td className={styles.directorCell}>
                    <div className={styles.directorWrapper}>
                      <img
                        src="/images/avatar-default.svg"
                        alt={row.name}
                        width="40"
                        height="40"
                        className={styles.avatar}
                      />
                      <span className={styles.directorName}>
                        {row.name || "-"}
                      </span>
                    </div>
                    {row.label && <span className={styles.directorLabel}>{row.label}</span>}
                  </td>
                  <td className={styles.entityCell}>{row.entity || "-"}</td>
                  <td>{row.type || "-"}</td>
                  <td>{row.action || "-"}</td>
                  <td>{row.period || "-"}</td>
                  <td>
                    {row.status && (
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        {row.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {row.severity && (
                      <span className={`${styles.badge} ${styles.badgeHigh}`}>
                        <span className={styles.dotRed}></span>
                        {row.severity}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#71717A', fontStyle: 'italic' }}>
                  No former director disqualifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
