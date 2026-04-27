"use client";

import React, { useRef, useEffect, useState } from "react";

import styles from "./LigilationDetails.module.css";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";
import { scrollToElementWithOffset } from "@/utils/scrollUtils";

import { litigationKpis, pendingCasesTable } from "./dummyData";
import { ChevronsDownUp } from "lucide-react";
import { formatDateToIST } from "@/utils/dateFormatter";

import { createPortal } from "react-dom";

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

// export default RowsPerPage;

const LigilationDetails = ({
  data,
  loading,
  error,
  paPage, paSize, setPaPage, setPaSize,
  pbPage, pbSize, setPbPage, setPbSize,
  daPage, daSize, setDaPage, setDaSize,
  dbPage, dbSize, setDbPage, setDbSize
}) => {
  const { activeSubSection } = useCompanySection();

  const litigationSections = [
    {
      id: "pending-against",
      label: "Pending Cases Filed against Company",
      apiKey: "pendingCasesFiledAgainstCompanyTable",
      page: paPage,
      size: paSize,
      setPage: setPaPage,
      setSize: setPaSize,
    },
    {
      id: "pending-by",
      label: "Pending Cases Filed by Company",
      apiKey: "pendingCasesFiledByCompanyTable",
      page: pbPage,
      size: pbSize,
      setPage: setPbPage,
      setSize: setPbSize,
    },
    {
      id: "disposed-against",
      label: "Disposed Cases Filed Against Company",
      apiKey: "disposedCasesFiledAgainstCompanyTable",
      page: daPage,
      size: daSize,
      setPage: setDaPage,
      setSize: setDaSize,
    },
    {
      id: "disposed-by",
      label: "Disposed Cases Filed by Company",
      apiKey: "disposedCasesFiledByCompanyTable",
      page: dbPage,
      size: dbSize,
      setPage: setDbPage,
      setSize: setDbSize,
    },
  ];
  const sectionRefs = React.useRef({});
  useEffect(() => {
    if (!activeSubSection) return;

    const refMap = {
      "Pending Cases Filed against Company": "pending-against",
      "Pending Cases Filed by Company": "pending-by",
      "Disposed Cases Filed Against Company": "disposed-against",
      "Disposed Cases Filed by Company": "disposed-by",
    };

    const targetId = refMap[activeSubSection];
    const targetEl = sectionRefs.current[targetId];

    if (targetEl) {
      scrollToElementWithOffset(targetEl, 140);
    }

  }, [activeSubSection]);

  if (loading && !data) {
    return (
      <div className={styles.mainWrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Litigation</h2>
            <div className={styles.sourceRow}>
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100px' }} />
              <div className={styles.divider}></div>
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '150px' }} />
            </div>
          </div>

          <div className={styles.kpiSection}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`${styles.skeleton} ${styles.skeletonKpiCard}`}></div>
            ))}
          </div>

          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.tableSection}>
              <div className={`${styles.skeleton} ${styles.skeletonTableTitle}`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonTable}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Remove early return for error to allow partial rendering

  const kpis = data?.summaryCardsSection?.cards || [];

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        {error && (
          <div style={{ color: "#EF4444", fontWeight: 500, marginBottom: "20px", padding: "12px", background: "#FEF2F2", borderRadius: "8px", border: "1px solid #FCA5A5" }}>
            {error}
          </div>
        )}
        <div className={styles.header}>
          <h2 className={styles.title}>{data?.summaryCardsSection?.sectionTitle || "Litigation"}</h2>
          <div className={styles.sourceRow}>
            <span className={styles.sourceLabel}>Source:</span>
            <span className={styles.sourceValue}>{data?.source || "-"}</span>
            <span className={styles.divider}></span>
            <span className={styles.updatedText}>
              <span> Last Updated:</span>
              {formatDateToIST(data?.lastUpdated || "-")}
            </span>
          </div>
        </div>

        {/* KPI SECTION */}
        <div className={styles.kpiSection}>
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              className={`${styles.kpiCard} ${styles[`variant${idx + 1}`] || styles.variant1}`}
            >
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <span className={styles.kpiValue}>{kpi.count}</span>
            </div>
          ))}
        </div>

        {litigationSections.map((section, index) => {
          const tableData = data?.[section.apiKey];
          const columns = tableData?.columns || [];
          const rows = tableData?.tableData?.rows || [];
          const pagination = tableData?.tableData?.pagination || {};

          return (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className={`${styles.tableSection} ${loading ? styles.loadingSection : ""}`}
            >
              <h6 className={styles.tableTitle}>{tableData?.tableTitle || section.label}</h6>

              <div className={styles.tableContainer}>
                {loading && (
                  <div className={styles.tableLoader}>
                    <div className={styles.spinner}></div>
                  </div>
                )}
                <table className={styles.litigationTable}>
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.length > 0 ? (
                      rows.map((row, idx) => (
                        <tr key={idx}>
                          {columns.map((col) => (
                            <td
                              key={col.key}
                              className={
                                col.key === "caseNumber" ? styles.caseNumber :
                                  col.key === "year" ? styles.yearCell :
                                    col.key === "court" ? styles.courtCell :
                                      styles.ellipsis
                              }
                            >
                              {row[col.key]}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length || 1} className={styles.noData}>
                          Data not found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className={styles.tableFooter}>
                <span className={styles.entriesInfo}>
                  Showing {((section.page - 1) * section.size) + 1}–{Math.min(section.page * section.size, pagination.total || 0)} of {pagination.total || 0}
                </span>

                <div className={styles.pagination}>
                  <div className={styles.rowsPerpage}>
                    <span>Rows per page</span>
                    <RowsPerPage
                      forceUp={index === litigationSections.length - 1}
                      value={section.size}
                      onChange={(val) => section.setSize(val)}
                    />
                  </div>
                  <div className={styles.controls}>
                    <span className={styles.pageInfo}>
                      Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
                    </span>

                    <div className={styles.pageControls}>
                      <button
                        disabled={pagination.currentPage <= 1 || loading}
                        onClick={() => section.setPage(1)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M7.33333 11.3346L4 8.0013L7.33333 4.66797M12 11.3346L8.66667 8.0013L12 4.66797" stroke="#041E42" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        disabled={pagination.currentPage <= 1 || loading}
                        onClick={() => section.setPage(section.page - 1)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M10 12L6 8L10 4" stroke="#041E42" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        disabled={pagination.currentPage >= pagination.totalPages || loading}
                        onClick={() => section.setPage(section.page + 1)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 12L10 8L6 4" stroke="#041E42" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        disabled={pagination.currentPage >= pagination.totalPages || loading}
                        onClick={() => section.setPage(pagination.totalPages)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 11.3346L7.33333 8.0013L4 4.66797M8.66667 11.3346L12 8.0013L8.66667 4.66797" stroke="#041E42" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LigilationDetails;
