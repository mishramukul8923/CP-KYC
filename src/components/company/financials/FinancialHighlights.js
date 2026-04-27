"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./FinancialHighlights.module.css";
import FinancialHighlightsTables from "../financialHighlights/FinancialHighlightsTables";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";
import { useEffect, useRef } from "react";
import { scrollToElementWithOffset } from "@/utils/scrollUtils";
import { formatDateToIST } from "@/utils/dateFormatter";


const FinancialHighlights = ({
  financialHighlights,
  revenueProfitTrend,
  financialLoading,
  financialError,
  revenueLoading,
  revenueError,
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

  const { activeSubSection } = useCompanySection();

  const containerRef = useRef(null);
  const balanceSheetRef = useRef(null);
  const profitLossRef = useRef(null);
  const cashFlowRef = useRef(null);
  const ratioRef = useRef(null);
  const auditorsRef = useRef(null);

  useEffect(() => {
    if (!activeSubSection) return;

    const scroll = (ref) => {
      if (ref?.current) {
        scrollToElementWithOffset(ref.current, 140);
      }
    };


    switch (activeSubSection) {
      case "Financials Highlights":
        scroll(containerRef);
        break;

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

  if (!financialHighlights && (financialLoading || revenueLoading)) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Financials</h1>
          <div className={styles.headerInfo}>
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100px' }} />
            <div className={styles.infoDivider}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '150px' }} />
          </div>
        </div>
        
        <div className={styles.sectionHeader}>
          <div className={`${styles.skeleton} ${styles.skeletonHeader}`} style={{ marginTop: '20px' }} />
        </div>

        <div className={styles.topGrid}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`${styles.skeleton} ${styles.skeletonStatCard}`} />
          ))}
        </div>

        <div className={styles.sectionHeader}>
          <div className={`${styles.skeleton} ${styles.skeletonHeader}`} style={{ marginTop: '20px' }} />
        </div>

        <div className={styles.tableSection}>
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className={styles.tableRow} style={{ padding: '8px 0' }}>
              <div className={`${styles.skeleton} ${styles.skeletonText}`} />
              <div className={`${styles.skeleton} ${styles.skeletonText}`} />
              <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '80px' }} />
            </div>
          ))}
        </div>

        <div className={styles.sectionHeader}>
          <div className={`${styles.skeleton} ${styles.skeletonHeader}`} style={{ marginTop: '20px' }} />
        </div>

        <div className={`${styles.skeleton} ${styles.skeletonChartSection}`} />

        <div style={{ marginTop: "40px" }}>
          <FinancialHighlightsTables
            pnlApiData={pnlApiData}
            pnlLoading={pnlLoading}
            pnlError={pnlError}
            pnlViewType={pnlViewType}
            setPnlViewType={setPnlViewType}
            auditorsData={auditorsData}
            auditorsLoading={auditorsLoading}
            auditorsError={auditorsError}
            audType={audType}
            setAudType={setAudType}
            balanceSheetData={balanceSheetData}
            balanceSheetLoading={balanceSheetLoading}
            balanceSheetError={balanceSheetError}
            bsType={bsType}
            setBsType={setBsType}
            cashFlowData={cashFlowData}
            cashFlowLoading={cashFlowLoading}
            cashFlowError={cashFlowError}
            cfType={cfType}
            setCfType={setCfType}
            ratiosData={ratiosData}
            ratiosLoading={ratiosLoading}
            ratiosError={ratiosError}
            ratiosType={ratiosType}
            setRatiosType={setRatiosType}
          />
        </div>
      </div>
    );
  }

  // Remove early return to allow partial data rendering



  if ((financialLoading && !financialError) || (revenueLoading && !revenueError)) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Financials</h1>
          <div className={styles.headerInfo}>
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100px' }} />
            <div className={styles.infoDivider}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '150px' }} />
          </div>
        </div>
        <div className={styles.topGrid}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`${styles.skeleton} ${styles.skeletonStatCard}`} />
          ))}
        </div>
        <div className={`${styles.skeleton} ${styles.skeletonChartSection}`} style={{ marginTop: '20px' }} />
      </div>
    );
  }

  const financialHighlightsData = financialHighlights;

  const parseChange = (value) => {
    if (!value) return false;
    const number = parseFloat(value.replace("%", ""));
    return number < 0;
  };

  

  const formatIndianNumber = (val) => {
    if (val === undefined || val === null || val === "-") return val;
    const num = typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : val;
    if (isNaN(num)) return val;
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const formatValue = (obj) => {
    if (!obj || (obj.value === undefined && obj.unit === undefined)) return "-";
    const value = obj.value ?? "";
    const unit = obj.unit === "-" ? "" : (obj.unit ?? "");
    const formattedValue = value !== "" ? formatIndianNumber(value) : "";

    if (unit === "INR") {
      return formattedValue !== "" ? `₹${formattedValue}` : "-";
    }
    return (formattedValue !== "" || unit !== "") ? `${formattedValue}${unit}` : "-";
  };


  const topCards = [
    {
      label: "Revenue",
      value: formatValue(financialHighlightsData?.revenue),
      change: financialHighlightsData?.revenue?.change_pct,
      isNegative: parseChange(
        financialHighlightsData?.revenue?.change_pct
      ),
    },
    {
      label: "Profit",
      value: formatValue(financialHighlightsData?.profit),
      change: financialHighlightsData?.profit?.change_pct,
      isNegative: parseChange(financialHighlightsData?.profit?.change_pct),
    },
    {
      label: "Cash & Bank Balance",
      value: formatValue(financialHighlightsData?.cash_and_bank_balance),
      change: financialHighlightsData?.cash_and_bank_balance?.change_pct,
      isNegative: parseChange(financialHighlightsData?.cash_and_bank_balance?.change_pct),
    },
    {
      label: "Net Worth",
      value: formatValue(financialHighlightsData?.net_worth),
      change: financialHighlightsData?.net_worth?.change_pct,
      isNegative: parseChange(financialHighlightsData?.net_worth?.change_pct),
    },
    {
      label: "Assets",
      value: formatValue(financialHighlightsData?.assets),
      change: financialHighlightsData?.assets?.change_pct,
      isNegative: parseChange(financialHighlightsData?.assets?.change_pct),
    },
    {
      label: "Outsiders' Liabilities",
      value: formatValue(financialHighlightsData?.outsiders_liabilities),
      change: financialHighlightsData?.outsiders_liabilities?.change_pct,
      isNegative: parseChange(financialHighlightsData?.outsiders_liabilities?.change_pct),
    },
  ];

  const ratioData = [
    {
      label: "EBITDA",
      value: formatValue(financialHighlightsData?.ebitda),
      change: financialHighlightsData?.ebitda?.change_pct || "-",
      isNegative: parseChange(financialHighlightsData?.ebitda?.change_pct),
    },
    {
      label: "Net Prot Margin",
      value: formatValue(financialHighlightsData?.net_profit_margin),
      change: financialHighlightsData?.net_profit_margin?.change_pct || "-",
      isNegative: parseChange(financialHighlightsData?.net_profit_margin?.change_pct),
    },
    {
      label: "Sales to Fixed Asset",
      value: formatValue(financialHighlightsData?.sales_to_fixed_asset),
      change: financialHighlightsData?.sales_to_fixed_asset?.change_pct || "-",
      isNegative: parseChange(financialHighlightsData?.sales_to_fixed_asset?.change_pct),
    },
    {
      label: "Debt to EBITDA",
      value: formatValue(financialHighlightsData?.debt_to_ebitda),
      change: financialHighlightsData?.debt_to_ebitda?.change_pct || "-",
      isNegative: parseChange(financialHighlightsData?.debt_to_ebitda?.change_pct),
    },
    {
      label: "Interest Coverage Ratio",
      value: formatValue(financialHighlightsData?.interest_coverage_ratio),
      change: financialHighlightsData?.interest_coverage_ratio?.change_pct || "-",
      isNegative: parseChange(financialHighlightsData?.interest_coverage_ratio?.change_pct),
    },
    {
      label: "Net Worth Margin",
      value: formatValue(financialHighlightsData?.net_worth_margin),
      change: financialHighlightsData?.net_worth_margin?.change_pct || "-",
      isNegative: parseChange(financialHighlightsData?.net_worth_margin?.change_pct),
    },
    {
      label: "Debt to Equity",
      value: formatValue(financialHighlightsData?.debt_to_equity),
      change: financialHighlightsData?.debt_to_equity?.change_pct || "-",
      isNegative: parseChange(financialHighlightsData?.debt_to_equity?.change_pct),
    },
    {
      label: "Return on Equity",
      value: formatValue(financialHighlightsData?.return_on_equity),
      change: financialHighlightsData?.return_on_equity?.change_pct || "-",
      isNegative: parseChange(financialHighlightsData?.return_on_equity?.change_pct),
    },
    {
      label: "Equity Multiplier",
      value: formatValue(financialHighlightsData?.equity_multiplier),
      change: financialHighlightsData?.equity_multiplier?.change_pct || "-",
      isNegative: parseChange(financialHighlightsData?.equity_multiplier?.change_pct),
    },
    {
      label:"PE Ratio",
      value:formatValue(financialHighlightsData?.pe_ratio),
      change:financialHighlightsData?.pe_ratio?.change_pct || "-",
      isNegative:parseChange(financialHighlightsData?.pe_ratio?.change_pct),
    },
    {
      label:"Book Value",
      value:formatValue(financialHighlightsData?.book_value),
      change:financialHighlightsData?.book_value?.change_pct || "-",
      isNegative:parseChange(financialHighlightsData?.book_value?.change_pct),
    },
    {
      label:"Reserves",
      value:formatValue(financialHighlightsData?.reserves),
      change:financialHighlightsData?.reserves?.change_pct || "-",
      isNegative:parseChange(financialHighlightsData?.reserves?.change_pct),
    }

  ];

  // const chartData = [
  //   { year: "2015", revenue: 7800, profit: 3200 },
  //   { year: "2016", revenue: 7800, profit: 3200 },
  //   { year: "2017", revenue: 7800, profit: 3200 },
  //   { year: "2018", revenue: 7800, profit: 3200 },
  //   { year: "2019", revenue: 7800, profit: 3200 },
  //   { year: "2020", revenue: 7800, profit: 3200 },
  //   { year: "2021", revenue: 7800, profit: 3200 },
  //   { year: "2022", revenue: 7800, profit: 3200 },
  //   { year: "2023", revenue: 7800, profit: 3200 },
  //   { year: "2024", revenue: 7800, profit: 3200 },
  //   { year: "2025", revenue: 7800, profit: 3200 },
  const chartData = (revenueProfitTrend?.trend || [])
    .filter((item) => item.year !== "TTM" && item.year !== "isExpandable")
    .map((item) => ({
      year: item.year,
      revenue: item.revenue_cr,
      profit: item.profit_cr,
    }))
    .reverse();

  const maxVal = Math.max(...chartData.map(d => Math.max(d.revenue || 0, d.profit || 0)), 0);
  const domainMax = Math.ceil((maxVal * 1.1) / 100) * 100 || 5000;
  const step = Math.ceil(domainMax / 5 / 10) * 10 || 1000;
  const dynamicTicks = Array.from({ length: 6 }, (_, i) => i * step);

  const longestLabelLength = dynamicTicks.reduce((max, tick) => {
    const label = `${formatIndianNumber(tick)} cr`;
    return label.length > max ? label.length : max;
  }, 0);
  const dynamicYAxisWidth = Math.max(80, longestLabelLength * 8.5 + 10);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Financials</h1>
        <div className={styles.headerInfo}>
          <span className={styles.infoGroup}>
            <span className={styles.infoLabel}>Source:</span>
            <span className={styles.infoValue}>{financialHighlights?.source || "-"}</span>
          </span>
          <span className={styles.infoDivider}></span>
          <span className={styles.infoGroup}>
            <span className={styles.infoLabel}>Last Updated:</span>
            <span className={styles.infoValue}>{financialHighlights?.last_updated ? formatDateToIST(financialHighlights.last_updated) : "-"}</span>
          </span>
        </div>
      </div>

      {(financialError || revenueError) && (
        <div style={{ color: "#EF4444", fontWeight: 500, marginBottom: "20px", padding: "12px", background: "#FEF2F2", borderRadius: "8px", border: "1px solid #FCA5A5" }}>
          {financialError || revenueError}
        </div>
      )}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Financials Highlights</h2>
        {/* <Link
            href="/company/financialHighlights"
            className={styles.viewDetails}
            >
            View Full Detials
            <img
                src="/icons/chevron-right.svg"
                alt=""
                className={styles.chevron}
            />
        </Link> */}
      </div>
      <div className={styles.topGrid}>
        {topCards.map((card, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{card.label}</span>
              <span
                className={`${styles.badge} ${card.isNegative ? styles.negativeBadge : styles.positiveBadge}`}
              >
                {card.change}
              </span>
            </div>
            <div className={styles.statValue}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.tableSection}>
        {ratioData.map((item, idx) => (
          <div key={idx} className={styles.tableRow}>
            <span className={styles.rowLabel}>{item.label}</span>
            <span className={styles.rowValue}>{item.value}</span>
            <span
              className={`${styles.rowBadge} ${item.change === '-' || item.change === null || item.change === undefined
                ? styles.rowNegative
                : item.isNegative
                  ? styles.rowNegative
                  : styles.rowPositive
                }`}
            >
              {item.change === '-' || item.change === null || item.change === undefined ? (
                '-'
              ) : (
                <>
                  <img
                    src={
                      item.isNegative
                        ? "/icons/arrow-down.svg"
                        : "/icons/arrow-up-green.svg"
                    }
                    alt=""
                    className={styles.arrowIcon}
                  />
                  {item.change}
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Revenue & Profit Trend</h3>
          <div className={styles.customLegend}>
            <div className={styles.legendItem}>
              <span className={styles.blueDot}></span> Revenue
            </div>
            <div className={styles.legendDivider}></div>
            <div className={styles.legendItem}>
              <span className={styles.greenDot}></span> Profit
            </div>
          </div>
        </div>
        <div className={styles.chartContainer}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
              >
                {/* Added strokeDasharray="5 5" for the dotted horizontal lines shown in design */}
                <CartesianGrid
                  strokeDasharray="5 5"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="year"
                  axisLine={{ stroke: "rgba(229, 231, 235, 1)" }}
                  tickLine={false}
                  tick={{
                    fill: "rgba(113, 113, 122, 1)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                  dy={6}
                />
                <YAxis
                  width={dynamicYAxisWidth}
                  axisLine={{ stroke: "rgba(229, 231, 235, 1)" }}
                  tickLine={false}
                  tick={{
                    fill: "rgba(55, 65, 81, 1)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                  tickFormatter={(value) => `${formatIndianNumber(value)} cr`}
                  domain={[0, domainMax]}
                  ticks={dynamicTicks}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  formatter={(value) => `${formatIndianNumber(value)} cr`}
                />
                {/* radius={[20, 20, 20, 20]} creates the pill shape seen in the image */}
                <Bar
                  dataKey="revenue"
                  fill="rgba(59, 130, 246, 1)"
                  radius={[20, 20, 0, 0]}
                  barSize={32.73}
                />
                <Bar
                  dataKey="profit"
                  fill="rgba(34, 197, 94, 1)"
                  radius={[20, 20, 0, 0]}
                  barSize={32.73}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noDataMessage}>No revenue and profit trend available</div>
          )}
        </div>
      </div>
      <FinancialHighlightsTables
        pnlApiData={pnlApiData}
        pnlLoading={pnlLoading}
        pnlError={pnlError}
        pnlViewType={pnlViewType}
        setPnlViewType={setPnlViewType}
        auditorsData={auditorsData}
        auditorsLoading={auditorsLoading}
        auditorsError={auditorsError}
        audType={audType}
        setAudType={setAudType}
        balanceSheetData={balanceSheetData}
        balanceSheetLoading={balanceSheetLoading}
        balanceSheetError={balanceSheetError}
        bsType={bsType}
        setBsType={setBsType}
        cashFlowData={cashFlowData}
        cashFlowLoading={cashFlowLoading}
        cashFlowError={cashFlowError}
        cfType={cfType}
        setCfType={setCfType}
        ratiosData={ratiosData}
        ratiosLoading={ratiosLoading}
        ratiosError={ratiosError}
        ratiosType={ratiosType}
        setRatiosType={setRatiosType}
      />
    </div>
  );
};

export default FinancialHighlights;
