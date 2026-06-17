import styles from './RelatedCorporates.module.css';
import { formatDateToIST } from '@/utils/dateFormatter';

export default function RelatedCorporates({ commonDirectorship, loading, error }) {

  if (loading || !commonDirectorship) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Related Companies</h1>
          <div className={styles.headerInfo}>
            {/* <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100px' }} />
            <div className={styles.infoDivider}></div> */}
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '150px' }} />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '120px' }} /></th>
                <th className={styles.th}><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '120px' }} /></th>
                <th className={styles.th}><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '120px' }} /></th>
                <th className={styles.th}><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '120px' }} /></th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className={styles.skeletonRow}>
                  <td className={styles.td}>
                    <div className={styles.companyCell}>
                      <div className={`${styles.skeleton} ${styles.skeletonIcon}`} />
                      <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '180px' }} />
                    </div>
                  </td>
                  <td className={styles.td}><div className={`${styles.skeleton} ${styles.skeletonText}`} /></td>
                  <td className={styles.td}><div className={`${styles.skeleton} ${styles.skeletonText}`} /></td>
                  <td className={styles.td}><div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '80px', borderRadius: '9999px' }} /></td>
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

  const tableData = commonDirectorship?.common_directorships;
  console.log(commonDirectorship.target_company)

  if (!tableData?.length) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>
            Related Companies
          </h1>
        </div>
        <p className={styles.notAvailable}>Data not available.</p>
      </div>
    )
  }





  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Related Companies</h1>
        <div className={styles.headerInfo}>
          {/* <span className={styles.infoGroup}>
            <span className={styles.infoLabel}>Source:</span>
            <span className={styles.infoValue}>{commonDirectorship?.source || '-'}</span>
          </span>
          <span className={styles.infoDivider}></span> */}
          <span className={styles.infoGroup}>
            <span className={styles.infoLabel}>Last Updated:</span>
            <span className={styles.infoValue}>{formatDateToIST(commonDirectorship?.last_updated) || "-"}</span>
          </span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Company Name</th>
              <th className={styles.th}>Common Directorship</th>
              <th className={styles.th}>Incorporation Date</th>
              <th className={styles.th}>Company Status</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {tableData.map((row, index) => (
              <tr key={index} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.companyCell}>
                    <div className={styles.companyIconWrapper}>
                      <img
                        src="/icons/Image.svg"
                        className={styles.companyIcon}
                        alt=""
                      />
                    </div>
                    <span className={styles.companyName}>{row.company_name || "-"}</span>
                  </div>
                </td>
                <td className={styles.td}>{row.common_director || "-"}</td>
                <td className={styles.td}>{row.tenure === "N/A" || row.tenure ? row.tenure : "-"}</td>
                <td className={styles.td}>
                  <span className={styles.statusBadge}>{row.status || "-"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}