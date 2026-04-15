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

  if (financialLoading || revenueLoading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (financialError || revenueError) {
    return (
      <div className={styles.container}>
        <div style={{ color: "red", fontWeight: 500 }}>
          {financialError || revenueError}
        </div>
      </div>
    );
  }

  if (!financialHighlights) {
    return <div className={styles.container}>Loading...</div>;
  }

  const financialHighlightsData = financialHighlights;

  if (!revenueProfitTrend) {
    return <div className={styles.container}>Loading...</div>;
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
  // ];

  const chartData = (revenueProfitTrend?.trend || [])
    .filter((item) => item.year !== "TTM" && item.year !== "isExpandable")
    .map((item) => ({
      year: item.year,
      revenue: item.revenue_cr ?? item.Revenue ?? item.revenue ?? 0,
      profit: item.profit_cr ?? item.Profit ?? item.profit ?? 0,
    }))
    .reverse();

  const maxVal = Math.max(...chartData.map(d => Math.max(d.revenue || 0, d.profit || 0)), 0);
  const domainMax = Math.ceil((maxVal * 1.1) / 100) * 100 || 5000;
  const step = Math.ceil(domainMax / 5 / 10) * 10 || 1000;
  const dynamicTicks = Array.from({ length: 6 }, (_, i) => i * step);

  const { setActiveSection } = useCompanySection();

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
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
              <div className={styles.chartWrapper}>
                <div className={styles.scrollX}>
                  <div style={{ minWidth: `${Math.max(chartData.length * 80, 500)}px`, height: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 10, left: 2, bottom: 0 }}
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
                          width={90}
                          axisLine={{ stroke: "rgba(229, 231, 235, 1)" }}
                          tickLine={false}
                          tick={{
                            fill: "rgba(55, 65, 81, 1)",
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                          tickFormatter={(value) => `${value} cr`}
                          domain={[0, domainMax]}
                          ticks={dynamicTicks}
                        />
                        <Tooltip
                          cursor={{ fill: "transparent" }}
                          formatter={(value) => `${value} cr`}
                        />
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
                  </div>
                </div>
              </div>
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
