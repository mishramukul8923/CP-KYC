import React, { useState, useEffect } from "react";
import styles from "./CompanyHighlights.module.css";
import { formatDateToIST } from "@/utils/dateFormatter";

const CompanyHighlights = ({ companyHighlights, page, limit, loading, error, setPage, setLimit }) => {


  const [activeTab, setActiveTab] = useState("open");


  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Company Highlights</h2>
          <div className={styles.headerInfo}>
            {/* <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Source:</span>
              <div className={`${styles.skeleton}`} style={{ width: '40px', height: '20px' }} />
            </div>
            <span className={styles.infoDivider}></span> */}
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Last Updated:</span>
              <div className={`${styles.skeleton}`} style={{ width: '120px', height: '20px' }} />
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Shareholding</h3>
          <div className={styles.card}>
            <div className={styles.statsGrid}>
              <div className={styles.statItemFirst}>
                <span className={styles.statLabel}>Total Equity Shares</span>
                <div className={`${styles.skeleton} ${styles.skeletonStatValue}`} />
              </div>
              <div className={styles.statItemMiddle}>
                <span className={styles.statLabel}>Promoter Holding</span>
                <div className={`${styles.skeleton} ${styles.skeletonStatValue}`} style={{ margin: '4px auto 0' }} />
              </div>
              <div className={styles.statItemLast}>
                <span className={styles.statLabel}>Non-Promoter Holding</span>
                <div className={`${styles.skeleton} ${styles.skeletonStatValue}`} style={{ marginLeft: 'auto' }} />
              </div>
            </div>
            <div className={styles.shareholdingSection}>
              <div className={`${styles.skeleton} ${styles.skeletonProgress}`} />
              <div className={styles.legendGrid}>
                <div className={`${styles.skeleton} ${styles.skeletonLegend}`} />
                <div className={`${styles.skeleton} ${styles.skeletonLegend}`} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.chargesHeader}>
            <h3 className={styles.sectionTitle}>Charges</h3>
            <div className={styles.toggleContainer}>
              <div className={`${styles.skeleton}`} style={{ width: '250px', height: '32px', borderRadius: '50px' }} />
            </div>
          </div>
          <div className={styles.card} style={{ padding: 0 }}>
            <div className={`${styles.skeleton} ${styles.skeletonTable}`} />
            <div className={`${styles.skeleton} ${styles.skeletonPagination}`} style={{ margin: '16px' }} />
          </div>
        </section>
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

  // if (!companyHighlights) {
  //   return <div className={styles.container}>Data not available.</div>;
  // }

  /* ================= SAFE DATA EXTRACTION ================= */

  const shareholding = companyHighlights?.shareholding || {};

  const openChargesObj = companyHighlights?.open_charges || {};
  const openCharges = openChargesObj?.items || [];

  const closedChargesObj = companyHighlights?.closed_charges || {};
  const closedCharges = closedChargesObj?.items || [];


  // const chargesData = [
  //   {
  //     id: "10036700",
  //     lender: "Others",
  //     amount: "15,750.00",
  //     creationDate: "29 Jan 2007",
  //     modificationDate: "24 Jul 2020",
  //   },
  // ];

  // const closedChargesData = [
  //   {
  //     id: "100592955",
  //     lender: "Yes Bank Limited",
  //     amount: "5.00",
  //     creationDate: "20 Jun 2022",
  //     modificationDate: "-",
  //     satisfactionDate: "27 Feb 2024",
  //   },
  //   {
  //     id: "100592956",
  //     lender: "HDFC Bank Limited",
  //     amount: "6.25",
  //     creationDate: "15 Aug 2022",
  //     modificationDate: "-",
  //     satisfactionDate: "30 Dec 2024",
  //   },
  //   {
  //     id: "100592957",
  //     lender: "ICICI Bank Limited",
  //     amount: "4.50",
  //     creationDate: "10 Sep 2022",
  //     modificationDate: "-",
  //     satisfactionDate: "15 Mar 2025",
  //   },
  //   {
  //     id: "100592958",
  //     lender: "State Bank of India",
  //     amount: "5.75",
  //     creationDate: "25 Oct 2022",
  //     modificationDate: "-",
  //     satisfactionDate: "01 Jan 2025",
  //   },
  //   {
  //     id: "100592959",
  //     lender: "Kotak Mahindra Bank",
  //     amount: "6.00",
  //     creationDate: "12 Nov 2022",
  //     modificationDate: "-",
  //     satisfactionDate: "10 Jul 2024",
  //   },
  // ];


  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Company Highlights</h1>
        <div className={styles.headerInfo}>
          {loading || !companyHighlights ? (
            <>
              {/* <div className={`${styles.skeleton} ${styles.skeletonStatValue}`} style={{ width: '150px' }} />
              <div className={styles.infoDivider}></div> */}
              <div className={`${styles.skeleton} ${styles.skeletonStatValue}`} style={{ width: '150px' }} />
            </>
          ) : (
            <>
              {/* <span className={styles.infoGroup}>
                <span className={styles.infoLabel}>Source:</span>
                <span className={styles.infoValue}>{companyHighlights?.source}</span>
              </span>
              <span className={styles.infoDivider}></span> */}
              <span className={styles.infoGroup}>
                <span className={styles.infoLabel}>Last Updated:</span>
                <span className={styles.infoValue}>{formatDateToIST(companyHighlights?.last_updated) || "-"}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Shareholding Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Shareholding </h2>
        <div className={styles.card}>
          {loading || !companyHighlights ? (
            <div className={styles.shareholdingSection}>
              <div className={styles.statsGrid}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`${styles.statItem} ${i === 0 ? styles.statItemFirst : i === 1 ? styles.statItemMiddle : styles.statItemLast}`}>
                    <div className={`${styles.skeleton} ${styles.skeletonStatValue}`} style={{ width: '100px', height: '14px' }} />
                    <div className={`${styles.skeleton} ${styles.skeletonStatValue}`} />
                  </div>
                ))}
              </div>
              <div className={styles.chartHeader}>
                <div className={styles.chartLine}></div>
                <div className={`${styles.skeleton} ${styles.skeletonStatValue}`} style={{ width: '100px', height: '20px' }} />
                <div className={styles.chartLine}></div>
              </div>
              <div className={`${styles.skeleton} ${styles.skeletonProgress}`} />
              <div className={styles.legendGrid} style={{ marginTop: '20px' }}>
                <div className={`${styles.skeleton} ${styles.skeletonLegend}`} />
                <div className={`${styles.skeleton} ${styles.skeletonLegend}`} />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.shareholdingSection}>
                <div className={styles.statsGrid}>
                  <div className={`${styles.statItem} ${styles.statItemFirst}`}>
                    <span className={styles.statLabel}>Total Equity Shares</span>
                    <span className={styles.statValue}>
                      {shareholding?.total_equity_shares?.toLocaleString() ?? "-"}
                    </span>
                  </div>
                  <div className={`${styles.statItem} ${styles.statItemMiddle}`}>
                    <span className={styles.statLabel}>Promoter Holding</span>
                    <span className={styles.statValue}>{shareholding.promoter_holding?.toLocaleString() ?? "-"}</span>
                  </div>
                  <div className={`${styles.statItem} ${styles.statItemLast}`}>
                    <span className={styles.statLabel}>Non-Promoter Holding</span>
                    <span className={styles.statValue}>{shareholding.non_promoter_holding?.toLocaleString() ?? "-"}</span>
                  </div>
                </div>
                <div className={styles.chartHeader}>
                  <div className={styles.chartLine}></div>
                  <span className={styles.chartHeaderText}>Shareholding</span>
                  <div className={styles.chartLine}></div>
                </div>

                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressPromoter}
                      style={{ width: `${Number(shareholding.promoter_percentage).toFixed(2) || 0}%` }}
                    ></div>
                    <div
                      className={styles.progressNonPromoter}
                      style={{ width: `${Number(shareholding.non_promoter_percentage).toFixed(2) || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className={styles.legendGrid}>
                <div className={styles.legendItem}>
                  <div className={`${styles.dot} ${styles.dotPromoter}`}></div>
                  <div>
                    <p className={styles.legendLabel}>Promoter</p>
                    <p className={styles.legendValue}>{Number(shareholding.promoter_percentage).toFixed(2) ?? "0"}%</p>
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.dot} ${styles.dotNonPromoter}`}></div>
                  <div>
                    <p className={styles.legendLabel}>Non Promoter</p>
                    <p className={styles.legendValue}>{Number(shareholding.non_promoter_percentage).toFixed(2) ?? "0"}%</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charges Section */}
      <div className={styles.section}>
        <div className={styles.chargesHeader}>
          <h2 className={styles.sectionTitle}>Charges</h2>
          <div className={styles.toggleContainer}>
            <div
              className={`${styles.toggleSlider}
               ${activeTab === "open"
                  ? styles.sliderOpen
                  : styles.sliderClosed
                }`}
            ></div>
            <button
              className={`${styles.toggleButton} 
              ${activeTab === "open"
                  ? styles.activeToggle
                  : ""
                }`}
              onClick={() => {
                setActiveTab("open");
                setPage(1);
              }}
            >
              Open Charges
            </button>
            <button
              className={`${styles.toggleButton} ${activeTab === "closed" ? styles.activeToggle : ""
                }`}
              onClick={() => {
                setActiveTab("closed");
                setPage(1);
              }}
            >
              Closed Charges
            </button>
          </div>
        </div>

        {loading || !companyHighlights ? (
          <div className={styles.chargesTableContainer}>
            <table className={styles.chargesTable}>
              <thead>
                <tr>
                  <th>Charge ID</th>
                  <th>Lender</th>
                  <th>Amount (Cr.)</th>
                  <th>Creation Date</th>
                  <th>Modification Date</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td><div className={`${styles.skeleton} ${styles.skeletonTableRow}`} /></td>
                    <td><div className={`${styles.skeleton} ${styles.skeletonTableRow}`} /></td>
                    <td><div className={`${styles.skeleton} ${styles.skeletonTableRow}`} /></td>
                    <td><div className={`${styles.skeleton} ${styles.skeletonTableRow}`} /></td>
                    <td><div className={`${styles.skeleton} ${styles.skeletonTableRow}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={`${styles.skeleton} ${styles.skeletonPagination}`} style={{ margin: '16px' }} />
          </div>
        ) : activeTab === "open" ? (
          <div className={styles.chargesTableContainer}>
            <table className={styles.chargesTable}>
              <thead>
                <tr>
                  <th>Charge ID</th>
                  <th>Lender</th>
                  <th>Amount (Cr.)</th>
                  <th>Creation Date</th>
                  <th>Modification Date</th>
                </tr>
              </thead>
              <tbody>
                {openCharges.length > 0 ? (openCharges.map((charge) => (
                  <tr key={charge.charge_id}>
                    <td>{charge.charge_id}</td>
                    <td>{charge.lender}</td>
                    <td>{charge.amount_cr || "-"}</td>
                    <td>{charge.creation_date || "-"}</td>
                    <td>{charge.modification_date || "-"}</td>
                  </tr>
                ))) : (
                  <tr>
                    <td colSpan="5" className={styles.noData}>
                      No open charges found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={styles.paginationContainer}>
              <span>
                Showing {(page - 1) * limit + 1}-
                {Math.min(page * limit, openChargesObj?.total || 0)} of{" "}
                {openChargesObj?.total || 0}
              </span>
              <div className={styles.paginationRight}>
                <div className={styles.rowsPerPage}>
                  <span>Rows per page</span>
                  <select
                    className={styles.rowsSelect}
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className={styles.pageInfo}>
                  {" "}
                  Page {openChargesObj?.page || 1} of{" "}
                  {openChargesObj?.pages || 1}
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
                    disabled={page === (openChargesObj?.pages || 1)}
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(prev + 1, openChargesObj?.pages || 1)
                      )
                    }
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "closed" ? (
          <div className={styles.chargesTableContainer}>
            <table className={styles.chargesTable}>
              <thead>
                <tr>
                  <th>Charge ID</th>
                  <th>Lender</th>
                  <th>Amount (Cr.)</th>
                  <th>Creation Date</th>
                  <th>Modification Date</th>
                  <th>Satisfaction Date</th>
                  {/* <th></th> */}
                </tr>
              </thead>
              <tbody>
                {closedCharges.length > 0 ? (
                  closedCharges.map((charge) => (
                    <tr key={charge.charge_id}>
                      <td>{charge.charge_id}</td>
                      <td>{charge.lender}</td>
                      <td>{charge.amount_cr || "-"}</td>
                      <td>{charge.creation_date || "-"}</td>
                      <td>{charge.modification_date || "-"}</td>
                      <td>{charge.satisfaction_date || "-"}</td>
                      {/* <td>
                        <button className={styles.actionButton}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                              fill="#0F172A"
                            />
                          </svg>
                        </button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className={styles.noData}>
                      No closed charges found on this page
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <div className={styles.paginationContainer}>
              <span>
                Showing {(page - 1) * limit + 1}-
                {Math.min(page * limit, closedChargesObj?.total || 0)} of{" "}
                {closedChargesObj?.total || 0}
              </span>
              <div className={styles.paginationRight}>
                <div className={styles.rowsPerPage}>
                  <span>Rows per page</span>
                  <select
                    className={styles.rowsSelect}
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className={styles.pageInfo}>
                  {" "}
                  Page {closedChargesObj?.page || 1} of{" "}
                  {closedChargesObj?.pages || 1}
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
                    disabled={page === (closedChargesObj?.pages || 1)}
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(prev + 1, closedChargesObj?.pages || 1)
                      )
                    }
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CompanyHighlights;
