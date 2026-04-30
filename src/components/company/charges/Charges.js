import styles from "./Charges.module.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import RowsPerPage from "@/components/common/RowsPerPage";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";
import { scrollToElementWithOffset } from "@/utils/scrollUtils";
import { formatDateToIST } from "@/utils/dateFormatter";


export default function ChargesPage({ charges, loading, error, openPage, closedPage, limit, setOpenPage, setClosedPage, setLimit }) {
  const { activeSubSection, scrollTrigger } = useCompanySection();
  const containerRef = useRef(null);
  const closedChargesRef = useRef(null);

  useEffect(() => {
    if (!activeSubSection) return;

    const scroll = (ref) => {
      if (ref?.current) {
        scrollToElementWithOffset(ref.current, 140);
      }
    };


    switch (activeSubSection) {
      case "Open Charges":
        scroll(containerRef);
        break;

      case "Closed Charges":
        scroll(closedChargesRef);
        break;

      default:
        break;
    }
  }, [activeSubSection, scrollTrigger]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Charges</h1>
          <div className={styles.headerInfo}>
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100px' }} />
            <div className={styles.infoDivider}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '150px' }} />
          </div>
        </div>

        <section className={styles.statsGrid}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`${styles.skeleton} ${styles.skeletonStatCard}`} />
          ))}
        </section>

        <section className={styles.chartAndSummary}>
          <div className={`${styles.skeleton} ${styles.skeletonChartCard}`} />
          <div className={`${styles.skeleton} ${styles.skeletonSummaryCard}`} />
        </section>

        <section className={styles.tableSection}>
          <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '200px', marginBottom: '20px' }} />
          <div className={`${styles.skeleton} ${styles.skeletonTable}`} />
        </section>

        <section className={styles.tableSection}>
          <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '200px', marginBottom: '20px' }} />
          <div className={`${styles.skeleton} ${styles.skeletonTable}`} />
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ color: "red" }}>{error}</div>
      </div>
    );
  }

  if (!charges) {
    return <div className={styles.container}>No data available</div>;
  }

  const closedCharges = [
    // {
    //   id: "100592955",
    //   lender: "Yes Bank Limited",
    //   amount: "5.00",
    //   created: "20 Jun 2022",
    //   modified: "-",
    //   satisfied: "27 Feb 2024",
    // },
    // {
    //   id: "100592956",
    //   lender: "HDFC Bank Limited",
    //   amount: "6.25",
    //   created: "15 Aug 2022",
    //   modified: "-",
    //   satisfied: "30 Dec 2024",
    // },
    // {
    //   id: "100592957",
    //   lender: "ICICI Bank Limited",
    //   amount: "4.50",
    //   created: "10 Sep 2022",
    //   modified: "-",
    //   satisfied: "15 Mar 2025",
    // },
    // {
    //   id: "100592958",
    //   lender: "State Bank of India",
    //   amount: "5.75",
    //   created: "25 Oct 2022",
    //   modified: "-",
    //   satisfied: "01 Jan 2025",
    // },
    // {
    //   id: "100592959",
    //   lender: "Kotak Mahindra Bank",
    //   amount: "6.00",
    //   created: "12 Nov 2022",
    //   modified: "-",
    //   satisfied: "10 Jul 2024",
    // },
    // {
    //   id: "100592960",
    //   lender: "Axis Bank Limited",
    //   amount: "5.50",
    //   created: "18 Dec 2022",
    //   modified: "-",
    //   satisfied: "22 Aug 2024",
    // },
    // {
    //   id: "100592961",
    //   lender: "Punjab National Bank",
    //   amount: "4.75",
    //   created: "30 Jan 2023",
    //   modified: "-",
    //   satisfied: "05 Sep 2024",
    // },
    // {
    //   id: "100592962",
    //   lender: "Bank of Baroda",
    //   amount: "5.10",
    //   created: "14 Feb 2023",
    //   modified: "-",
    //   satisfied: "13 Oct 2025",
    // },
    // {
    //   id: "100592963",
    //   lender: "Union Bank of India",
    //   amount: "5.30",
    //   created: "20 Mar 2023",
    //   modified: "-",
    //   satisfied: "28 Nov 2024",
    // },
    // {
    //   id: "100592964",
    //   lender: "Canara Bank",
    //   amount: "6.00",
    //   created: "05 Apr 2023",
    //   modified: "-",
    //   satisfied: "19 Jun 2025",
    // },
  ];
  const openChargesData = [
    { name: "Others", value: 158 },
    { name: "Remaining", value: 165 - 158 },
  ];

  const openItems = charges?.open_charges?.items || [];
  const closedItems = charges?.closed_charges?.items || [];


  const COLORS = ["#0EA5E9", "rgba(244, 244, 245, 1)"];

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const parseAmount = (amt) => {
    if (!amt || amt === "-") return 0;
    return parseFloat(String(amt).replace(/,/g, "")) || 0;
  };

  const openAmt = parseAmount(charges?.summary?.open_amount);
  const closedAmt = parseAmount(charges?.summary?.closed_amount);
  const totalAmt = openAmt + closedAmt;

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const openChartData = [
    {
      name: "Open",
      value: openAmt,
    },
    {
      name: "Closed",
      value: closedAmt,
    },
  ];


  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Charges</h1>
        <div className={styles.headerInfo}>
          <span className={styles.infoGroup}>
            <span className={styles.infoLabel}>Source:</span>
            <span className={styles.infoValue}>{charges?.source || "-"}</span>
          </span>
          <span className={styles.infoDivider}></span>
          <span className={styles.infoGroup}>
            <span className={styles.infoLabel}>Last Updated:</span>
            <span className={styles.infoValue}>{formatDateToIST(charges?.last_updated) || "-"}</span>
          </span>
        </div>
      </div>

      <section className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <div className={styles.statLabel}>Open Charges</div>
          <div className={styles.statValue}>{charges?.summary?.open_count ?? "-"}</div>
        </div>
        <div className={`${styles.statCard} ${styles.red}`}>
          <div className={styles.statLabel}>Open Charges Amount</div>
          <div className={styles.statValue}>{charges?.summary?.open_amount ?? "-"}</div>
        </div>
        <div className={`${styles.statCard} ${styles.purple}`}>
          <div className={styles.statLabel}>Closed Charges</div>
          <div className={styles.statValue}>{charges?.summary?.closed_count ?? "-"}</div>
        </div>
        <div className={`${styles.statCard} ${styles.green}`}>
          <div className={styles.statLabel}>Closed Charges Amount</div>
          <div className={styles.statValue}>{charges?.summary?.closed_amount ?? "-"}</div>
        </div>
      </section>

      <section className={styles.chartAndSummary}>
        <div className={styles.chartCard}>
          <h2 className={styles.cardTitle}>Open charges</h2>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Tooltip
                  formatter={(value, name) => {
                    const total = openChartData.reduce((acc, curr) => acc + curr.value, 0);
                    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return [`${value} Cr (${percent}%)`, name];
                  }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E4E4E7', fontSize: '12px' }}
                />
                <Pie
                  data={openChartData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {openChartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: COLORS[0] }}></div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
                  <span className={styles.legendText}>Open Charges:</span>
                  <span className={styles.legendValue}>{charges?.summary?.open_amount ?? "-"}</span>
                </div>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: COLORS[1] }}></div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
                  <span className={styles.legendText}>Closed Charges:</span>
                  <span className={styles.legendValue}>{charges?.summary?.closed_amount ?? "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryCardAlt}`}>
          <div className={styles.summaryRow}>
            <span>Total Open Charges</span>
            <p className={styles.strong}>{charges?.statistics?.total_open_amount || "-"}</p>
          </div>
          <div className={styles.summaryRow}>
            <span>Total Satised Charges</span>
            <p className={styles.strong}>{charges?.statistics?.total_satisfied_amount ?? "-"}</p>
          </div>
          <div className={styles.summaryRow}>
            <span>Total No. of Lender(s)</span>
            <p className={styles.strong}>{charges?.statistics?.total_lenders ?? "-"}</p>
          </div>
          <div className={styles.summaryRow}>
            <span>Top Lender</span>
            <p className={styles.strong}>{charges?.statistics?.top_lender ?? "-"}</p>
          </div>
          <div className={styles.summaryRow}>
            <span>Last Charge Activity</span>
            <p className={styles.strong}>{charges?.statistics?.last_charge_activity ?? "-"}</p>
          </div>
          <div className={styles.summaryRow}>
            <span>Last Charge Date</span>
            <p className={styles.strong}>{charges?.statistics?.last_charge_date ?? "-"}</p>
          </div>
          <div className={styles.summaryRow}>
            <span>Last Charge Amount</span>
            <p className={styles.strong}>{charges?.statistics?.last_charge_amount ?? "-"}</p>
          </div>
        </div>

      </section>

      <section
        className={`${styles.tableSection} ${styles.openChargesSection}`}
        id="Open Charges"
      >
        <h2 className={styles.sectionTitle}>Open Charges</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Charge ID</th>
                <th>Lender</th>
                <th>Amount (Cr.)</th>
                <th>Creation Date</th>
                <th>Modication Date</th>
              </tr>
            </thead>
            <tbody>
              {openItems.length > 0 ? (
                openItems.map((item) => (
                  <tr key={item.charge_id}>
                    <td>{item.charge_id}</td>
                    <td>{item.lender}</td>
                    <td>{item.amount_cr}</td>
                    <td>{item.creation_date}</td>
                    <td>{item.modification_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No open charges found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.paginationRow}>
          <span className={styles.showingText}>
            Showing {(openPage - 1) * limit + 1}-
            {Math.min(openPage * limit, charges?.open_charges?.total || 0)} of{" "}
            {charges?.open_charges?.total || 0}
          </span>
          <div className={styles.paginationControls}>
            <div className={styles.paginationInfo}>
              <span className={styles.rowsLabel}>Rows per page</span>
              <RowsPerPage value={limit}
                onChange={(value) => {
                  setLimit(value);
                  setClosedPage(1);
                  setOpenPage(1);
                }} />
            </div>
            <span className={styles.pageLabel}>
              Page {openPage} of{" "}
              {charges?.open_charges?.pages || 1}
            </span>
            <div className={styles.navButtons}>
              <button
                className={openPage === 1 ? styles.navBtnDisabled : styles.navBtn}
                disabled={openPage === 1}
                onClick={() => setOpenPage(1)}
              >
                <img
                  src="/icons/chevrons-left.svg"
                  alt="First page"
                  className={styles.navIcon}
                />
              </button>

              <button
                className={openPage === 1 ? styles.navBtnDisabled : styles.navBtn}
                disabled={openPage === 1}
                onClick={() => setOpenPage(prev => prev - 1)}
              >
                <img
                  src="/icons/chevron-left.svg"
                  alt="Previous page"
                  className={styles.navIcon}
                />
              </button>
              <button
                className={openPage >= (charges?.open_charges?.pages || 1) ? styles.navBtnDisabled : styles.navBtn}
                disabled={openPage >= (charges?.open_charges?.pages || 1)}
                onClick={() => setOpenPage((prev) => prev + 1)}
              >
                <img
                  src="/icons/chevron-right.svg"
                  alt="Next page"
                  className={styles.navIcon}
                />
              </button>
              <button
                className={openPage >= (charges?.open_charges?.pages || 1) ? styles.navBtnDisabled : styles.navBtn}
                disabled={openPage >= (charges?.open_charges?.pages || 1)}
                onClick={() => setOpenPage(charges?.open_charges?.pages || 1)}
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
      </section>

      <section ref={closedChargesRef} className={styles.tableSection} id="Closed Charges">
        <h2 className={styles.sectionTitle}>Closed Charges</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Charge ID</th>
                <th>Lender</th>
                <th>Amount (Cr.)</th>
                <th>Creation Date</th>
                <th>Modication Date</th>
                <th>Satisfaction Date</th>
                {/* <th></th> */}
              </tr>
            </thead>
            <tbody>
              {closedItems.map((item) => (
                <tr key={item.charge_id}>
                  <td>{item.charge_id}</td>
                  <td>{item.lender}</td>
                  <td>{item.amount_cr}</td>
                  <td>{item.creation_date}</td>
                  <td>{item.modification_date}</td>
                  <td>{item.satisfaction_date}</td>
                  {/* <td className={styles.actionCell}>
                    <div className={styles.actionIcon}>
                      <img
                        src="/icons/eye.svg"
                        alt="View"
                        width="20"
                        height="20"
                      />
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.paginationRow}>
          <span className={styles.showingText}>
            Showing {(closedPage - 1) * limit + 1}-
            {Math.min(closedPage * limit, charges?.closed_charges?.total || 0)} of{" "}
            {charges?.closed_charges?.total || 0}
          </span>
          <div className={styles.paginationControls}>
            <div className={styles.paginationInfo}>
              <span className={styles.rowsLabel}>Rows per page</span>
              <RowsPerPage value={limit}
                onChange={(value) => {
                  setLimit(value);
                  setClosedPage(1);
                  setOpenPage(1);
                }} />
            </div>
            <span className={styles.pageLabel}>
              Page {closedPage} of{" "}
              {charges?.closed_charges?.pages || 1}
            </span>
            <div className={styles.navButtons}>
              <button
                className={closedPage === 1 ? styles.navBtnDisabled : styles.navBtn}
                disabled={closedPage === 1}
                onClick={() => setClosedPage(1)}
              >
                <img
                  src="/icons/chevrons-left.svg"
                  alt="First page"
                  className={styles.navIcon}
                />
              </button>

              <button
                className={closedPage === 1 ? styles.navBtnDisabled : styles.navBtn}
                disabled={closedPage === 1}
                onClick={() => setClosedPage((prev) => prev - 1)}
              >
                <img
                  src="/icons/chevron-left.svg"
                  alt="Previous page"
                  className={styles.navIcon}
                />
              </button>
              <button
                className={closedPage >= (charges?.closed_charges?.pages || 1) ? styles.navBtnDisabled : styles.navBtn}
                disabled={closedPage >= (charges?.closed_charges?.pages || 1)}
                onClick={() => setClosedPage((prev) => prev + 1)}
              >
                <img
                  src="/icons/chevron-right.svg"
                  alt="Next page"
                  className={styles.navIcon}
                />
              </button>
              <button
                className={closedPage >= (charges?.closed_charges?.pages || 1) ? styles.navBtnDisabled : styles.navBtn}
                disabled={closedPage >= (charges?.closed_charges?.pages || 1)}
                onClick={() => setClosedPage(charges?.closed_charges?.pages || 1)}
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
      </section >
    </div >
  );
}
