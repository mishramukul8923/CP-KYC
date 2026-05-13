import styles from "./OverseasDirectInvestment.module.css";
import RowsPerPage from "@/components/common/RowsPerPage";
import { useState } from "react";

export default function InvestmentPage({ overseasInvestmentData }) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const rawOdi = overseasInvestmentData?.overseas_direct_investments?.items;
  const data = Array.isArray(rawOdi) ? rawOdi.map(item => ({
    year: item.year || "-",
    month: item.month || "-",
    name: item.name_of_the_jv_wos || "-",
    type: item.joint_venture_wholly_owned_subsidiary || "-",
    activity: item.major_activity || "-",
    equity: item.equity || "-",
    loan: item.loan || "-",
    guarantee: item.guarantee_issued || "-",
    total: item.total || "-",
  })) : [];

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPageData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Overseas Direct Investment</h1>
        <span className={styles.currency}>In USD Million</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Year</th>
              <th>Month</th>
              <th>Name of the JV/WOS</th>
              <th>Joint Venture/Wholly Owned Subsidiar</th>
              <th>Major Activity</th>
              <th>Equity</th>
              <th>Loan</th>
              <th>Guarantee Issued</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((row, index) => (
                <tr key={index}>
                  <td>{row.year || "-"}</td>
                  <td>{row.month || "-"}</td>
                  <td className={styles.nameCell}>{row.name || "-"}</td>
                  <td>{row.type || "-"}</td>
                  <td>{row.activity || "-"}</td>
                  <td>{row.equity || "-"}</td>
                  <td>{row.loan || "-"}</td>
                  <td>{row.guarantee || "-"}</td>
                  <td>{row.total || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>Data not available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <div className={styles.pageCount}>
          Showing {data.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + rowsPerPage, data.length)} of {data.length}
        </div>
        <div className={styles.controls}>
          <div className={styles.rowsPerPage}>
            <span className={styles.rowsPerPageText}>Rows per page</span>
            <RowsPerPage
              value={rowsPerPage}
              onChange={(val) => {
                setRowsPerPage(val);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className={styles.pageNavigation}>
            <span className={styles.pageNavigationText}>Page {currentPage} of {totalPages || 1}</span>
            <div className={styles.navButtons}>
              <button
                className={`${styles.navBtn} ${currentPage === 1 ? styles.navBtnDisabled : ""}`}
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <img
                  src="/icons/chevrons-left.svg"
                  alt="First page"
                  className={styles.navIcon}
                />
              </button>
              <button
                className={`${styles.navBtn} ${currentPage === 1 ? styles.navBtnDisabled : ""}`}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <img
                  src="/icons/chevron-left.svg"
                  alt="Previous"
                  className={styles.navIcon}
                />
              </button>
              <button
                className={`${styles.navBtn} ${currentPage === totalPages || totalPages === 0 ? styles.navBtnDisabled : ""}`}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <img
                  src="/icons/chevron-right-black.svg"
                  alt="Next"
                  className={styles.navIcon}
                />
              </button>
              <button
                className={`${styles.navBtn} ${currentPage === totalPages || totalPages === 0 ? styles.navBtnDisabled : ""}`}
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <img
                  src="/icons/chevrons-right.svg"
                  alt="Last page"
                  className={styles.navIcon}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
