import styles from "./PeerComparison.module.css";
import { formatDateToIST } from "@/utils/dateFormatter";
import CompanyCharts from "../charts/CompanyCharts";

export default function PeerComparison({ 
  data, 
  loading, 
  error, 
  page, 
  perPage, 
  setPage, 
  setPerPage 
}) {
  if (loading || (!data && !error)) {
    // ... skeleton rendering stays the same (I'll keep it for now)
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Peer Comparison</h2>
        </div>
        
        <section className={styles.sectionCard}>
          <div className={`${styles.skeleton} ${styles.skeletonChart}`}></div>
        </section>

        <section className={styles.tableContainer}>
          <table className={styles.fullTable}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>CMP</th>
                <th>Market Cap</th>
                <th>P/E Ratio</th>
                <th>Industry P/E</th>
                <th>Revenue Growth</th>
                <th>Profit Growth</th>
                <th>ROCE</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className={styles.skeletonRow}>
                  <td>
                    <div className={styles.companyCell}>
                      <div className={`${styles.skeleton} ${styles.skeletonIcon}`}></div>
                      <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '120px' }}></div>
                    </div>
                  </td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonText}`}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  if (!data) {
    return null; 
  }

  const peerData = data?.peer_companies?.items || [];

  return (
    <main className={styles.mainContainer}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Peer Comparison</h1>
        <div className={styles.headerInfo}>
          <span className={styles.infoGroup}>
            <span className={styles.infoLabel}>Source:</span>
            <span className={styles.infoValue}>{data.source || "-"}</span>
          </span>
          <span className={styles.infoDivider}></span>
          <span className={styles.infoGroup}>
            <span className={styles.infoLabel}>Last Updated:</span>
            <span className={styles.infoValue}>{data.last_updated || "-"}</span>
          </span>
        </div>
      </div>

      <CompanyCharts 
        businessActivity={data?.business_activity} 
        peerComparisonData={data}
        peerComparisonLoading={loading}
      />

      <section className={styles.tableContainer}>
        <table className={styles.fullTable}>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>CMP</th>
              <th>Market Cap</th>
              <th>P/E Ratio</th>
              <th>Industry P/E</th>
              <th>Revenue Growth</th>
              <th>Profit Growth</th>
              <th>ROCE</th>
            </tr>
          </thead>
          <tbody>
            {peerData.map((row, i) => (
              <tr key={i}>
                <td className={styles.companyCell}>
                  {row.company_logo && row.company_logo !== "-" ? (
                    <img
                      src={row.company_logo}
                      alt={row.company_name}
                      className={styles.companyIcon}
                    />
                  ) : (
                    <img
                      src="/icons/Image.svg"
                      alt={row.company_name}
                      className={styles.companyIcon}
                    />
                  )}
                  <span className={styles.companyName} title={row.company_name}>
                    {row.company_name}
                  </span>
                </td>

                <td>{row.cmp || "-"}</td>
                <td>{row.market_cap || "-"}</td>
                <td>{row.pe || "-"}</td>
                <td>{row.industry_pe || "-"}</td>
                <td>{row.sales_growth || "-"}</td>
                <td>{row.profit_growth || "-"}</td>
                <td>{row.roce || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className={styles.paginationContainer}>
          <span>
            Showing {(page - 1) * perPage + 1}-
            {Math.min(page * perPage, data.peer_companies?.total || 0)} of{" "}
            {data.peer_companies?.total || 0}
          </span>
          <div className={styles.paginationRight}>
            <div className={styles.rowsPerPage}>
              <span>Rows per page</span>
              <select
                className={styles.rowsSelect}
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className={styles.pageInfo}>
              Page {data.peer_companies?.page || 1} of{" "}
              {data.peer_companies?.pages || 1}
            </div>
            <div className={styles.paginationControls}>
              <button
                className={styles.paginationButton}
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                &lt;
              </button>
              <button
                className={styles.paginationButton}
                disabled={page === (data.peer_companies?.pages || 1)}
                onClick={() =>
                  setPage((prev) =>
                    Math.min(prev + 1, data.peer_companies?.pages || 1)
                  )
                }
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
