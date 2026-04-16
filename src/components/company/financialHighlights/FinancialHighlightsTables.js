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

  const { activeSubSection } = useCompanySection();

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

      <div className={styles.tableWrapper}>
        {balanceSheetLoading ? (
          <div style={{ padding: "24px 16px", color: "#71717A", fontSize: "14px" }}>
            Loading Balance Sheet data...
          </div>
        ) : balanceSheetError ? (
          <div style={{ padding: "24px 16px", color: "#EF4444", fontSize: "14px" }}>
            Error: {balanceSheetError}
          </div>
        ) : balanceSheetData && bsPeriods.length > 0 ? (
          <table
            className={styles.table}
            style={{ minWidth: `${250 + bsPeriods.length * 130}px` }}
          >
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.particularsCell}>Particulars</th>
                {bsPeriods.map((period) => (
                  <th key={period} className={styles.dateCell}>
                    {period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bsRows.map((row, index) => {
                const isHeader = row.type === "header";
                const isGrandTotal = row.type === "grand-total";
                let rowClass = styles.row;
                if (isHeader) rowClass = styles.sectionHeaderRow;
                if (isGrandTotal)
                  rowClass = `${styles.totalRow} ${styles.grandTotalRow}`;

                return (
                  <tr key={index} className={rowClass}>
                    <td className={styles.labelCell}>{row.label}</td>
                    {isHeader
                      ? bsPeriods.map((p) => (
                          <td key={p} className={styles.valueCell}></td>
                        ))
                      : bsPeriods.map((p) => (
                          <td key={p} className={styles.valueCell}>
                            {getValue(row.valuesObj, p)}
                          </td>
                        ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "24px 16px", color: "#71717A", fontSize: "14px" }}>
            No Balance Sheet data available.
          </div>
        )}
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

      <div className={styles.tableWrapper}>
        {pnlLoading ? (
          <div style={{ padding: "24px 16px", color: "#71717A", fontSize: "14px" }}>
            Loading Profit &amp; Loss data...
          </div>
        )
        //  : pnlError ? (
        //   <div style={{ padding: "24px 16px", color: "#EF4444", fontSize: "14px" }}>
        //     Error: {pnlError}
        //   </div>
        //         ) 
                : pnlApiData && pnlPeriods.length > 0 ? (
          <table
            className={styles.table}
            style={{ minWidth: `${250 + pnlPeriods.length * 130}px` }}
          >
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.particularsCell}>Particulars</th>
                {pnlPeriods.map((period) => (
                  <th key={period} className={styles.dateCell}>
                    {period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pnlRows.map((row, index) => {
                const isHeader = row.type === "header";
                const isGrandTotal = row.type === "grand-total";
                let rowClass = styles.row;
                if (isHeader) rowClass = styles.sectionHeaderRow;
                if (isGrandTotal)
                  rowClass = `${styles.totalRow} ${styles.grandTotalRow}`;

                return (
                  <tr key={index} className={rowClass}>
                    <td className={styles.labelCell}>{row.label}</td>
                    {isHeader
                      ? pnlPeriods.map((p) => (
                          <td key={p} className={styles.valueCell}></td>
                        ))
                      : pnlPeriods.map((p) => (
                          <td key={p} className={styles.valueCell}>
                            {getValue(row.valuesObj, p)}
                          </td>
                        ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "24px 16px", color: "#71717A", fontSize: "14px" }}>
            No Profit & Loss data available.
          </div>
        )}
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

      <div className={`${styles.tableWrapper} ${styles.cashFlowTable}`}>
        {cashFlowLoading ? (
          <div style={{ padding: "24px 16px", color: "#71717A", fontSize: "14px" }}>
            Loading Cash Flow data...
          </div>
        
        ) : cashFlowData && cfPeriods.length > 0 ? (
          <table
            className={styles.table}
            style={{ minWidth: `${250 + cfPeriods.length * 130}px` }}
          >
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.particularsCell}>Particulars</th>
                {cfPeriods.map((p) => (
                  <th key={p} className={styles.dateCell}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cfRows.map((row, index) => {
                const isHeader = row.type === "header";
                const isTotal = row.type === "total" || row.type === "grand-total";

                let rowClass = styles.row;
                if (isHeader) rowClass = styles.sectionHeaderRow;
                if (isTotal) rowClass = styles.totalRow;
                if (row.type === "grand-total") rowClass = `${styles.totalRow} ${styles.grandTotalRow}`;

                return (
                  <tr key={index} className={rowClass}>
                    <td className={styles.labelCell}>{row.label}</td>
                    {isHeader
                      ? cfPeriods.map((p) => (
                          <td key={p} className={styles.valueCell}></td>
                        ))
                      : cfPeriods.map((p) => (
                          <td key={p} className={styles.valueCell}>
                            {getValue(row.valuesObj, p)}
                          </td>
                        ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "24px 16px", color: "#71717A", fontSize: "14px" }}>
            No Cash Flow data available.
          </div>
        )}
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

      <div className={styles.tableWrapper}>
        {ratiosLoading ? (
          <div style={{ padding: "24px 16px", color: "#71717A", fontSize: "14px" }}>
            Loading Ratios data...
          </div>
        ) : ratiosError ? (
          <div style={{ padding: "24px 16px", color: "#EF4444", fontSize: "14px" }}>
            Error: {ratiosError}
          </div>
        ) : ratiosData && ratiosPeriods.length > 0 ? (
          <table
            className={styles.table}
            style={{ minWidth: `${250 + ratiosPeriods.length * 130}px` }}
          >
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.particularsCell}>Particulars</th>
                {ratiosPeriods.map((p) => (
                  <th key={p} className={styles.dateCell}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ratioRows.map((row, index) => {
                const isHeader = row.type === "header";
                let rowClass = styles.row;
                if (isHeader) rowClass = styles.sectionHeaderRow;

                return (
                  <tr key={index} className={rowClass}>
                    <td className={styles.labelCell}>{row.label}</td>
                    {isHeader
                      ? ratiosPeriods.map((p) => (
                          <td key={p} className={styles.valueCell}></td>
                        ))
                      : ratiosPeriods.map((p) => (
                          <td key={p} className={styles.valueCell}>
                            {getValue(row.valuesObj, p)}
                          </td>
                        ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "24px 16px", color: "#71717A", fontSize: "14px" }}>
            No Ratios data available.
          </div>
        )}
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
        <div style={{ padding: "24px 16px", color: "#71717A", fontSize: "14px" }}>
          Loading Auditors data...
        </div>
      ) : auditorsError ? (
        <div style={{ padding: "24px 16px", color: "#EF4444", fontSize: "14px" }}>
          Error: {auditorsError}
        </div>
      ) : auditorsData && auditorsData.length > 0 ? (
        <div className={`${styles.tableWrapper} ${styles.auditorTable}`}>
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
              {auditorsData?.map((row, index) => (
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
      ) : (
        <div style={{ padding: "24px 16px", color: "#71717A", fontSize: "14px" }}>
          No Auditors data available.
        </div>
      )}
    </div>
  );
};

export default FinancialHighlightsTables;
