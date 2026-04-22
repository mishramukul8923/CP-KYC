import React from 'react';
import styles from './NameHistory.module.css';

const NameHistory = (companyData, loading, error) => {

  if (loading) {
    return <div className={styles.container}>Loading highlights...</div>;
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

  if (!historyData.length) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Name History</h2>
        <p style={{ fontStyle: 'italic', fontWeight: 300, color: "#80858fff" }}>Download MCA document</p>
      </div>
    );
  }

  // const historyData = [
  //   {
  //     name: 'Vishal Chemical (India) Limited',
  //     tillDate: '19 Sep 1987',
  //   },
  //   {
  //     name: 'Vishal Chemical (India) Limited',
  //     tillDate: '19 Sep 1987',
  //   },
  // ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Name History</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Till Date</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((row, index) => (
              <tr key={index} className={styles.tr}>
                <td className={styles.td}>{row.name}</td>
                <td className={styles.td}>{row.tillDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NameHistory;