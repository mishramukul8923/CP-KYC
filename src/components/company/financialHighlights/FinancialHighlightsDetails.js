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
import styles from "./FinancialHighlightsDetails.module.css";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";

const FinancialHighlightsDetails = ({
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

  const [activeChartSlide, setActiveChartSlide] = React.useState('latest');
  const { setActiveSection } = useCompanySection();

  // Remove early return to allow partial data rendering

  if ((financialLoading && !financialError) || (revenueLoading && !revenueError)) {
    return (
      <div className={styles.mainWrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
          </div>
          <div className={styles.topGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`${styles.skeleton} ${styles.skeletonCard}`} />
            ))}
          </div>
          <div className={styles.tableSection}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`${styles.skeleton} ${styles.skeletonRow}`} />
            ))}
          </div>
          <div className={styles.chartSection}>
            <div className={`${styles.skeleton} ${styles.skeletonChart}`} />
          </div>
        </div>
      </div>
    );
  }

  function formatIndianNumber(num) {
    return Number(num).toLocaleString("en-IN");
  }

  const parseChange = (value) => {
    if (!value) return false;
    const number = parseFloat(value.replace("%", ""));
    return number < 0;
  };

  const formatValue = (obj) => {
    if (!obj || (obj.value === undefined && obj.unit === undefined)) return "-";
    const value = obj.value ?? "";
    const unit = obj.unit === "-" ? "" : (obj.unit ?? "");

    if (unit === "INR") {
      return value !== "" ? `₹${value}` : "-";
    }

    return (value !== "" || unit !== "") ? `${value}${unit}` : "-";
  };

  const topCards = [
    {
      label: "Revenue",
      value: formatValue(financialHighlights?.revenue),
      change: financialHighlights?.revenue?.change_pct,
      isNegative: parseChange(
        financialHighlights?.revenue?.change_pct
      ),
    },
    {
      label: "Profit",
      value: formatValue(financialHighlights?.profit),
      change: financialHighlights?.profit?.change_pct,
      isNegative: parseChange(financialHighlights?.profit?.change_pct),
    },
    {
      label: "Cash & Bank Balance",
      value: formatValue(financialHighlights?.cash_and_bank_balance),
      change: financialHighlights?.cash_and_bank_balance?.change_pct,
      isNegative: parseChange(financialHighlights?.cash_and_bank_balance?.change_pct),
    },
    {
      label: "Net Worth",
      value: formatValue(financialHighlights?.net_worth),
      change: financialHighlights?.net_worth?.change_pct,
      isNegative: parseChange(financialHighlights?.net_worth?.change_pct),
    },
    {
      label: "Assets",
      value: formatValue(financialHighlights?.assets),
      change: financialHighlights?.assets?.change_pct,
      isNegative: parseChange(financialHighlights?.assets?.change_pct),
    },
    {
      label: "Outsiders' Liabilities",
      value: formatValue(financialHighlights?.outsiders_liabilities),
      change: financialHighlights?.outsiders_liabilities?.change_pct,
      isNegative: parseChange(financialHighlights?.outsiders_liabilities?.change_pct),
    },
  ];

  const ratioData = [
    {
      label: "EBITDA",
      value: formatValue(financialHighlights?.ebitda),
      change: financialHighlights?.ebitda?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.ebitda?.change_pct),
    },
    {
      label: "Net Prot Margin",
      value: formatValue(financialHighlights?.net_profit_margin),
      change: financialHighlights?.net_profit_margin?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.net_profit_margin?.change_pct),
    },
    {
      label: "Sales to Fixed Asset",
      value: formatValue(financialHighlights?.sales_to_fixed_asset),
      change: financialHighlights?.sales_to_fixed_asset?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.sales_to_fixed_asset?.change_pct),
    },
    {
      label: "Debt to EBITDA",
      value: formatValue(financialHighlights?.debt_to_ebitda),
      change: financialHighlights?.debt_to_ebitda?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.debt_to_ebitda?.change_pct),
    },
    {
      label: "Interest Coverage Ratio",
      value: formatValue(financialHighlights?.interest_coverage_ratio),
      change: financialHighlights?.interest_coverage_ratio?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.interest_coverage_ratio?.change_pct),
    },
    {
      label: "Net Worth Margin",
      value: formatValue(financialHighlights?.net_worth_margin),
      change: financialHighlights?.net_worth_margin?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.net_worth_margin?.change_pct),
    },
    {
      label: "Debt to Equity",
      value: formatValue(financialHighlights?.debt_to_equity),
      change: financialHighlights?.debt_to_equity?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.debt_to_equity?.change_pct),
    },
    {
      label: "Return on Equity",
      value: formatValue(financialHighlights?.return_on_equity),
      change: financialHighlights?.return_on_equity?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.return_on_equity?.change_pct),
    },
    {
      label: "Equity Multiplier",
      value: formatValue(financialHighlights?.equity_multiplier),
      change: financialHighlights?.equity_multiplier?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.equity_multiplier?.change_pct),
    },
    {
      label: "PE Ratio",
      value: formatValue(financialHighlights?.pe_ratio),
      change: financialHighlights?.pe_ratio?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.pe_ratio?.change_pct),
    },
    {
      label: "Book Value",
      value: formatValue(financialHighlights?.book_value),
      change: financialHighlights?.book_value?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.book_value?.change_pct),
    },
    {
      label: "Reserves",
      value: formatValue(financialHighlights?.reserves),
      change: financialHighlights?.reserves?.change_pct || "-",
      isNegative: parseChange(financialHighlights?.reserves?.change_pct),
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
  // ];

  const getChartParams = (data) => {
    if (!data || data.length === 0) return null;
    
    // Revenue Axis Calculations
    const revenueValues = data.map(d => d.revenue);
    const maxRev = Math.max(...revenueValues, 0);
    const domainMaxRev = Math.ceil((maxRev * 1.1) / 100) * 100 || 500;

    // Profit Axis Calculations
    const profitValues = data.map(d => d.profit);
    const minProf = Math.min(...profitValues, 0);
    const maxProf = Math.max(...profitValues, 0);
    const domainMaxProf = Math.ceil((maxProf * 1.1) / 10) * 10 || 50;

    let domainMinRev = 0;
    let domainMinProf = 0;

    if (minProf < 0) {
      // Profit has negative values
      domainMinProf = Math.floor((minProf * 1.1) / 10) * 10 || -10;
      // Align the zero line of revenue with profit
      domainMinRev = domainMaxRev * (domainMinProf / domainMaxProf);
    }

    // Calculate ticks
    const rangeRev = domainMaxRev - domainMinRev;
    const stepRev = rangeRev / 5;
    const ticksRev = Array.from({ length: 6 }, (_, i) => Math.round(domainMinRev + i * stepRev));

    const rangeProf = domainMaxProf - domainMinProf;
    const stepProf = rangeProf / 5;
    const ticksProf = Array.from({ length: 6 }, (_, i) => Math.round(domainMinProf + i * stepProf));

    const longestLabelLengthLeft = ticksRev.reduce((max, tick) => {
      const label = `${formatIndianNumber(tick)} cr`;
      return label.length > max ? label.length : max;
    }, 0);
    const dynamicYAxisWidthLeft = Math.max(80, longestLabelLengthLeft * 8.5 + 10);

    const longestLabelLengthRight = ticksProf.reduce((max, tick) => {
      const label = `${formatIndianNumber(tick)} cr`;
      return label.length > max ? label.length : max;
    }, 0);
    const dynamicYAxisWidthRight = Math.max(80, longestLabelLengthRight * 8.5 + 10);

    return {
      domainMaxRev,
      domainMinRev,
      ticksRev,
      dynamicYAxisWidthLeft,
      domainMaxProf,
      domainMinProf,
      ticksProf,
      dynamicYAxisWidthRight
    };
  };

  const allChartData = (revenueProfitTrend?.trend || [])
    .filter((item) => item.year !== "TTM" && item.year !== "isExpandable")
    .map((item) => {
      const match = String(item.year).match(/\d+/);
      const yearNum = match ? parseInt(match[0], 10) : 0;
      return {
        year: item.year,
        revenue: Number(item.revenue_cr ?? item.Revenue ?? item.revenue ?? 0),
        profit: Number(item.profit_cr ?? item.Profit ?? item.profit ?? 0),
        yearNum,
      };
    })
    .sort((a, b) => b.yearNum - a.yearNum);

  const hasSplitCharts = allChartData.length > 10;
  const chartDataLatest = hasSplitCharts
    ? allChartData.slice(0, 10).sort((a, b) => a.yearNum - b.yearNum)
    : allChartData.sort((a, b) => a.yearNum - b.yearNum);

  const chartDataOlder = hasSplitCharts
    ? allChartData.slice(10).sort((a, b) => a.yearNum - b.yearNum)
    : [];

  const latestParams = getChartParams(chartDataLatest);
  const olderParams = getChartParams(chartDataOlder);

  const renderSingleChart = (data, params, subtitle) => {
    if (!data || data.length === 0 || !params) return null;
    return (
      <div style={{ marginBottom: "30px", width: "100%" }}>
        {subtitle && (
          <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#4B5563", marginBottom: "12px", paddingLeft: "10px" }}>
            {subtitle}
          </h4>
        )}
        <div className={styles.chartWrapper}>
          <div className={styles.scrollX}>
            <div style={{ minWidth: `${Math.max(data.length * 80, 500)}px`, height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 5, left: 5, bottom: 0 }}
                >
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
                    yAxisId="left"
                    orientation="left"
                    width={params.dynamicYAxisWidthLeft + 25}
                    axisLine={{ stroke: "rgba(229, 231, 235, 1)" }}
                    tickLine={false}
                    tickMargin={20}
                    tick={{
                      fill: "rgba(55, 65, 81, 1)",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                    tickFormatter={(value) => `${formatIndianNumber(value)} cr`}
                    domain={[params.domainMinRev, params.domainMaxRev]}
                    ticks={params.ticksRev}
                    label={{
                      value: "Revenue",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        textAnchor: "middle",
                        fill: "rgba(113, 113, 122, 1)",
                        fontSize: 14,
                        fontWeight: 500,
                      }
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    width={params.dynamicYAxisWidthRight + 25}
                    axisLine={{ stroke: "rgba(229, 231, 235, 1)" }}
                    tickLine={false}
                    tickMargin={20}
                    tick={{
                      fill: "rgba(55, 65, 81, 1)",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                    tickFormatter={(value) => `${formatIndianNumber(value)} cr`}
                    domain={[params.domainMinProf, params.domainMaxProf]}
                    ticks={params.ticksProf}
                    label={{
                      value: "Profit",
                      angle: 90,
                      position: "insideRight",
                      style: {
                        textAnchor: "middle",
                        fill: "rgba(113, 113, 122, 1)",
                        fontSize: 14,
                        fontWeight: 500,
                      }
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    formatter={(value, name) => [`${formatIndianNumber(value)} cr`, name.charAt(0).toUpperCase() + name.slice(1)]}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    fill="rgba(59, 130, 246, 1)"
                    radius={[20, 20, 0, 0]}
                    barSize={32.73}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="profit"
                    fill="rgba(34, 197, 94, 1)"
                    radius={[20, 20, 0, 0]}
                    barSize={32.73}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        {(financialError || revenueError) && (
          <div style={{ color: "#EF4444", fontWeight: 500, marginBottom: "20px", padding: "12px", background: "#FEF2F2", borderRadius: "8px", border: "1px solid #FCA5A5" }}>
            {financialError || revenueError}
          </div>
        )}
        <div className={styles.header}>
          <h2 className={styles.title}>Financial Highlights</h2>
          <button
            className={styles.viewDetails}
            onClick={() => setActiveSection("financials")}
          >
            View Full Details
            <img
              src="/icons/chevron-right.svg"
              alt=""
              className={styles.chevron}
            />
          </button>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {hasSplitCharts && (
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F3F4F6', padding: '3px', borderRadius: '20px' }}>
                  <button
                    onClick={() => setActiveChartSlide('latest')}
                    style={{
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: '600',
                      borderRadius: '16px',
                      border: 'none',
                      backgroundColor: activeChartSlide === 'latest' ? '#3B82F6' : 'transparent',
                      color: activeChartSlide === 'latest' ? '#FFFFFF' : '#4B5563',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Latest 10 Years
                  </button>
                  <button
                    onClick={() => setActiveChartSlide('older')}
                    style={{
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: '600',
                      borderRadius: '16px',
                      border: 'none',
                      backgroundColor: activeChartSlide === 'older' ? '#3B82F6' : 'transparent',
                      color: activeChartSlide === 'older' ? '#FFFFFF' : '#4B5563',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Older Years
                  </button>
                </div>
              )}
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
          </div>
          <div className={styles.chartContainer}>
            {allChartData.length > 0 ? (
              <>
                {hasSplitCharts ? (
                  activeChartSlide === 'latest' ? (
                    renderSingleChart(chartDataLatest, latestParams)
                  ) : (
                    renderSingleChart(chartDataOlder, olderParams)
                  )
                ) : (
                  renderSingleChart(chartDataLatest, latestParams)
                )}
              </>
            ) : (
              <div className={styles.noDataMessage}>No revenue and profit trend available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHighlightsDetails;
