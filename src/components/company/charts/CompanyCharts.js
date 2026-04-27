"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import styles from './CompanyCharts.module.css';

const COLORS = [
  '#D8B4FE', // Purple
  '#BBF7D8', // Light Green
  '#93C5FD', // Light Blue
  '#FDBA74', // Light Orange
  '#F9A8D4', // Pink
  '#A5F3FC', // Light Cyan
  '#C7D2FE', // Light Indigo
  '#FEF08A', // Light Yellow
  '#99F6E4', // Light Teal
  '#FECDD3', // Light Rose
  '#D9F99D', // Light Lime
  '#E9D5FF', // Light Purple
];



// Custom tick for Peer Comparison Bar Chart (copied from PeerComparison.js)
const CustomXAxisTick = ({ x, y, payload }) => {
  const words = payload.value.split(" ");
  return (
    <g transform={`translate(${x},${y})`}>
      {words.map((word, index) => (
        <text
          key={index}
          x={0}
          y={15 + index * 14}
          textAnchor="middle"
          fill="#6B7280"
          fontSize={11}
        >
          {word}
        </text>
      ))}
    </g>
  );
};

const CompanyCharts = ({ businessActivity, peerComparisonData, loading, layout = "row" }) => {
  // ... rest of data processing
  // Data for Business Activity Pie Chart
  const pieData = (businessActivity?.chart_segments || [
    { segment_name: 'Manufacturing', turnover_percentage: 81.33 },
    { segment_name: 'Food & Beverages', turnover_percentage: 18.67 }
  ]).map((item, index) => ({
    name: item.segment_name,
    value: parseFloat(item.turnover_percentage) || 0,
    color: COLORS[index % COLORS.length]
  }));

  // Data for Peer Comparison Bar Chart
  const barData = (peerComparisonData?.peer_turnover_chart?.items || []).map((item) => ({
    name: item.company_name,
    value: item.turnover_numeric,
    is_selected: item.is_selected_company
  }));

  // Data for Business Activity Table
  const activityTable = (businessActivity?.table_rows || [
    {
      business_activity: "Chemical and chemical products, pharmaceuticals, medicinal chemical and botanical products",
      turnover_percentage: "81.33",
      turnover: "₹ 774,477.12"
    },
    {
      business_activity: "Food, beverages and tobacco products",
      turnover_percentage: "18.67",
      turnover: "₹ 177,787.88"
    }
  ]);

  return (
    <div className={styles.mainWrapper}>
      {/* BUSINESS ACTIVITY SECTION */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Business Activity </h2>

        <div className={`${styles.businessActivityWrapper} ${layout === "column" ? styles.columnLayout : ""}`}>
          {loading || !businessActivity ? (
            <>
              <div className={styles.card}>
                <div className={styles.pieChartContainer}>
                  <div className={styles.pieWrapper}>
                    <div className={`${styles.skeleton} ${styles.skeletonCircle}`} />
                  </div>
                  <div className={styles.pieLegend}>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={styles.legendContainer}>
                        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '80%' }} />
                        {i < 3 && <div className={styles.legendDivider}></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <div className={styles.tableHeader}>
                  <div className={`${styles.skeleton} ${styles.skeletonHeader}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonHeader}`} />
                </div>
                <div className={styles.tableScroll}>
                  <table className={styles.activityTable}>
                    <thead>
                      <tr>
                        <th className={styles.textleft}>Business Activity</th>
                        <th className={styles.textCenter}>Turnover %</th>
                        <th className={styles.textRight}>Turnover (Cr)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(4)].map((_, i) => (
                        <tr key={i}>
                          <td><div className={`${styles.skeleton} ${styles.skeletonTableRow}`} /></td>
                          <td><div className={`${styles.skeleton} ${styles.skeletonTableRow}`} /></td>
                          <td><div className={`${styles.skeleton} ${styles.skeletonTableRow}`} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.card}>
                <div className={styles.pieChartContainer}>
                  <div className={styles.pieWrapper}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div style={{
                                  backgroundColor: "#fff",
                                  padding: "10px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}>
                                  <p style={{ margin: 0, fontWeight: "600", color: '#111827' }}>{payload[0].name}</p>
                                  <p style={{ margin: '4px 0 0', color: '#4B5563' }}>{payload[0].value.toFixed(2)}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={0}
                          outerRadius={110}
                          paddingAngle={0}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className={styles.pieLegend}>
                    {pieData.map((item, idx) => (
                      <div key={idx} className={styles.legendContainer}>
                        <div className={styles.legendRow}>
                          <div className={styles.legendIndicator}>
                            <div className={styles.dot} style={{ backgroundColor: item.color }}></div>
                            <span className={styles.legendText}>{item.name}</span>
                          </div>
                          <span className={styles.legendValue}>{item.value.toFixed(2)}%</span>
                        </div>
                        {idx < pieData.length - 1 && <div className={styles.legendDivider}></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <div className={styles.tableHeader}>
                  <div className={styles.headerLeft}>
                    Financial Year: <span className={styles.headerValue}>{businessActivity?.financial_year || "-"}</span>
                  </div>
                  <div className={styles.headerRight}>
                    Turnover: <span className={styles.greenText}>{businessActivity?.total_turnover ? businessActivity?.total_turnover + " Cr" : (businessActivity?.financial_year ? businessActivity?.financial_year : "-")}</span>
                  </div>
                </div>
                <div className={styles.tableScroll}>
                  <table className={styles.activityTable}>
                    <thead>
                      <tr>
                        <th className={styles.textleft}>Business Activity</th>
                        <th className={styles.textCenter}>Turnover %</th>
                        <th className={styles.textRight}>Turnover (Cr)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityTable.map((row, idx) => (
                        <tr key={idx}>
                          <td className={styles.textleft}>{row.business_activity}</td>
                          <td className={styles.textCenter}>{row.turnover_percentage}</td>
                          <td className={styles.textRight}>₹{row.turnover}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* PEER COMPARISON SECTION */}
      {peerComparisonData && (
        <section className={styles.section} style={{ marginTop: '24px' }}>
          <h2 className={styles.sectionTitle}>Peer Comparison</h2>
          <div className={styles.card} style={{ padding: '24px' }}>
            <div className={styles.barChartContainer}>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 50 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                    tick={<CustomXAxisTick />}
                    tickMargin={0}
                  />
                  <YAxis
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "rgba(55, 65, 81, 1)" }}
                    tickFormatter={(val) => `${val} ${peerComparisonData.peer_turnover_chart?.metric_unit || ""}`}
                    width={90}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <p style={{ margin: 0, fontWeight: "600", color: '#111827' }}>{payload[0].payload.name}</p>
                            <p style={{ margin: '4px 0 0', color: '#4B5563' }}>Turnover: {payload[0].value} {peerComparisonData.peer_turnover_chart?.metric_unit}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="rgba(59, 130, 246, 1)"
                    radius={[15, 15, 0, 0]}
                    barSize={32}
                  >
                    {barData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.is_selected ? 'rgba(59, 130, 246, 1)' : '#3B82F6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CompanyCharts;