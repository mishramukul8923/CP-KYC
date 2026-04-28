"use client";
import React from "react";
import styles from "./ShareHoldingsTables2.module.css";
import RowsPerPage from "@/components/common/RowsPerPage";
import { useState } from "react";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";

const ShareHoldingsTables2 = ({ shareholdingData, securityAllotmentData }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fiiPage, setFiiPage] = useState(1);
  const [allotmentPage, setAllotmentPage] = useState(1);

  const rawDirectors = shareholdingData?.directors_shareholdings;
  const directorsData = (Array.isArray(rawDirectors) ? rawDirectors : []).map(d => ({
    name: d.director_name,
    type: d.share_type,
    held: d.shares_held,
    percent: d.percentage
  }));

  const rawFiiObj = shareholdingData?.foreign_institutional_investor;
  const rawFii = Array.isArray(rawFiiObj) ? rawFiiObj : (rawFiiObj?.items || []);
  const fiiData = rawFii.map(f => ({
    name: f.name_of_the_fii,
    type: f.share_type,
    held: f.shares_held,
    percent: f.percentage
  }));

  const rawAllotmentObj = securityAllotmentData?.allotment_records;
  const rawAllotment = Array.isArray(rawAllotmentObj) ? rawAllotmentObj : (rawAllotmentObj?.items || []);
  const allotmentData = rawAllotment.map(a => ({
    date: a.allotment_date,
    type: a.allotment_type,
    instrument: a.instrument,
    amount: a.amount_cr,
    count: a.no_of_securities_allotted,
    nominal: a.nominal_value,
    premium: a.premium_value
  }));

  const [isDirectorsOpen, setIsDirectorsOpen] = useState(true);
  const [isFiiOpen, setIsFiiOpen] = useState(true);
  const [isAllotmentOpen, setIsAllotmentOpen] = useState(true);

  const isAllotmentEmpty = !allotmentData || allotmentData.length === 0 || allotmentData.every(item =>
    Object.values(item).every(val => !val || val === "-" || val === "null" || val === "undefined")
  );

  const mockAllotmentData = [
    { date: "15 Oct 2023", type: "Rights Issue", instrument: "Equity Shares", amount: "50.00", count: "5,000,000", nominal: "10.00", premium: "90.00" },
    { date: "20 Jun 2022", type: "Bonus Issue", instrument: "Equity Shares", amount: "0.00", count: "10,000,000", nominal: "10.00", premium: "0.00" },
    { date: "10 Jan 2021", type: "Private Placement", instrument: "CCD", amount: "25.00", count: "250,000", nominal: "1000.00", premium: "0.00" }
  ];

  const displayAllotment = isAllotmentEmpty ? mockAllotmentData : allotmentData;
  const { setActiveSection } = useCompanySection() || {};

  return (
    <div className={styles.container}>
      {/* ... previous content preserved ... */}
      <div
        className={styles.headerRow}
        onClick={() => setIsDirectorsOpen(!isDirectorsOpen)}
      >
        <h2 className={styles.tableTitle}>{shareholdingData?.directors_shareholdings_table_title || "Directors Shareholdings"}</h2>
        <img
          src="/icons/chevron-down-dark.svg"
          alt="Expand"
          className={`${styles.expandIcon} ${isDirectorsOpen ? styles.rotateIcon : ""}`}
        />
      </div>

      {isDirectorsOpen && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thLeft}>Director Name</th>
                <th className={styles.thRight}>Share Type</th>
                <th className={styles.thRight}>Shares Held</th>
                <th className={styles.thRight}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {directorsData.length > 0 ? (
                directorsData.map((director, index) => (
                  <tr key={index}>
                    <td className={styles.tdName}>{director.name || "-"}</td>
                    <td className={styles.tdValue}>{director.type || "-"}</td>
                    <td className={styles.tdValue}>{director.held || "-"}</td>
                    <td className={styles.tdValue}>{director.percent && director.percent !== "-" ? `${director.percent}%` : "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.tdValue} style={{ textAlign: "center", padding: "20px" }}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.spacer}></div>

      <div
        className={styles.headerRow}
        onClick={() => setIsFiiOpen(!isFiiOpen)}
      >
        <h2 className={styles.tableTitle}>
          Foreign Institutional Investor
          {fiiData.length > 0 && (
            <span className={styles.tableCount}>
              ({Math.min((fiiPage - 1) * rowsPerPage + 1, fiiData.length)} - {Math.min(fiiPage * rowsPerPage, fiiData.length)} of {fiiData.length})
            </span>
          )}
        </h2>
        <img
          src="/icons/chevron-down-dark.svg"
          alt="Expand"
          className={`${styles.expandIcon} ${isFiiOpen ? styles.rotateIcon : ""}`}
        />
      </div>

      {isFiiOpen && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thLeft}>Name of the FII</th>
                  <th className={styles.thRight}>Share Type</th>
                  <th className={styles.thRight}>Shares Held</th>
                  <th className={styles.thRight}>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {fiiData.length > 0 ? (
                  fiiData.slice((fiiPage - 1) * rowsPerPage, fiiPage * rowsPerPage).map((fii, index) => (
                    <tr key={index}>
                      <td className={styles.tdName}>{fii.name || "-"}</td>
                      <td className={styles.tdValue}>{fii.type || "-"}</td>
                      <td className={styles.tdValue}>{fii.held || "-"}</td>
                      <td className={styles.tdValue}>{fii.percent && fii.percent !== "-" ? `${fii.percent}%` : "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className={styles.tdValue} style={{ textAlign: "center", padding: "20px" }}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {fiiData.length > 0 && (
            <div className={styles.paginationRow}>
              <span className={styles.showingText}>
                Showing {Math.min((fiiPage - 1) * rowsPerPage + 1, fiiData.length)}-{Math.min(fiiPage * rowsPerPage, fiiData.length)} of {fiiData.length}
              </span>
              <div className={styles.paginationControls}>
                <div className={styles.paginationInfo}>
                  <span className={styles.rowsLabel}>Rows per page</span>
                  <RowsPerPage
                    value={rowsPerPage}
                    onChange={(val) => {
                      setRowsPerPage(val);
                      setFiiPage(1);
                    }}
                  />
                </div>
                <span className={styles.pageLabel}>Page {fiiPage} of {Math.ceil(fiiData.length / rowsPerPage)}</span>
                <div className={styles.navButtons}>
                  <button
                    className={fiiPage === 1 ? styles.navBtnDisabled : styles.navBtn}
                    onClick={() => setFiiPage(1)}
                    disabled={fiiPage === 1}
                  >
                    <img
                      src="/icons/chevrons-left.svg"
                      alt="First page"
                      className={styles.navIcon}
                    />
                  </button>

                  <button
                    className={fiiPage === 1 ? styles.navBtnDisabled : styles.navBtn}
                    onClick={() => setFiiPage(prev => Math.max(1, prev - 1))}
                    disabled={fiiPage === 1}
                  >
                    <img
                      src="/icons/chevron-left.svg"
                      alt="Previous"
                      className={styles.navIcon}
                    />
                  </button>

                  <button
                    className={fiiPage === Math.ceil(fiiData.length / rowsPerPage) ? styles.navBtnDisabled : styles.navBtn}
                    onClick={() => setFiiPage(prev => Math.min(Math.ceil(fiiData.length / rowsPerPage), prev + 1))}
                    disabled={fiiPage === Math.ceil(fiiData.length / rowsPerPage) || fiiData.length === 0}
                  >
                    <img
                      src="/icons/chevron-right.svg"
                      alt="Next"
                      className={styles.navIcon}
                    />
                  </button>

                  <button
                    className={fiiPage === Math.ceil(fiiData.length / rowsPerPage) ? styles.navBtnDisabled : styles.navBtn}
                    onClick={() => setFiiPage(Math.ceil(fiiData.length / rowsPerPage))}
                    disabled={fiiPage === Math.ceil(fiiData.length / rowsPerPage) || fiiData.length === 0}
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
          )}
        </>
      )}

      <div className={styles.spacer}></div>

      <div
        className={styles.headerRow}
        onClick={() => setIsAllotmentOpen(!isAllotmentOpen)}
        id="Securities Allotment"
      >
        <h2 className={styles.tableTitle}>
          Securities Allotment
          {/* {allotmentData.length > 0 && (
            <span className={styles.tableCount}>
              ({Math.min((allotmentPage - 1) * rowsPerPage + 1, allotmentData.length)} - {Math.min(allotmentPage * rowsPerPage, allotmentData.length)} of {allotmentData.length})
            </span>
          )} */}
        </h2>
        <img
          src="/icons/chevron-down-dark.svg"
          alt="Expand"
          className={`${styles.expandIcon} ${isAllotmentOpen ? styles.rotateIcon : ""}`}
        />
      </div>

      {isAllotmentOpen && (
        <div className={styles.blurContainer}>
          {isAllotmentEmpty && (
            <div className={styles.overlay}>
              <span className={styles.overlayTitle}>Content Not Available</span>
              <span className={styles.overlaySubtitle}>Need MCA Documents.</span>
              <div className={styles.lockIcon} onClick={() => { setActiveSection?.("documents"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ cursor: "pointer" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
              </div>
            </div>
          )}
          <div className={isAllotmentEmpty ? styles.blurContent : ""}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.thLeft1}>Allotment Date</th>
                    <th className={styles.thLeft1}>Allotment Type</th>
                    <th className={styles.thLeft1}>Instrument</th>
                    <th className={styles.thLeft1}>Amount (Cr)</th>
                    <th className={styles.thLeft1}>No. of Securities Allotted</th>
                    <th className={styles.thLeft1}>Nominal Value</th>
                    <th className={styles.thLeft1}>Premium Value</th>
                  </tr>
                </thead>
                <tbody>
                  {displayAllotment.length > 0 ? (
                    displayAllotment.slice((allotmentPage - 1) * rowsPerPage, allotmentPage * rowsPerPage).map((item, index) => (
                      <tr key={index}>
                        <td className={styles.tdName}>{item.date || "-"}</td>
                        <td className={styles.tdName}>{item.type || "-"}</td>
                        <td className={styles.tdName}>{item.instrument || "-"}</td>
                        <td className={styles.tdName}>{item.amount || "-"}</td>
                        <td className={styles.tdName}>{item.count || "-"}</td>
                        <td className={styles.tdName}>{item.nominal || "-"}</td>
                        <td className={styles.tdName}>{item.premium || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className={styles.tdValue} style={{ textAlign: "center", padding: "20px" }}>No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {displayAllotment.length > 0 && (
              <div className={styles.paginationRow}>
                <span className={styles.showingText}>
                  Showing {Math.min((allotmentPage - 1) * rowsPerPage + 1, displayAllotment.length)}-{Math.min(allotmentPage * rowsPerPage, displayAllotment.length)} of {displayAllotment.length}
                </span>
                <div className={styles.paginationControls}>
                  <div className={styles.paginationInfo}>
                    <span className={styles.rowsLabel}>Rows per page</span>
                    <RowsPerPage
                      value={rowsPerPage}
                      onChange={(val) => {
                        setRowsPerPage(val);
                        setAllotmentPage(1);
                        setFiiPage(1); // Reset both to be consistent
                      }}
                    />
                  </div>
                  <span className={styles.pageLabel}>Page {allotmentPage} of {Math.ceil(displayAllotment.length / rowsPerPage)}</span>
                  <div className={styles.navButtons}>
                    <button
                      className={allotmentPage === 1 ? styles.navBtnDisabled : styles.navBtn}
                      onClick={() => setAllotmentPage(1)}
                      disabled={allotmentPage === 1}
                    >
                      <img
                        src="/icons/chevrons-left.svg"
                        alt="First page"
                        className={styles.navIcon}
                      />
                    </button>

                    <button
                      className={allotmentPage === 1 ? styles.navBtnDisabled : styles.navBtn}
                      onClick={() => setAllotmentPage(prev => Math.max(1, prev - 1))}
                      disabled={allotmentPage === 1}
                    >
                      <img
                        src="/icons/chevron-left.svg"
                        alt="Previous"
                        className={styles.navIcon}
                      />
                    </button>

                    <button
                      className={allotmentPage === Math.ceil(displayAllotment.length / rowsPerPage) ? styles.navBtnDisabled : styles.navBtn}
                      onClick={() => setAllotmentPage(prev => Math.min(Math.ceil(displayAllotment.length / rowsPerPage), prev + 1))}
                      disabled={allotmentPage === Math.ceil(displayAllotment.length / rowsPerPage) || displayAllotment.length === 0}
                    >
                      <img
                        src="/icons/chevron-right-black.svg"
                        alt="Next"
                        className={styles.navIcon}
                      />
                    </button>

                    <button
                      className={allotmentPage === Math.ceil(displayAllotment.length / rowsPerPage) ? styles.navBtnDisabled : styles.navBtn}
                      onClick={() => setAllotmentPage(Math.ceil(displayAllotment.length / rowsPerPage))}
                      disabled={allotmentPage === Math.ceil(displayAllotment.length / rowsPerPage) || displayAllotment.length === 0}
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
            )}
          </div>
        </div>
      )}
      <div className={styles.spacer}></div>
      <h2 className={styles.tableTitle}>
        Details of Shares/Debentures Transfers
      </h2>
      <div className={styles.emptyStateContainer}>
        <p className={styles.emptyStateText}>
        </p>
      </div>
    </div>
  );
};

export default ShareHoldingsTables2;
