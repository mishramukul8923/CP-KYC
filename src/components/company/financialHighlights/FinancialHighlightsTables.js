"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./FinancialHighlightsTables.module.css";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";
import { useParams } from "next/navigation";
import { scrollToElementWithOffset } from "@/utils/scrollUtils";


const FinancialHighlightsTables = ({ 
  pnlApiData,
  pnlLoading,
  pnlError,
  pnlViewType,
  setPnlViewType,
  auditorsData, 
  auditorsLoading, 
  auditorsError, 
  audType, 
  setAudType,
  balanceSheetData,
  balanceSheetLoading,
  balanceSheetError,
  bsType,
  setBsType,
  cashFlowData,
  cashFlowLoading,
  cashFlowError,
  cfType,
  setCfType,
  ratiosData,
  ratiosLoading,
  ratiosError,
  ratiosType,
  setRatiosType
}) => {
  const params = useParams();
  const companyName = params?.name ? decodeURIComponent(params.name.replace(/-/g, " ")).toUpperCase() : "";

  // Helper: get value for a period from a row's values object
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const getValue = (valuesObj, period) => {
    if (!valuesObj) return "-";
    const v = valuesObj[period];
    return v === undefined || v === null || v === "-" ? "-" : v;
  };

  const pnlPeriods = pnlApiData?.periods
    ? pnlApiData.periods.filter((p) => p !== "setAttributes" && p !== "isExpandable")
    : [];

  const bsPeriods = balanceSheetData?.periods
    ? balanceSheetData.periods.filter((p) => p !== "setAttributes" && p !== "isExpandable")
    : [];

  // Build Cash Flow period columns
  const cfPeriods = cashFlowData?.periods
    ? cashFlowData.periods.filter((p) => p !== "setAttributes")
    : [];

  // Build Ratios period columns
  const ratiosPeriods = ratiosData?.periods || [];

  const buildRatioRows = () => {
    if (!ratiosData) return [];
    const sections = [
      { label: "Profitability Ratios", data: ratiosData.profitability },
      { label: "Efficiency Ratios", data: ratiosData.efficiency },
      { label: "Leverage/Solvency Ratios", data: ratiosData.leverage_solvency },
      { label: "Liquidity Ratios", data: ratiosData.liquidity },
      { label: "Valuation Ratios", data: ratiosData.valuation },
      { label: "Growth Metrics", data: ratiosData.growth_metrics },
    ];
    const rows = [];
    sections.forEach(({ label, data }) => {
      if (!data || !Array.isArray(data)) return;
      rows.push({ type: "header", label });
      data.forEach((item) => {
        rows.push({
          type: "data",
          label: item.particular_name,
          valuesObj: item.values,
        });
      });
    });
    return rows;
  };

  const ratioRows = buildRatioRows();



  const cfRows = [
    { label: "Cash from Operating Activity", path: "summary.cash_from_operating_activity" },
    { label: "Cash from Investing Activity", path: "summary.cash_from_investing_activity" },
    { label: "Cash from Financing Activity", path: "summary.cash_from_financing_activity" },
    { type: "total", label: "Net Cash Flow", path: "summary.net_cash_flow" },
    { label: "Free Cash Flow", path: "summary.free_cash_flow" },
  ].map(row => {
    if (row.type === "header") return row;
    const dataObj = row.path ? getNestedValue(cashFlowData, row.path) : null;
    return {
      ...row,
      valuesObj: dataObj?.values || null
    };
  });

  const buildBsRows = () => {
    if (!balanceSheetData) return [];
    const sections = [
      { label: "Shareholder's Fund", data: balanceSheetData.shareholders_fund },
      { label: "Non Current Liabilities", data: balanceSheetData.non_current_liabilities },
      { label: "Current Liabilities", data: balanceSheetData.current_liabilities },
      { label: "Non Current Assets", data: balanceSheetData.non_current_assets },
      { label: "Current Assets", data: balanceSheetData.current_assets },
    ];
    const rows = [];
    sections.forEach(({ label, data }) => {
      if (!data) return;
      rows.push({ type: "header", label });
      Object.entries(data).forEach(([key, rowData]) => {
        const displayLabel = key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        const isTotal = key.startsWith("total_");
        rows.push({
          type: isTotal ? "grand-total" : "data",
          label: displayLabel,
          valuesObj: rowData?.values,
        });
      });
    });
    return rows;
  };

  const bsRows = buildBsRows();

  // Flatten API sections into rows for the P&L table
  const buildPnlRows = () => {
    if (!pnlApiData) return [];
    const sections = [
      { label: "Revenue", data: pnlApiData.revenue },
      { label: "Expenses", data: pnlApiData.expenses },
      { label: "Exceptional & Extra Ordinary Items", data: pnlApiData.exceptional },
      { label: "Tax Expense", data: pnlApiData.tax_expense },
    ];
    const rows = [];
    sections.forEach(({ label, data }) => {
      if (!data) return;
      rows.push({ type: "header", label });
      Object.entries(data).forEach(([key, rowData]) => {
        const isTotal = [
          "Total Revenue", "Total Expense", "Ebitda", "Profit Before Tax", "Profit/Loss"
        ].includes(key);
        rows.push({
          type: isTotal ? "grand-total" : "data",
          label: key,
          valuesObj: rowData?.values,
        });
      });
    });
    return rows;
  };

  const pnlRows = buildPnlRows();

  const hasPnlData = pnlApiData && pnlPeriods.length > 0;
  const displayPnlPeriods = hasPnlData ? pnlPeriods : ["Mar 2024", "Mar 2023", "Mar 2022"];
  const displayPnlRows = hasPnlData ? pnlRows : [
    { type: "header", label: "Revenue" },
    { type: "data", label: "Revenue from Operations", valuesObj: { "Mar 2024": "1200.00", "Mar 2023": "1100.00", "Mar 2022": "1000.00" } },
    { type: "grand-total", label: "Total Revenue", valuesObj: { "Mar 2024": "1250.00", "Mar 2023": "1150.00", "Mar 2022": "1050.00" } }
  ];

  const hasBsData = balanceSheetData && bsPeriods.length > 0;
  const displayBsPeriods = hasBsData ? bsPeriods : ["Mar 2024", "Mar 2023", "Mar 2022"];
  const displayBsRows = hasBsData ? bsRows : [
    { type: "header", label: "Equity and Liabilities" },
    { type: "data", label: "Share Capital", valuesObj: { "Mar 2024": "100.00", "Mar 2023": "100.00", "Mar 2022": "100.00" } },
    { type: "data", label: "Reserves and Surplus", valuesObj: { "Mar 2024": "500.00", "Mar 2023": "450.00", "Mar 2022": "400.00" } },
    { type: "grand-total", label: "Total Liabilities", valuesObj: { "Mar 2024": "1000.00", "Mar 2023": "900.00", "Mar 2022": "800.00" } }
  ];

  const hasCfData = cashFlowData && cfPeriods.length > 0;
  const displayCfPeriods = hasCfData ? cfPeriods : ["Mar 2024", "Mar 2023", "Mar 2022"];
  const displayCfRows = hasCfData ? cfRows : [
    { label: "Cash from Operating Activity", path: "summary.cash_from_operating_activity" },
    { label: "Cash from Investing Activity", path: "summary.cash_from_investing_activity" },
    { label: "Cash from Financing Activity", path: "summary.cash_from_financing_activity" },
    { type: "total", label: "Net Cash Flow", path: "summary.net_cash_flow" }
  ];

  const hasRatiosData = ratiosData && ratiosPeriods.length > 0;
  const displayRatiosPeriods = hasRatiosData ? ratiosPeriods : ["Mar 2024", "Mar 2023", "Mar 2022"];
  const displayRatiosRows = hasRatiosData ? ratioRows : [
    { type: "header", label: "Profitability Ratios" },
    { type: "data", label: "Operating Margin (%)", valuesObj: { "Mar 2024": "15.50", "Mar 2023": "14.20", "Mar 2022": "13.80" } },
    { type: "data", label: "Net Profit Margin (%)", valuesObj: { "Mar 2024": "10.20", "Mar 2023": "9.80", "Mar 2022": "9.50" } }
  ];

  const { activeSubSection, setActiveSection } = useCompanySection();

  const balanceSheetRef = useRef(null);
  const profitLossRef = useRef(null);
  const cashFlowRef = useRef(null);
  const ratioRef = useRef(null);
  const auditorsRef = useRef(null);

  // =========================================


  useEffect(() => {
    if (!activeSubSection) return;

    const scroll = (ref) => {
      if (ref?.current) {
        scrollToElementWithOffset(ref.current, 140);
      }
    };


    switch (activeSubSection) {
      case "Balance Sheet":
        scroll(balanceSheetRef);
        break;

      case "Profit & Loss":
        scroll(profitLossRef);
        break;

      case "Cash Flow":
        scroll(cashFlowRef);
        break;

      case "Ratios":
        scroll(ratioRef);
        break;

      case "Auditors Details":
        scroll(auditorsRef);
        break;

      default:
        break;
    }
  }, [activeSubSection]);


  const [viewType, setViewType] = React.useState("Standalone");

  const renderSkeletonTable = (columns = 5) => (
    <div className={styles.container} style={{ marginTop: '20px' }}>
      <div className={styles.headerContainer}>
        <div className={`${styles.skeleton} ${styles.skeletonHeader}`} />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.particularsCell}><div className={styles.skeleton} style={{ height: '20px' }} /></th>
              {[...Array(columns - 1)].map((_, i) => (
                <th key={i}><div className={styles.skeleton} style={{ height: '20px' }} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i}>
                <td className={styles.labelCell}><div className={styles.skeleton} style={{ height: '20px' }} /></td>
                {[...Array(columns - 1)].map((_, j) => (
                  <td key={j} className={styles.valueCell}><div className={styles.skeleton} style={{ height: '20px' }} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div
        ref={balanceSheetRef}
        style={{ marginTop: "20px" }}
        className={styles.headerContainer}
      >
        <div className={styles.headerTitle}>Balance Sheet</div>
        <div className={styles.headerControls}>
          <span className={styles.currencyText}>{balanceSheetData?.currency || "Values in Cr."}</span>
          <div className={styles.toggleContainer}>
            <div
              className={`${styles.toggleSlider} ${bsType === "Standalone" ? styles.sliderStandalone : styles.sliderConsolidated
                }`}
            ></div>
            <button
              className={`${styles.toggleBtn} ${bsType === "Standalone" ? styles.activeToggle : ""}`}
              onClick={() => setBsType("Standalone")}
            >
              Standalone
            </button>
            <button
              className={`${styles.toggleBtn} ${bsType === "Consolidated" ? styles.activeToggle : ""}`}
              onClick={() => setBsType("Consolidated")}
            >
              Consolidated
            </button>
          </div>
        </div>
      </div>

      <div className={styles.blurContainer}>
        {!balanceSheetLoading && !balanceSheetError && !hasBsData && (
          <div className={styles.overlay}>
            <span className={styles.overlayTitle}>Content Not Available</span>
            <span className={styles.overlaySubtitle}>Need MCA Documents.</span>
            <div className={styles.lockIcon} onClick={() => { setActiveSection?.("documents"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ cursor: "pointer" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
            </div>
          </div>
        )}
        <div className={`${styles.tableWrapper} ${!balanceSheetLoading && !balanceSheetError && !hasBsData ? styles.blurContent : ""}`}>
          {balanceSheetLoading ? (
            renderSkeletonTable(6)
          ) : balanceSheetError ? (
            <div style={{ padding: "24px 16px", color: "#EF4444", fontSize: "14px" }}>
              Error: {balanceSheetError}
            </div>
          ) : (
            <table
              className={styles.table}
              style={{ minWidth: `${250 + displayBsPeriods.length * 130}px` }}
            >
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.particularsCell}>Particulars</th>
                  {displayBsPeriods.map((period) => (
                    <th key={period} className={styles.dateCell}>
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayBsRows.map((row, index) => {
                  const isHeader = row.type === "header";
                  const isGrandTotal = row.type === "grand-total";
                  let rowClass = styles.row;
                  if (isHeader) rowClass = styles.sectionHeaderRow;
                  if (isGrandTotal)
                    rowClass = `${styles.totalRow} ${styles.grandTotalRow}`;

                  return (
                    <tr key={index} className={rowClass}>
                      <td className={styles.labelCell}>{row.label}</td>
                      {displayBsPeriods.map((period) => (
                        <td key={period} className={styles.valueCell}>
                          {getValue(row.valuesObj, period)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div
        ref={profitLossRef}
        style={{ marginTop: "32px" }}
        className={styles.headerContainer}
      >
        <div className={styles.headerTitle}>Profit &amp; Loss</div>
        <div className={styles.headerControls}>
          <span className={styles.currencyText}>
            {pnlApiData?.currency || "Values in Cr."}
          </span>
          <div className={styles.toggleContainer}>
            <div
              className={`${styles.toggleSlider} ${
                pnlViewType === "Standalone"
                  ? styles.sliderStandalone
                  : styles.sliderConsolidated
              }`}
            ></div>
            <button
              className={`${styles.toggleBtn} ${
                pnlViewType === "Standalone" ? styles.activeToggle : ""
              }`}
              onClick={() => setPnlViewType("Standalone")}
            >
              Standalone
            </button>
            <button
              className={`${styles.toggleBtn} ${
                pnlViewType === "Consolidated" ? styles.activeToggle : ""
              }`}
              onClick={() => setPnlViewType("Consolidated")}
            >
              Consolidated
            </button>
          </div>
        </div>
      </div>

      <div className={styles.blurContainer}>
        {!pnlLoading && !pnlError && !hasPnlData && (
          <div className={styles.overlay}>
            <span className={styles.overlayTitle}>Content Not Available</span>
            <span className={styles.overlaySubtitle}>Need MCA Documents.</span>
            <div className={styles.lockIcon} onClick={() => { setActiveSection?.("documents"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ cursor: "pointer" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
            </div>
          </div>
        )}
        <div className={`${styles.tableWrapper} ${!pnlLoading && !pnlError && !hasPnlData ? styles.blurContent : ""}`}>
          {pnlLoading ? (
            renderSkeletonTable(6)
          ) : pnlError ? (
            <div style={{ padding: "24px 16px", color: "#EF4444", fontSize: "14px" }}>
              Error: {pnlError}
            </div>
          ) : (
            <table
              className={styles.table}
              style={{ minWidth: `${250 + displayPnlPeriods.length * 130}px` }}
            >
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.particularsCell}>Particulars</th>
                  {displayPnlPeriods.map((period) => (
                    <th key={period} className={styles.dateCell}>
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayPnlRows.map((row, index) => {
                  const isHeader = row.type === "header";
                  const isGrandTotal = row.type === "grand-total";
                  let rowClass = styles.row;
                  if (isHeader) rowClass = styles.sectionHeaderRow;
                  if (isGrandTotal)
                    rowClass = `${styles.totalRow} ${styles.grandTotalRow}`;

                  return (
                    <tr key={index} className={rowClass}>
                      <td className={styles.labelCell}>{row.label}</td>
                      {displayPnlPeriods.map((period) => (
                        <td key={period} className={styles.valueCell}>
                          {getValue(row.valuesObj, period)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div
        ref={cashFlowRef}
        style={{ marginTop: "32px" }}
        className={styles.headerContainer}
      >
        <div className={styles.headerTitle}>Cash Flow</div>
        <div className={styles.headerControls}>
          <span className={styles.currencyText}>Values in Cr.</span>
          <div className={styles.toggleContainer}>
            <div
              className={`${styles.toggleSlider} ${cfType === "Standalone" ? styles.sliderStandalone : styles.sliderConsolidated
                }`}
            ></div>
            <button
              className={`${styles.toggleBtn} ${cfType === "Standalone" ? styles.activeToggle : ""}`}
              onClick={() => setCfType("Standalone")}
            >
              Standalone
            </button>
            <button
              className={`${styles.toggleBtn} ${cfType === "Consolidated" ? styles.activeToggle : ""}`}
              onClick={() => setCfType("Consolidated")}
            >
              Consolidated
            </button>
          </div>
        </div>
      </div>

      <div className={styles.blurContainer}>
        {!cashFlowLoading && !cashFlowError && !hasCfData && (
          <div className={styles.overlay}>
            <span className={styles.overlayTitle}>Content Not Available</span>
            <span className={styles.overlaySubtitle}>Need MCA Documents.</span>
            <div className={styles.lockIcon} onClick={() => { setActiveSection?.("documents"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ cursor: "pointer" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
            </div>
          </div>
        )}
        <div className={`${styles.tableWrapper} ${!cashFlowLoading && !cashFlowError && !hasCfData ? styles.blurContent : ""}`}>
          {cashFlowLoading ? (
            renderSkeletonTable(6)
          ) : cashFlowError ? (
            <div style={{ padding: "24px 16px", color: "#EF4444", fontSize: "14px" }}>
              Error: {cashFlowError}
            </div>
          ) : (
            <table
              className={styles.table}
              style={{ minWidth: `${250 + displayCfPeriods.length * 130}px` }}
            >
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.particularsCell}>Particulars</th>
                  {displayCfPeriods.map((period) => (
                    <th key={period} className={styles.dateCell}>
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayCfRows.map((row, index) => {
                  const isTotal = row.type === "total";
                  return (
                    <tr
                      key={index}
                      className={isTotal ? styles.totalRow : styles.row}
                    >
                      <td className={styles.labelCell}>{row.label}</td>
                      {displayCfPeriods.map((period) => (
                        <td key={period} className={styles.valueCell}>
                          {getValue(getNestedValue(cashFlowData, period), row.path)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div
        ref={ratioRef}
        style={{ marginTop: "32px" }}
        className={styles.headerContainer}
      >
        <div className={styles.headerTitle}>Ratio </div>
        <div className={styles.headerControls}>
          <span className={styles.currencyText}>Values in Cr.</span>
          <div className={styles.toggleContainer}>
            <div
              className={`${styles.toggleSlider} ${ratiosType === "Standalone" ? styles.sliderStandalone : styles.sliderConsolidated
                }`}
            ></div>
            <button
              className={`${styles.toggleBtn} ${ratiosType === "Standalone" ? styles.activeToggle : ""}`}
              onClick={() => setRatiosType("Standalone")}
            >
              Standalone
            </button>
            <button
              className={`${styles.toggleBtn} ${ratiosType === "Consolidated" ? styles.activeToggle : ""}`}
              onClick={() => setRatiosType("Consolidated")}
            >
              Consolidated
            </button>
          </div>
        </div>
      </div>

      <div className={styles.blurContainer}>
        {!ratiosLoading && !ratiosError && !hasRatiosData && (
          <div className={styles.overlay}>
            <span className={styles.overlayTitle}>Content Not Available</span>
            <span className={styles.overlaySubtitle}>Need MCA Documents.</span>
            <div className={styles.lockIcon} onClick={() => { setActiveSection?.("documents"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ cursor: "pointer" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
            </div>
          </div>
        )}
        <div className={`${styles.tableWrapper} ${!ratiosLoading && !ratiosError && !hasRatiosData ? styles.blurContent : ""}`}>
          {ratiosLoading ? (
            renderSkeletonTable(6)
          ) : ratiosError ? (
            <div style={{ padding: "24px 16px", color: "#EF4444", fontSize: "14px" }}>
              Error: {ratiosError}
            </div>
          ) : (
            <table
              className={styles.table}
              style={{ minWidth: `${250 + displayRatiosPeriods.length * 130}px` }}
            >
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.particularsCell}>Particulars</th>
                  {displayRatiosPeriods.map((period) => (
                    <th key={period} className={styles.dateCell}>
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayRatiosRows.map((row, index) => {
                  const isHeader = row.type === "header";
                  let rowClass = styles.row;
                  if (isHeader) rowClass = styles.sectionHeaderRow;

                  return (
                    <tr key={index} className={rowClass}>
                      <td className={styles.labelCell}>{row.label}</td>
                      {displayRatiosPeriods.map((period) => (
                        <td key={period} className={styles.valueCell}>
                          {getValue(row.valuesObj, period)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div
        ref={auditorsRef}
        style={{ marginTop: "32px" }}
        className={styles.headerContainer}
      >
        <div className={styles.headerTitle}>Auditor's Detail </div>
        <div className={styles.headerControls}>
          <span className={styles.currencyText}>Values in Cr.</span>
          <div className={styles.toggleContainer}>
            <div
              className={`${styles.toggleSlider} ${audType == "Standalone" ? styles.sliderStandalone : styles.sliderConsolidated
                }`}
            ></div>
            <button
              className={`${styles.toggleBtn} ${audType == "Standalone" ? styles.activeToggle : ""}`}
              onClick={() => setAudType("Standalone")}
            >
              Standalone
            </button>
            <button
              className={`${styles.toggleBtn} ${audType == "Consolidated" ? styles.activeToggle : ""}`}
              onClick={() => setAudType("Consolidated")}
            >
              Consolidated
            </button>
          </div>
        </div>
      </div>

      {auditorsLoading ? (
        renderSkeletonTable(6)
      ) : auditorsError ? (
        <div style={{ padding: "24px 16px", color: "#EF4444", fontSize: "14px" }}>
          Error: {auditorsError}
        </div>
      ) : (() => {
        const hasValidData = auditorsData && auditorsData.length > 0 && auditorsData.some(row => 
          Object.values(row).some(val => val !== "-" && val !== null && val !== undefined && val !== "")
        );

        const displayAuditors = hasValidData ? auditorsData : [
          { auditor_type: "Statutory Auditor", membership: "123456", registration_no: "012345N", firm_name: "Mock Audit Firm LLP", pan: "ABCDE1234F", period: "2023-2024" },
          { auditor_type: "Internal Auditor", membership: "654321", registration_no: "543210M", firm_name: "Jane Doe & Co", pan: "FGHIJ5678K", period: "2023-2024" }
        ];

        return (
          <div className={styles.blurContainer}>
            {!hasValidData && (
              <div className={styles.overlay}>
                <span className={styles.overlayTitle}>Content Not Available</span>
                <span className={styles.overlaySubtitle}>Need MCA Documents.</span>
                <div className={styles.lockIcon} onClick={() => { setActiveSection?.("documents"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ cursor: "pointer" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
                </div>
              </div>
            )}
            <div className={`${styles.tableWrapper} ${styles.auditorTable} ${!hasValidData ? styles.blurContent : ""}`}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.headerRow}>
                    <th className={styles.dateCell}>Particulars</th>
                    <th className={styles.dateCell}>Membership Number</th>
                    <th className={styles.dateCell}>Firm Registration number</th>
                    <th className={styles.dateCell}>Name of auditor firm</th>
                    <th className={styles.dateCell}>PAN</th>
                    <th className={styles.dateCell}>Period</th>
                  </tr>
                </thead>
                <tbody>
                  {displayAuditors?.map((row, index) => (
                    <tr key={index}>
                      <td className={styles.labelCell}>{row?.auditor_type || "-"}</td>
                      <td className={styles.valueCell}>{row?.membership || "-"}</td>
                      <td className={styles.valueCell}>{row?.registration_no || "-"}</td>
                      <td className={styles.valueCell}>{row?.firm_name || "-"}</td>
                      <td className={styles.valueCell}>{row?.pan || "-"}</td>
                      <td className={styles.valueCell}>{row?.period || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default FinancialHighlightsTables;
