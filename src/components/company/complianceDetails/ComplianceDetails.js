"use client";

import styles from "./ComplianceDetails.module.css";

import React, { useRef, useEffect, useState } from "react";

import { useCompanySection } from "@/components/company/context/CompanySectionContext";
import { scrollToElementWithOffset } from "@/utils/scrollUtils";
import { formatDateToIST } from "@/utils/dateFormatter";

import {
  complianceKpis,
  creditRatingDates,
  creditRatings,
  csrDetails2021_22,
  epfoYearlyTableData,
  pendingCasesTable,
} from "./dummyData";
import { ChevronsDownUp } from "lucide-react";

import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import { auditorsRemarksStandalone } from "./dummyData";
import { inactiveGstTable } from "./dummyData";
import { activeGstTable } from "./dummyData";
import { inactiveEstablishmentTable } from "./dummyData";
import { activeEstablishmentTable } from "./dummyData";
import EpfoSummaryChart from "./EpfoSummaryChart";
import CSRYearlyBarChart from "./CSRYearlyBarChart";
import CSRSectorDonutChart from "./CSRSectorDonutChart";

const defaultSectorWiseData = [
  // {
  //   name: "Poverty, Eradicating Hunger, Malnutrition",
  //   value: 108.81,
  //   color: "#0EA5E9",
  // },
  // { name: "Health Care", value: 99.62, color: "#041E42" },
  // { name: "Environmental Sustainability", value: 51.86, color: "#F59E0B" },
  // { name: "Education", value: 15.42, color: "#EAB308" },
  // { name: "Livelihood Enhancement Projects", value: 2.2, color: "#22C55E" },
];

const defaultYearWiseData = [
  // { year: "2015", value: 135 },
  // { year: "2016", value: 160 },
  // { year: "2017", value: 190 },
  // { year: "2018", value: 220 },
  // { year: "2019", value: 250 },
  // { year: "2020", value: 270 },
  // { year: "2021", value: 290 },
  // { year: "2022", value: 300 },
];

function CustomPagination({ page, size, total, onPageChange }) {
  const totalPages = Math.ceil(total / size) || 1;
  const isFirst = page === 1;
  const isLast = page >= totalPages;

  return (
    <div className={styles.controls}>
      <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
      <div className={styles.pageControls}>
        <button disabled={isFirst} onClick={() => onPageChange(1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.33333 11.3346L4 8.0013L7.33333 4.66797M12 11.3346L8.66667 8.0013L12 4.66797" stroke="#041E42" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button disabled={isFirst} onClick={() => onPageChange(page - 1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="#041E42" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button disabled={isLast} onClick={() => onPageChange(page + 1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="#041E42" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button disabled={isLast} onClick={() => onPageChange(totalPages)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 11.3346L7.33333 8.0013L4 4.66797M8.66667 11.3346L12 8.0013L8.66667 4.66797" stroke="#041E42" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function RowsPerPage({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggle = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 176;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight;

    setCoords({
      left: rect.left,
      width: rect.width,
      top: openUp ? rect.top - 135 : rect.bottom + 4,
    });

    setOpen(true);
  };

  // ✅ CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // close on scroll / resize
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      <div
        ref={triggerRef}
        className={styles.pageSizeControl}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <span className={styles.pageSizeValue}>{value}</span>
        <div className={styles.pageSizeArrows}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4.66406 10.0013L7.9974 13.3346L11.3307 10.0013
                 M4.66406 6.0013L7.9974 2.66797L11.3307 6.0013"
              stroke="#1E293B"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {open &&
        coords &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.portalDropdown}
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
          >
            {[10, 20, 50, 100].map((val) => (
              <button
                key={val}
                className={styles.rowsOption}
                onClick={() => {
                  onChange(val);
                  setOpen(false);
                }}
              >
                {val}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

// epfoData.ts
export const epfoSummaryGraphData = [
  // { period: "Jul-Sep 23", employees: 2000, amount: 28 },
  // { period: "Oct-Dec 23", employees: 5600, amount: 65 },
  // { period: "Jan-Mar 24", employees: 5450, amount: 63 },
  // { period: "Apr-Jun 24", employees: 5500, amount: 64 },
  // { period: "Jul-Sep 24", employees: 5520, amount: 64.5 },
  // { period: "Oct-Dec 24", employees: 5480, amount: 63.8 },

  // { period: "Oct-Dec 24", employees: 7000, amount: 63.8 },
];

// export default RowsPerPage;

const ComplianceDetails = () => {
  const { activeSubSection, scrollTrigger } = useCompanySection();

  // ✅ ADD THIS EXACT useEffect HERE
  useEffect(() => {
    if (!activeSubSection) return;

    const sectionMap = {
      "Auditors' Remarks": "Auditors' Remarks",
      CARO: "CARO",
      // "Goods & Service Tax (GST)": "gst",
      // EPFO: "epfo",
      // "CSR Credit Rating": "csr",
    };

    const targetId = sectionMap[activeSubSection];
    if (!targetId) return;

    const element = document.getElementById(targetId);
    if (element) {
      scrollToElementWithOffset(element, 140);
    }

  }, [scrollTrigger]);

  // ⬇️ keep your states AFTER this
  const [rowsOpen, setRowsOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const params = useParams();
  const companySlug = params?.name;
  const companyName = companySlug ? decodeURIComponent(companySlug.replaceAll("-", " ")).toUpperCase() : "";

  const [loading, setLoading] = useState(true);
  const [auditorRemarksData, setAuditorRemarksData] = useState(null);
  const [auditorsRemarksStandaloneAPI, setAuditorsRemarksStandaloneAPI] = useState(null);
  const [auditorsRemarksConsolidatedAPI, setAuditorsRemarksConsolidatedAPI] = useState(null);

  // Future API states for CARO
  const [caroStandaloneAPI, setCaroStandaloneAPI] = useState(null);
  const [caroConsolidatedAPI, setCaroConsolidatedAPI] = useState(null);

  // Phase 2 states (Commented out)
  /*
  const [activeGstParams, setActiveGstParams] = useState({ page: 1, size: 10 });
  const [inactiveGstParams, setInactiveGstParams] = useState({ page: 1, size: 10 });
  const [gstData, setGstData] = useState(null);
  const [loadingActiveGst, setLoadingActiveGst] = useState(false);
  const [loadingInactiveGst, setLoadingInactiveGst] = useState(false);
  */

  /*
  useEffect(() => {
    if (!companySlug) return;
    const fetchGstData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/compliance-details/gst?active_page=${activeGstParams.page}&active_size=${activeGstParams.size}&inactive_page=${inactiveGstParams.page}&inactive_size=${inactiveGstParams.size}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = await res.json();
        setGstData(data);
      } catch (err) {
        console.error("Failed to fetch GST data:", err);
      } finally {
        setLoadingActiveGst(false);
        setLoadingInactiveGst(false);
      }
    };
    fetchGstData();
  }, [companyName, activeGstParams.page, activeGstParams.size, inactiveGstParams.page, inactiveGstParams.size]);
  */

  useEffect(() => {
    if (!companyName) return;
    const fetchAuditorRemarks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/compliance-details/auditors-remark`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const data = await res.json();
        setAuditorRemarksData(data);

        if (data.auditors_remarks_standalone_table) {
          setAuditorsRemarksStandaloneAPI(data.auditors_remarks_standalone_table);
        }
        if (data.auditors_remarks_consolidated_table) {
          setAuditorsRemarksConsolidatedAPI(data.auditors_remarks_consolidated_table);
        }

        if (data.caro_standalone_table) {
          setCaroStandaloneAPI(data.caro_standalone_table);
        }
        if (data.caro_consolidated_table) {
          setCaroConsolidatedAPI(data.caro_consolidated_table);
        }
      } catch (err) {
        console.error("Failed to fetch auditor remarks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditorRemarks();
  }, [companyName]);


  // ── EPFO API State ──
  // Phase 2 states (Commented out)
  /*
  const [epfoData, setEpfoData] = useState(null);
  const [activeEpfoParams, setActiveEpfoParams] = useState({ page: 1, size: 10 });
  const [inactiveEpfoParams, setInactiveEpfoParams] = useState({ page: 1, size: 10 });
  const [loadingActiveEpfo, setLoadingActiveEpfo] = useState(false);
  const [loadingInactiveEpfo, setLoadingInactiveEpfo] = useState(false);
  */

  /*
  useEffect(() => {
    if (!companySlug) return;
    const fetchEpfoData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/compliance-details/epfo?active_page=${activeEpfoParams.page}&active_size=${activeEpfoParams.size}&inactive_page=${inactiveEpfoParams.page}&inactive_size=${inactiveEpfoParams.size}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = await res.json();
        setEpfoData(data);
      } catch (err) {
        console.error("Failed to fetch EPFO data:", err);
      } finally {
        setLoadingActiveEpfo(false);
        setLoadingInactiveEpfo(false);
      }
    };
    fetchEpfoData();
  }, [companyName, activeEpfoParams.page, activeEpfoParams.size, inactiveEpfoParams.page, inactiveEpfoParams.size]);
  */

  // ── CSR + Credit Rating API State ──
  // Phase 2 states (Commented out)
  /*
  const [csrCreditData, setCsrCreditData] = useState(null);
  const [csrTableParams, setCsrTableParams] = useState({ page: 1, size: 10 });
  const [creditRatingParams, setCreditRatingParams] = useState({ page: 1, size: 10 });
  const [loadingCsrTable, setLoadingCsrTable] = useState(false);
  const [loadingCreditRating, setLoadingCreditRating] = useState(false);
  const [ratingAgency, setRatingAgency] = useState("crisil");
  */

  /*
  useEffect(() => {
    if (!companySlug) return;
    const fetchCsrCreditData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/compliance-details/csr-credit-rating?financial_year_page=${csrTableParams.page}&financial_year_size=${csrTableParams.size}&credit_rating_page=${creditRatingParams.page}&credit_rating_size=${creditRatingParams.size}&rating_agency=${ratingAgency}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = await res.json();
        setCsrCreditData(data);
      } catch (err) {
        console.error("Failed to fetch CSR/Credit Rating data:", err);
      } finally {
        setLoadingCsrTable(false);
        setLoadingCreditRating(false);
      }
    };
    fetchCsrCreditData();
  }, [companyName, csrTableParams.page, csrTableParams.size, creditRatingParams.page, creditRatingParams.size, ratingAgency]);
  */

  const [agency, setAgency] = useState("CRISIL");
  const [selectedDate, setSelectedDate] = useState("2023-11-24");

  /*
  const gstTablesConfig = [
    {
      id: "active-gst",
      isInactive: false,
      title: gstData?.active_gst_table?.table_title || "Active Gst",
      data: gstData?.active_gst_table,
      params: activeGstParams,
      loading: loadingActiveGst,
      onSizeChange: (val) => { setLoadingActiveGst(true); setActiveGstParams(p => ({ ...p, size: val, page: 1 })); },
      onPageChange: (val) => { setLoadingActiveGst(true); setActiveGstParams(p => ({ ...p, page: val })); },
      fallbackRows: activeGstTable
    },
    {
      id: "inactive-gst",
      isInactive: true,
      title: gstData?.inactive_gst_table?.table_title || "Inactive Gst",
      data: gstData?.inactive_gst_table,
      params: inactiveGstParams,
      loading: loadingInactiveGst,
      onSizeChange: (val) => { setLoadingInactiveGst(true); setInactiveGstParams(p => ({ ...p, size: val, page: 1 })); },
      onPageChange: (val) => { setLoadingInactiveGst(true); setInactiveGstParams(p => ({ ...p, page: val })); },
      fallbackRows: inactiveGstTable
    }
  ];
  */

  const sectionRefs = React.useRef({});

  if (loading) {
    return (
      <div className={styles.mainWrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Compliance Details</h2>
            <div className={styles.sourceRow}>
              {/* <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100px' }} />
              <div className={styles.divider}></div> */}
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '150px' }} />
            </div>
          </div>

          {[1, 2, 3, 4].map(i => (
            <div key={i} className={styles.tableSection}>
              <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
              <div className={`${styles.skeleton} ${styles.skeletonTable}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isAllEmpty =
    (!auditorsRemarksStandaloneAPI || !auditorsRemarksStandaloneAPI.rows?.length) &&
    (!auditorsRemarksConsolidatedAPI || !auditorsRemarksConsolidatedAPI.rows?.length) &&
    (!caroStandaloneAPI || !caroStandaloneAPI.rows?.length) &&
    (!caroConsolidatedAPI || !caroConsolidatedAPI.rows?.length);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Compliance Details</h2>
          <div className={styles.sourceRow}>
            {/* <span className={styles.sourceLabel}>Source:</span>
            <span className={styles.sourceValue}>{auditorRemarksData?.source || "MCA"}</span>
            <span className={styles.divider}></span> */}
            <span className={styles.updatedText}>
              <span> Last Updated:</span>
              {formatDateToIST(auditorRemarksData?.last_updated || "-")}
            </span>


          </div>
        </div>
        {isAllEmpty ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#71717a", fontWeight: "500" }}>
            Data not available.
          </div>
        ) : (
          <>
        {/* Auditors' Remarks Standalone table */}
        <div id="Auditors' Remarks" className={styles.tableSection}>
          {" "}
          <h6
            className={styles.tableTitle}
          >{auditorsRemarksStandaloneAPI?.table_title || `Auditors' Remarks Standalone`}</h6>
          <div className={styles.tableContainer}>
            <table className={styles.litigationTable}>
              <thead>
                <tr>
                  <th className={styles.firstCol}>Financial Year</th>
                  {auditorsRemarksStandaloneAPI?.financial_year_columns?.map((col, i) => (
                    <th key={i}>{col.label}</th>
                  ))}
                  {!auditorsRemarksStandaloneAPI && auditorsRemarksStandalone.years.map((year) => (
                    <th key={year}>{year}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {auditorsRemarksStandaloneAPI ? (
                  auditorsRemarksStandaloneAPI.rows?.length > 0 ? (
                    auditorsRemarksStandaloneAPI.rows.map((row, idx) => (
                      <tr key={idx}>
                        <td className={styles.firstCol}>{row.row_label}</td>
                        {auditorsRemarksStandaloneAPI.financial_year_columns?.map((col, i) => {
                          const cell = row.financial_year_cells?.[col.key];
                          return (
                            <td key={i}>{cell?.value || "-"}</td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={auditorsRemarksStandaloneAPI.financial_year_columns?.length + 1 || 1} style={{ textAlign: "center", padding: "20px" }}>
                        Data not available.
                      </td>
                    </tr>
                  )
                ) : (
                  auditorsRemarksStandalone.rows.map((row, idx) => (
                    <tr key={idx}>
                      <td className={styles.firstCol}>{row.label}</td>
                      {row.values.map((val, i) => (
                        <td key={i}>{val}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Auditors' Remarks Consolidated table */}
        <div className={styles.tableSection}>
          {" "}
          <h6
            className={styles.tableTitle}
          >{auditorsRemarksConsolidatedAPI?.table_title || `Auditors' Remarks Consolidated`}</h6>
          <div className={styles.tableContainer}>
            <table className={styles.litigationTable}>
              <thead>
                <tr>
                  <th className={styles.firstCol}>Financial Year</th>
                  {auditorsRemarksConsolidatedAPI?.financial_year_columns?.map((col, i) => (
                    <th key={i}>{col.label}</th>
                  ))}
                  {!auditorsRemarksConsolidatedAPI && auditorsRemarksStandalone.years.map((year) => (
                    <th key={year}>{year}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {auditorsRemarksConsolidatedAPI ? (
                  auditorsRemarksConsolidatedAPI.rows?.length > 0 ? (
                    auditorsRemarksConsolidatedAPI.rows.map((row, idx) => (
                      <tr key={idx}>
                        <td className={styles.firstCol}>{row.row_label}</td>
                        {auditorsRemarksConsolidatedAPI.financial_year_columns?.map((col, i) => {
                          const cell = row.financial_year_cells?.[col.key];
                          return (
                            <td key={i}>{cell?.value || "-"}</td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={auditorsRemarksConsolidatedAPI.financial_year_columns?.length + 1 || 1} style={{ textAlign: "center", padding: "20px" }}>
                        Data not available.
                      </td>
                    </tr>
                  )
                ) : (
                  auditorsRemarksStandalone.rows.map((row, idx) => (
                    <tr key={idx}>
                      <td className={styles.firstCol}>{row.label}</td>
                      {row.values.map((val, i) => (
                        <td key={i}>{val}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARO Standalone table*/}
        <div id="CARO" className={styles.tableSection}>
          <h6 className={styles.tableTitle}>{caroStandaloneAPI?.table_title || `CARO Standalone`}</h6>
          <div className={styles.tableContainer}>
            <table className={styles.litigationTable}>
              <thead>
                <tr>
                  <th className={styles.firstCol}>Financial Year</th>
                  {caroStandaloneAPI ? (
                    caroStandaloneAPI.financial_year_columns?.map((col, i) => (
                      <th key={i}>{col.label}</th>
                    ))
                  ) : (
                    auditorsRemarksStandalone.years.map((year) => (
                      <th key={year}>{year}</th>
                    ))
                  )}
                </tr>
              </thead>

              <tbody>
                {caroStandaloneAPI ? (
                  caroStandaloneAPI.rows?.length > 0 ? (
                    caroStandaloneAPI.rows.map((row, idx) => (
                      <tr key={idx}>
                        <td className={styles.firstCol}>{row.row_label}</td>
                        {caroStandaloneAPI.financial_year_columns?.map((col, i) => {
                          const cell = row.financial_year_cells?.[col.key];
                          return (
                            <td key={i}>{cell?.value || "-"}</td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={caroStandaloneAPI.financial_year_columns?.length + 1 || 1} style={{ textAlign: "center", padding: "20px" }}>
                        Data not available.
                      </td>
                    </tr>
                  )
                ) : (
                  auditorsRemarksStandalone.rows.map((row, idx) => (
                    <tr key={idx}>
                      <td className={styles.firstCol}>{row.label}</td>
                      {row.values.map((val, i) => (
                        <td key={i}>{val}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARO Consolidated table*/}
        <div className={styles.tableSection}>
          <h6 className={styles.tableTitle}>{caroConsolidatedAPI?.table_title || `CARO Consolidated`}</h6>
          <div className={styles.tableContainer}>
            <table className={styles.litigationTable}>
              <thead>
                <tr>
                  <th className={styles.firstCol}>Financial Year</th>
                  {caroConsolidatedAPI ? (
                    caroConsolidatedAPI.financial_year_columns?.map((col, i) => (
                      <th key={i}>{col.label}</th>
                    ))
                  ) : (
                    auditorsRemarksStandalone.years.map((year) => (
                      <th key={year}>{year}</th>
                    ))
                  )}
                </tr>
              </thead>

              <tbody>
                {caroConsolidatedAPI ? (
                  caroConsolidatedAPI.rows?.length > 0 ? (
                    caroConsolidatedAPI.rows.map((row, idx) => (
                      <tr key={idx}>
                        <td className={styles.firstCol}>{row.row_label}</td>
                        {caroConsolidatedAPI.financial_year_columns?.map((col, i) => {
                          const cell = row.financial_year_cells?.[col.key];
                          return (
                            <td key={i}>{cell?.value || "-"}</td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={caroConsolidatedAPI.financial_year_columns?.length + 1 || 1} style={{ textAlign: "center", padding: "20px" }}>
                        Data not available.
                      </td>
                    </tr>
                  )
                ) : (
                  auditorsRemarksStandalone.rows.map((row, idx) => (
                    <tr key={idx}>
                      <td className={styles.firstCol}>{row.label}</td>
                      {row.values.map((val, i) => (
                        <td key={i}>{val}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )}
        {/* KPI SECTION */}.
        {/* phase 2  */}
        {/* <div id="gst" className={styles.kpiSectionContainer}>
          <h6 className={styles.tableTitle}>{gstData?.gstin_details_cards_section?.section_title || `Gstin Details`}</h6>
          <div className={styles.kpiSection}>
            {gstData?.gstin_details_cards_section ? (
              gstData.gstin_details_cards_section.cards.map((kpi, idx) => {
                 const variant = idx === 0 ? "blue" : idx === 1 ? "red" : "purple";
                 return (
                  <div key={idx} className={`${styles.kpiCard} ${styles[variant]}`}>
                    <span className={styles.kpiLabel}>{kpi.label}</span>
                    <span className={styles.kpiValue}>{kpi.count}</span>
                  </div>
                 )
              })
            ) : (
              complianceKpis.map((kpi, idx) => (
                <div key={idx} className={`${styles.kpiCard} ${styles[kpi.variant]}`}>
                  <span className={styles.kpiLabel}>{kpi.label}</span>
                  <span className={styles.kpiValue}>{kpi.value}</span>
                </div>
              ))
            )}
          </div>
        </div> */}

        {/* phase 2 */}
        {/* 
          ==============================================================================
          PHASE 2 SECTIONS (GST, EPFO, CSR, CREDIT RATING)
          The following sections are moved to Phase 2. Uncomment and map to APIs 
          once the backend endpoints are ready.
          ==============================================================================
        */}

        {/* 
        {gstTablesConfig.map((section, index) => {
          const rowsToRender = section.data?.rows || section.fallbackRows;
          const totalRows = section.data?.total || section.fallbackRows.length;
          const showingStart = totalRows > 0 ? (section.params.page - 1) * section.params.size + 1 : 0;
          const showingEnd = Math.min(section.params.page * section.params.size, totalRows);

          return (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className={styles.tableSection}
              style={{ position: 'relative' }}
            >
              <h6 className={styles.tableTitle}>{section.title}</h6>
              <div className={styles.tableContainer}>
                {section.loading && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                    Loading...
                  </div>
                )}
                <table className={styles.litigationTable}>
                  <thead>
                    <tr>
                      <th>GSTIN</th>
                      <th>State</th>
                      <th>Last Filing</th>
                      <th>Due Date</th>
                      <th>Delay in 12 Months</th>
                      <th className={styles.statusCol}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsToRender.map((row, idx) => (
                      <tr key={idx}>
                        <td className={styles.caseNumber}>{row.gstin}</td>
                        <td>{row.state}</td>
                        <td>{row.last_filing || row.lastFiling}</td>
                        <td>{row.due_date || row.dueDate}</td>
                        <td>{row.delay_in_12_months || row.delay}</td>
                        <td className={styles.statusCol}>
                          <span
                            className={`${styles.statusPill} ${row.status === "Active"
                                ? styles.statusActive
                                : styles.inactiveNormalText
                              }`}
                          >
                            <span className={styles.statusText}>
                              {row.status}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.tableFooter}>
                <span className={styles.entriesInfo}>
                  Showing {showingStart}-{showingEnd} of {totalRows}
                </span>

                <div className={styles.pagination}>
                  <div className={styles.rowsPerpage}>
                    <span>Rows per page</span>
                    <RowsPerPage
                      value={section.params.size}
                      onChange={section.onSizeChange}
                    />
                  </div>
                  <CustomPagination
                    page={section.params.page}
                    size={section.params.size}
                    total={totalRows}
                    onPageChange={section.onPageChange}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div id="epfo" className={styles.epfoGrapgAndTitleContainer}>
          <h6 className={styles.tableTitle}>
            {epfoData?.epfo_summary_chart_section?.section_title || `EPFO Summary`}
          </h6>

          <div className={styles.epfoGraphContainer}>
            <EpfoSummaryChart
              epfoSummaryData={
                epfoData?.epfo_summary_chart_section?.data_points
                  ? epfoData.epfo_summary_chart_section.data_points.map((pt) => ({
                    period: pt.financial_year,
                    employees: pt.employees,
                    amount: pt.amount,
                  }))
                  : epfoSummaryGraphData
              }
            />
          </div>
        </div>

        <div className={styles.tableSection}>
          <h6 className={styles.tableTitle}>
            {epfoData?.epfo_summary_table?.table_title || `EPFO Year-wise Summary`}
          </h6>

          <div className={styles.tableContainer}>
            <table className={styles.litigationTable}>
              <thead>
                <tr>
                  <th className={styles.financialYearHead}>Financial Year</th>
                  <th>Number of Employees</th>
                  <th>PF Contribution</th>
                  <th>Entity with Delay</th>
                </tr>
              </thead>

              <tbody>
                {(epfoData?.epfo_summary_table?.rows || epfoYearlyTableData).map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.financial_year || row.year}</td>
                    <td>{row.number_of_employees || row.employees}</td>
                    <td>{row.pf_contribution || row.contribution}</td>
                    <td
                      style={{
                        color: (row.entity_with_delay || row.delay) > 0 ? "#EF4444" : "inherit",
                        fontWeight: (row.entity_with_delay || row.delay) > 0 ? 500 : 400,
                      }}
                    >
                      {row.entity_with_delay ?? row.delay}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {[
          {
            id: "active-stablishment",
            label: "Active Establishment",
            data: epfoData?.active_establishment_table,
            params: activeEpfoParams,
            loading: loadingActiveEpfo,
            onSizeChange: (val) => { setLoadingActiveEpfo(true); setActiveEpfoParams(p => ({ ...p, size: val, page: 1 })); },
            onPageChange: (val) => { setLoadingActiveEpfo(true); setActiveEpfoParams(p => ({ ...p, page: val })); },
            fallbackRows: activeEstablishmentTable,
          },
          {
            id: "inactive-establishment",
            label: "Inactive Establishment",
            data: epfoData?.inactive_establishment_table,
            params: inactiveEpfoParams,
            loading: loadingInactiveEpfo,
            onSizeChange: (val) => { setLoadingInactiveEpfo(true); setInactiveEpfoParams(p => ({ ...p, size: val, page: 1 })); },
            onPageChange: (val) => { setLoadingInactiveEpfo(true); setInactiveEpfoParams(p => ({ ...p, page: val })); },
            fallbackRows: inactiveEstablishmentTable,
          },
        ].map((section, index) => {
          const rowsToRender = section.data?.rows || section.fallbackRows;
          const totalRows = section.data?.total || section.fallbackRows.length;
          const showingStart = totalRows > 0 ? (section.params.page - 1) * section.params.size + 1 : 0;
          const showingEnd = Math.min(section.params.page * section.params.size, totalRows);

          return (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className={styles.tableSection}
              style={{ position: "relative" }}
            >
              <h6 className={styles.tableTitle}>
                {section.data?.table_title || section.label}
              </h6>

              <div className={styles.tableContainer}>
                {section.loading && (
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
                    Loading...
                  </div>
                )}
                <table className={styles.litigationTable}>
                  <thead>
                    <tr>
                      <th>Establishment Code</th>
                      <th>State</th>
                      <th>Last Filing</th>
                      <th>Due Date</th>
                      <th>Delay in 12 Months</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rowsToRender.map((row, idx) => (
                      <tr key={idx}>
                        <td className={styles.caseNumber}>{row.establishment_code || row.gstin}</td>
                        <td>{row.state}</td>
                        <td>{row.last_filing || row.lastFiling}</td>
                        <td>{row.due_date || row.dueDate}</td>
                        <td>{row.delay_in_12_months || row.delay}</td>
                        <td>
                          <span
                            className={`${styles.statusPill} ${row.status === "Active"
                                ? styles.statusActive
                                : styles.statusInactive
                              }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.tableFooter}>
                <span className={styles.entriesInfo}>
                  Showing {showingStart}–{showingEnd} of {totalRows}
                </span>

                <div className={styles.pagination}>
                  <div className={styles.rowsPerpage}>
                    <span>Rows per page</span>
                    <RowsPerPage
                      value={section.params.size}
                      onChange={section.onSizeChange}
                    />
                  </div>
                  <CustomPagination
                    page={section.params.page}
                    size={section.params.size}
                    total={totalRows}
                    onPageChange={section.onPageChange}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div id="csr" className={styles.epfoGrapgAndTitleContainer}>
          <h6 className={styles.tableTitle}>
            {csrCreditData?.csr_financial_year_spend_chart_section?.section_title || `CSR Details`}
          </h6>

          <div className={styles.csrChartsGrid}>
            <CSRYearlyBarChart
              data={
                csrCreditData?.csr_financial_year_spend_chart_section?.data_points
                  ? csrCreditData.csr_financial_year_spend_chart_section.data_points.map((pt) => ({
                    year: pt.financial_year,
                    value: parseFloat(pt.amount_spent) || 0,
                  }))
                  : defaultYearWiseData
              }
              styles={styles}
              title={
                csrCreditData?.csr_financial_year_spend_chart_section?.chart_title ||
                "CSR amounts spent by organization for specific financial years."
              }
            />

            <CSRSectorDonutChart
              data={
                csrCreditData?.csr_sector_spend_chart_section?.data_points
                  ? csrCreditData.csr_sector_spend_chart_section.data_points.map((pt, i) => {
                    const colors = ["#0EA5E9", "#041E42", "#F59E0B", "#EAB308", "#22C55E", "#8B5CF6", "#EC4899", "#14B8A6"];
                    return {
                      name: pt.sector,
                      value: parseFloat(pt.amount_spent) || 0,
                      color: colors[i % colors.length],
                    };
                  })
                  : defaultSectorWiseData
              }
              styles={styles}
              title={
                csrCreditData?.csr_sector_spend_chart_section?.chart_title ||
                "CSR amounts spent by organization for specific sectors."
              }
            />
          </div>
        </div>

        {(() => {
          const csrTable = csrCreditData?.financial_year_2021_22_table;
          const csrRows = csrTable?.rows || csrDetails2021_22;
          const csrTotal = csrTable?.total || csrDetails2021_22.length;
          const csrStart = csrTotal > 0 ? (csrTableParams.page - 1) * csrTableParams.size + 1 : 0;
          const csrEnd = Math.min(csrTableParams.page * csrTableParams.size, csrTotal);

          return (
            <div className={styles.tableSection} style={{ position: "relative" }}>
              <h6 className={styles.tableTitle}>
                {csrTable?.table_title || `Financial year 2021-22`}
              </h6>

              <div className={styles.tableContainer}>
                {loadingCsrTable && (
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
                    Loading...
                  </div>
                )}
                <table className={styles.litigationTable}>
                  <thead>
                    <tr>
                      <th>State</th>
                      <th>Sector</th>
                      <th>CSR Project</th>
                      <th>Amount Spent</th>
                      <th>Outlay</th>
                    </tr>
                  </thead>

                  <tbody>
                    {csrRows.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.state}</td>
                        <td className={styles.ellipsis}>{row.sector}</td>
                        <td className={styles.ellipsis}>{row.csr_project || row.project}</td>
                        <td>{row.amount_spent || row.amountSpent}</td>
                        <td>{row.outlay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.tableFooter}>
                <span className={styles.entriesInfo}>
                  Showing {csrStart}–{csrEnd} of {csrTotal}
                </span>

                <div className={styles.pagination}>
                  <div className={styles.rowsPerpage}>
                    <span>Rows per page</span>
                    <RowsPerPage
                      value={csrTableParams.size}
                      onChange={(val) => { setLoadingCsrTable(true); setCsrTableParams(p => ({ ...p, size: val, page: 1 })); }}
                    />
                  </div>
                  <CustomPagination
                    page={csrTableParams.page}
                    size={csrTableParams.size}
                    total={csrTotal}
                    onPageChange={(val) => { setLoadingCsrTable(true); setCsrTableParams(p => ({ ...p, page: val })); }}
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {(() => {
          const creditSection = csrCreditData?.credit_rating_section;
          const agencyFilters = creditSection?.agency_filters || [];
          const apiRatingDates = creditSection?.rating_dates || [];
          const creditTable = creditSection?.credit_rating_table;
          const creditRows = creditTable?.rows || [];
          const creditTotal = creditTable?.total || 0;
          const creditStart = creditTotal > 0 ? (creditRatingParams.page - 1) * creditRatingParams.size + 1 : 0;
          const creditEnd = Math.min(creditRatingParams.page * creditRatingParams.size, creditTotal);

          const hasApiData = agencyFilters.length > 0;

          return (
            <div className={styles.tableSection} style={{ position: "relative" }}>
              <div className={styles.creditHeader}>
                <h6 className={styles.tableTitle}>
                  {creditSection?.section_title || "Credit Rating"}
                </h6>

                <div className={styles.togglletabs}>
                  {hasApiData ? (
                    agencyFilters.map((filter) => (
                      <button
                        key={filter.agency_key}
                        className={`${styles.toggleTab} ${ratingAgency === filter.agency_key ? styles.activeTab : ""
                          }`}
                        onClick={() => {
                          setRatingAgency(filter.agency_key);
                          setCreditRatingParams(p => ({ ...p, page: 1 }));
                        }}
                      >
                        {filter.agency_label}
                      </button>
                    ))
                  ) : (
                    <>
                      <button
                        className={`${styles.toggleTab} ${agency === "CRISIL" ? styles.activeTab : ""
                          }`}
                        onClick={() => setAgency("CRISIL")}
                      >
                        CRISIL
                      </button>
                      <button
                        className={`${styles.toggleTab} ${agency === "ICRA" ? styles.activeTab : ""
                          }`}
                        onClick={() => setAgency("ICRA")}
                      >
                        ICRA
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.dateTabs}>
                {(hasApiData ? apiRatingDates : creditRatingDates).map((date) => (
                  <button
                    key={date}
                    className={`${styles.dateTab} ${selectedDate === date ? styles.activeDateTab : ""
                      }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>

              <div className={styles.tableContainer}>
                {loadingCreditRating && (
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}>
                    Loading...
                  </div>
                )}
                <table className={styles.litigationTable}>
                  <thead>
                    <tr>
                      <th>Category/ Sub-Category/ Tenor</th>
                      <th>Amount (Rs.crore)</th>
                      <th>Rating (Outlook)</th>
                      <th>Rating Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {hasApiData
                      ? creditRows.map((row, idx) => (
                        <tr key={idx}>
                          <td className={styles.ellipsis}>{row.category_sub_category_tenor}</td>
                          <td>{row.amount_rs_crore}</td>
                          <td>{row.rating_outlook}</td>
                          <td>{row.rating_action}</td>
                        </tr>
                      ))
                      : creditRatings?.[agency]?.[selectedDate]?.map((row, idx) => (
                        <tr key={idx}>
                          <td className={styles.ellipsis}>{row.category}</td>
                          <td>{row.amount}</td>
                          <td>{row.rating}</td>
                          <td>{row.action}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>

              {hasApiData && (
                <div className={styles.tableFooter}>
                  <span className={styles.entriesInfo}>
                    Showing {creditStart}–{creditEnd} of {creditTotal}
                  </span>

                  <div className={styles.pagination}>
                    <div className={styles.rowsPerpage}>
                      <span>Rows per page</span>
                      <RowsPerPage
                        value={creditRatingParams.size}
                        onChange={(val) => { setLoadingCreditRating(true); setCreditRatingParams(p => ({ ...p, size: val, page: 1 })); }}
                      />
                    </div>
                    <CustomPagination
                      page={creditRatingParams.page}
                      size={creditRatingParams.size}
                      total={creditTotal}
                      onPageChange={(val) => { setLoadingCreditRating(true); setCreditRatingParams(p => ({ ...p, page: val })); }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })()}
        */}
      </div>
    </div>
  );
};

export default ComplianceDetails;
