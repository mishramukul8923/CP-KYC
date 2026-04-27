"use client";

import { useState } from "react";
import styles from "./AlertOverview.module.css";
import RowsPerPage from "@/components/common/RowsPerPage";

export default function AlertsOverview({ alertsData, alertsLoading, alertsError }) {

  if (alertsError) {
    return (
      <div className={styles.container}>
        <div style={{ color: "red", fontWeight: 500 }}>
          {alertsError}
        </div>
      </div>
    );
  }

  if (alertsLoading || !alertsData) {
    return (
      <div className={styles.container}>
        <div className={styles.cards}>
          <div className={`${styles.skeleton} ${styles.skeletonCard}`} />
          <div className={`${styles.skeleton} ${styles.skeletonCard}`} />
          <div className={`${styles.skeleton} ${styles.skeletonCard}`} />
        </div>
        <div className={styles.list}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`${styles.skeleton} ${styles.skeletonAccordion}`} />
          ))}
        </div>
      </div>
    );
  }

  const regulatoryAlerts = alertsData?.regulatory_alerts || [];
  const flaggedAuthorities = alertsData?.flagged_by_authorities || [];

  const regulatorySummary = alertsData?.summary?.regulatory || {
    high: 0,
    medium: 0,
    low: 0,
    total: 0
  };

  const regulatoryRows = regulatoryAlerts.map((item) => ({
    reg: item.regulator ?? "-",
    ent: item.entity ?? "-",
    chg: item.regulatory_charges ?? "-",
    act: item.regulatory_action ?? "-",
    dev: item.further_developments ?? "-",
    src: item.source ?? "-",
    sev: item.severity ?? "-",
    action: true
  }));

  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const [activeSidebarIndex, setActiveSidebarIndex] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0); // 0 = Company, 1 = Director

  const [rowsPerPage, setRowsPerPage] = useState(10);

  /**
   * DATA CONFIGURATION
   */
  const alertData = [
    {
      id: "statutory",
      label: "Statutory Compliance",
      red: "-",
      orange: "-",
      yellow: "-",
      blue: "-",
      total: "-",
      type: "table",
      headers: [
        "Compliance Area",
        "Description",
        "Authority",
        "Effective Date",
        "Severity",
        "Status",
        "",
      ],
      rows: [
        // {
        //   area: "GST Registration",
        //   desc: "Registration cancelled due to non-filing of return",
        //   auth: "GST Council",
        //   date: "15 Mar 2024",
        //   sev: "High",
        //   status: "Cancelled",
        //   action: true,
        // },
        // {
        //   area: "EPFO Compliance",
        //   desc: "Establishment default in PF, pension & admin cor",
        //   auth: "EPFO",
        //   date: "25 Sep 2023",
        //   sev: "High",
        //   status: "Active Default",
        //   action: true,
        // },
      ],
    },
    {
      id: "regulatory",
      label: "Regulatory Alerts",
      red: regulatorySummary.high ?? "-",
      orange: regulatorySummary.medium ?? "-",
      yellow: regulatorySummary.low ?? "-",
      blue: "-",
      total: regulatorySummary.total ?? "-",
      type: "table",
      headers: [
        "Regulator",
        "Entity",
        "Regulatory Charges",
        "Regulatory Action",
        "Further Developments",
        "Source",
        "Severity",
        ""
      ],
      rows: regulatoryRows
    },
    {
      id: "bureau",
      label: "Suit Filed by Bureau",
      red: "-",
      orange: "-",
      yellow: "-",
      blue: "-",
      total: "-",
      type: "empty",
      message: "No bureau cases found as per available records.",
    },
    {
      id: "litigation",
      label: "Litigations",
      red: "-",
      orange: "-",
      yellow: "-",
      blue: "-",
      total: "-",
      type: "litigation",
      summary: [
        {
          label: "Cases Filed By Company",
          val: "- ",
          style: styles.litCardBlue,
        },
        {
          label: "Cases Filed Against Company",
          val: "- ",
          style: styles.litCardRed,
        },
        { label: "Pending Cases", val: "-", style: styles.litCardOrange },
      ],
      table1: {
        headers: [
          "Court Type",
          "Cases Filed By",
          "Cases Against",
          "Pending",
          "Total",
        ],
        rows: [
          {
            type: "District Court",
            by: "-",
            ag: "-",
            pen: "-",
            tot: "-",
          },
          { type: "High Court", by: "-", ag: "-", pen: "-", tot: "-" },
          { type: "Supreme Court", by: "-", ag: "-", pen: "-", tot: "-" },
          { type: "NCLT", by: "-", ag: "-", pen: "-", tot: "-" },
          { type: "DRT", by: "-", ag: "-", pen: "-", tot: "-" },
        ],
      },
      table2: {
        headers: [
          "Court Type",
          "Case Type",
          "Filed By",
          "Filed Against",
          "Pending Count",
          "Total Count",
          "Severity",
        ],
        rows: [
          // {
          //   type: "Supreme Court",
          //   cType: "Tax Dispute",
          //   by: "Tax Dispute",
          //   ag: "Dabur India Limited",
          //   pen: "1",
          //   tot: "1",
          //   sev: "High",
          // },
          // {
          //   type: "High Court Delhi",
          //   cType: "Product Liability",
          //   by: "Consumer Forum",
          //   ag: "Dabur India Limited",
          //   pen: "15",
          //   tot: "28",
          //   sev: "Medium",
          // },
          // {
          //   type: "District Court Mumbai",
          //   cType: "Contract Dispute",
          //   by: "Dabur India Limited",
          //   ag: "Vendor XYZ Pvt Ltd",
          //   pen: "3",
          //   tot: "5",
          //   sev: "Medium",
          // },
        ],
      },
    },
    {
      id: "auditors",
      label: "Auditors",
      red: "-",
      orange: "-",
      yellow: "-",
      blue: "-",
      total: "-",
      type: "table",
      headers: [
        "Auditor Name",
        "Appointment Date",
        "Tenure",
        "Remarks",
        "Status",
        "Severity",
      ],
      rows: [
        // {
        //   name: "B S R & Co. LLP",
        //   date: "15 Sep 2020",
        //   tenure: "3 years",
        //   rem: "Resigned citing disagreement...",
        //   stat: "Resigned",
        //   sev: "High",
        // },
      ],
    },
    {
      id: "credit",
      label: "Credit Rating",
      red: "-",
      orange: "-",
      yellow: "-",
      blue: "-",
      total: "-",
      type: "table",
      headers: [
        "Rating Agency",
        "Credit Rating",
        "Outlook",
        "Valid From",
        "Valid Till",
        "Status",
        "Severity",
      ],
      rows: [
        // {
        //   agency: "CRISIL",
        //   rate: "AA-",
        //   outlook: "Negative",
        //   from: "15 Nov 2024",
        //   till: "14 Nov 2025",
        //   stat: "Active",
        //   sev: "High",
        // },
        // {
        //   agency: "ICRA",
        //   rate: "A+",
        //   outlook: "Stable",
        //   from: "20 Oct 2024",
        //   till: "19 Oct 2025",
        //   stat: "Active",
        //   sev: "Low",
        // },
      ],
    },
    {
      id: "group",
      label: "Group Companies",
      red: "-",
      orange: "-",
      yellow: "-",
      blue: "-",
      total: "-",
      type: "table",
      headers: [
        "Company Name",
        "CIN",
        "Relationship Type",
        "Alerts Present",
        "Status",
        "Severity",
      ],
      rows: [
        // {
        //   name: "Dabur International Ltd.",
        //   cin: "U24100MH1979PLC021377",
        //   rel: "Subsidiary",
        //   alert: "Yes (5 alerts)",
        //   stat: "Active",
        //   sev: "High",
        // },
        // {
        //   name: "Dermoviva Skin Essentials Inc.",
        //   cin: "U24239DL1993PTC053825",
        //   rel: "Affiliate",
        //   alert: "Yes (2 alerts)",
        //   stat: "Active",
        //   sev: "Low",
        // },
      ],
    },
    {
      id: "common",
      label: "Common Directorship Companies",
      red: "-",
      orange: "-",
      yellow: "-",
      blue: "-",
      total: "-",
      type: "sidebar",

      sidebarItems: [
        { label: "Regulatory Alerts", count: "-", active: true },
        { label: "Suit Filed by Bureau", count: "-" },
        { label: "Credit Rating", count: "-" },
        { label: "Litigation", count: "-" },
      ],

      tabs: [
        { label: "Company", count: "-", red: true, active: true },
        { label: "Director", count: "-", red: true },
      ],

      /* =======================
     COMPANY TAB DATA
     ======================= */
      headers: [
        "Regulator",
        "Company Name",
        "Administrative Charges",
        "Administrative Action",
        "Advancement",
      ],

      rows: Array(10).fill({
        reg: "-",
        regIcon: "/icons/Image.svg",
        name: "-",
        companyIcon: "/icons/Image.svg",
        subText: "-",
        chg: "-",
        act: "-",
        adv: "-",
      }),

      /* =======================
     DIRECTOR TAB DATA
     ======================= */
      directorHeaders: [
        "Person",
        "Company",
        "Regulator",
        "Administrative Charges",
        "Administrative Action",
        "Advancement",
      ],

      directorRows: Array(10).fill({
        personName: "-",
        personSub: "-",
        personIcon: "/icons/profile-icon.svg",

        companyName: "-",
        companySub: "-",
        companyIcon: "/icons/Image.svg",

        reg: "-",
        regIcon: "/icons/Image.svg",

        chg: "-",
        act: "-",
        adv: "-",
      }),
    },

    {
      id: "media",
      label: "Adverse / Negative Media",
      red: "-",
      orange: "-",
      yellow: "-",
      blue: "-",
      total: "-",
      type: "table",
      headers: ["Media Source", "Headline / Summary", "Sentiment", "Date", ""],
      rows: [
        // {
        //   src: "Economic Times",
        //   head: "Product quality concerns raised by consumer groups",
        //   sent: "Negative",
        //   date: "15 Dec 2025",
        //   action: true,
        // },
        // {
        //   src: "The Hindu",
        //   head: "Company faces legal challenges in multiple jurisdictions",
        //   sent: "Negative",
        //   date: "10 Jan 2026",
        //   action: true,
        // },
        // {
        //   src: "Business Standard",
        //   head: "Regulatory scrutiny intensifies over financial irregularities",
        //   sent: "Negative",
        //   date: "05 Jan 2026",
        //   action: true,
        // },
      ],
    },
    {
      id: "banking",
      label: "Banking & Credit Defaults",
      red: "-",
      orange: "-",
      yellow: "-",
      blue: "-",
      total: "-",
      type: "table",
      headers: [
        "Bank Name",
        "Entity",
        "Nature of Default",
        "Action Taken",
        "Date",
        "Status",
        "Severity",
      ],
      rows: [
        // {
        //   bank: "State Bank of India",
        //   ent: "Dabur India Limited",
        //   nature: "Loan repayment default",
        //   act: "Marked as NPA",
        //   date: "15 Nov 2025",
        //   stat: "Under Investigation",
        //   sev: "High",
        // },
        // {
        //   bank: "Axis Bank",
        //   ent: "Dabur India Limited",
        //   nature: "Credit card default",
        //   act: "Account suspended",
        //   date: "10 Jan 2026",
        //   stat: "Resolved",
        //   sev: "Medium",
        // },
      ],
    },
  ];

  /**
   * HELPERS: Render dynamic UI elements based on string values
   */
  const renderBadge = (val, tableId) => {
    if (val === "High")
      return (
        <span className={styles.badgeHigh}>
          <span className={styles.dotRedSmall}></span> High
        </span>
      );
    if (val === "Medium")
      return (
        <span className={styles.badgeMedium}>
          <span className={styles.dotOrangeSmall}></span> Medium
        </span>
      );
    if (val === "Low")
      return (
        <span className={styles.badgeLow}>
          <span className={styles.dotYellowSmall}></span> Low
        </span>
      );
    if (val === "Cancelled")
      return <span className={styles.statusCancelled}>{val}</span>;

    if (tableId === "media" && val === "Negative")
      return <span className={styles.statusCancelled}>{val}</span>;

    if (val === "Active" || val === "Active Default")
      return <span className={styles.statusActive}>{val}</span>;
    if (val === "Not Available")
      return <span className={styles.mutedItalic}>{val}</span>;
    return val;
  };

  return (
    <div className={styles.container}>
      {/* Top Cards Section */}
      <div className={styles.cards}>
        <div className={styles.warningCard}>
          <div className={styles.cardHeader}>
            <div className={styles.warningIconWrapper}>
              <img
                src="/icons/warning-icon.svg"
                alt=""
                width="20"
                height="20"
              />
            </div>
            <h4 className={styles.cardTitle}>Flagged by Authorites</h4>
          </div>
          <div className={styles.badgeContainer}>
            {flaggedAuthorities.map((auth, index) => (
              <div key={index} className={styles.badge}>
                <img
                  src="/icons/alert-triangle.svg"
                  alt=""
                  width="16"
                  height="16"
                />
                {auth}
              </div>
            ))}
          </div>
          <span className={styles.cardDescription}>
            {flaggedAuthorities.length} regulatory authorities have flagged this company
          </span>
        </div>
        <div className={styles.successCard}>
          <div className={styles.cardHeader}>
            <div className={styles.scaleIconWrapper}>
              <img src="/icons/scale-icon.svg" alt="" width="20" height="20" />
            </div>
            <h4 className={styles.cardTitle}>Bureau Cases</h4>
          </div>
          <div className={styles.successValueContainer}>
            <img src="/icons/check-circle.svg" alt="" width="24" height="24" />
            <span className={styles.successText}>
              No bureau cases found as per our records
            </span>
          </div>
          <span className={styles.cardDescription}>
            Last verified: 05 Jan 2025
          </span>
        </div>
      </div>

      {/* Accordion List */}
      <div className={styles.list}>
        {alertData.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.rowContainer} ${expandedRow === index ? styles.expanded : ""}`}
          >
            <div
              className={styles.row}
              onClick={() => toggleRow(index)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.leftSection}>
                <img
                  src="/icons/chevron-right2.svg"
                  alt=""
                  width="24"
                  height="24"
                  className={`${styles.chevron} ${expandedRow === index ? styles.chevronOpen : ""
                    }`}
                />

                <span className={styles.label}>{item.label}</span>
              </div>
              <div className={styles.rightSection}>
                <div className={styles.statusIndicators}>
                  <div className={styles.indicator}>
                    <div className={`${styles.dot} ${styles.dotRed}`}></div>
                    {item.red}
                  </div>
                  <div className={styles.indicator}>
                    <div className={`${styles.dot} ${styles.dotOrange}`}></div>
                    {item.orange}
                  </div>
                  <div className={styles.indicator}>
                    <div className={`${styles.dot} ${styles.dotYellow}`}></div>
                    {item.yellow}
                  </div>
                  <div className={styles.indicator}>
                    <div className={`${styles.dot} ${styles.dotBlue}`}></div>
                    {item.blue}
                  </div>
                </div>
                <span className={styles.count}>({item.total} alerts)</span>
              </div>
            </div>

            {expandedRow === index && (
              <div className={styles.details}>
                <div className={styles.detailsInner}>
                  {/* Condition 1: Basic Tables */}
                  {item.type === "table" && (
                    <div className={styles.tableWrapper}>
                      <table className={styles.detailTable}>
                        <thead>
                          <tr>
                            {item.headers.map((h, i) => (
                              <th key={i}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {Object.entries(row).map(([key, val], cIdx) => (
                                <td key={cIdx}>
                                  {key === "action" ? (
                                    <div className={styles.actionIcon}>
                                      <img
                                        src="/icons/eye.svg"
                                        alt="view"
                                        width="20"
                                        height="20"
                                      />
                                    </div>
                                  ) : (
                                    renderBadge(val, item.id)
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Condition 2: Empty State */}
                  {item.type === "empty" && (
                    <div className={styles.emptyStateContainer}>
                      <span className={styles.mutedItalic}>{item.message}</span>
                    </div>
                  )}

                  {/* Condition 3: Litigation Specific Layout */}
                  {item.type === "litigation" && (
                    <div className={styles.litigationWrapper}>
                      <div className={styles.litigationCards}>
                        {item.summary.map((s, i) => (
                          <div key={i} className={s.style}>
                            <span className={styles.litLabel}>{s.label}</span>
                            <span className={styles.litValue}>{s.val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Table 1: Summary by Court Type */}
                      <div className={styles.tableWrapper}>
                        <table className={styles.detailTable}>
                          <thead>
                            <tr>
                              {item.table1.headers.map((h, i) => (
                                <th key={i}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {item.table1.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td>{row.type}</td>
                                <td>{row.by}</td>
                                <td>{row.ag}</td>
                                <td>
                                  <span className={styles.textOrange}>
                                    {row.pen}
                                  </span>
                                </td>
                                <td>{row.tot}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <h5 className={styles.subHeading}>
                        Detailed Litigation Cases
                      </h5>

                      {/* Table 2: Detailed Cases */}
                      <div className={styles.tableWrapper}>
                        <table className={styles.detailTable}>
                          <thead>
                            <tr>
                              {item.table2.headers.map((h, i) => (
                                <th key={i}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {item.table2.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td>{row.type}</td>
                                <td>{row.cType}</td>
                                <td>{row.by}</td>
                                <td>{row.ag}</td>
                                <td>
                                  <span className={styles.textOrange}>
                                    {row.pen}
                                  </span>
                                </td>
                                <td>{row.tot}</td>
                                <td>{renderBadge(row.sev)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Pagination Footer based on image data */}
                      <div className={styles.paginationRow}>
                        <span className={styles.showingText}>
                          Showing 1-10 of 20
                        </span>
                        <div className={styles.paginationControls}>
                          <div className={styles.paginationInfo}>
                            <span className={styles.rowsLabel}>
                              Rows per page
                            </span>
                            <RowsPerPage
                              openTop={true}
                              value={rowsPerPage}
                              onChange={setRowsPerPage}
                            />
                          </div>

                          <span className={styles.pageLabel}>Page 1 of 10</span>
                          <div className={styles.navButtons}>
                            <button className={styles.navBtnDisabled}>
                              <img
                                src="/icons/chevrons-left.svg"
                                alt="First page"
                                className={styles.navIcon}
                              />
                            </button>
                            <button className={styles.navBtnDisabled}>
                              <img
                                src="/icons/chevron-left.svg"
                                alt="First page"
                                className={styles.navIcon}
                              />
                            </button>
                            <button className={styles.navBtn}>
                              <img
                                src="/icons/chevron-right-black.svg"
                                alt="First page"
                                className={styles.navIcon}
                              />
                            </button>
                            <button className={styles.navBtn}>
                              <img
                                src="/icons/chevrons-right.svg"
                                alt="First page"
                                className={styles.navIcon}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Condition 4: Sidebar / Common Directorship */}
                  {item.type === "sidebar" && (
                    <div className={styles.commonDirectorshipWrapper}>
                      {/* LEFT SIDEBAR */}
                      <div className={styles.sidebar}>
                        <span className={styles.sidebarTitle}>Categories</span>

                        {item.sidebarItems.map((s, i) => (
                          <div
                            key={i}
                            className={`${styles.sideItem} ${activeSidebarIndex === i ? styles.activeItem : ""
                              }`}
                            onClick={() => setActiveSidebarIndex(i)}
                          >
                            <div className={styles.sideLabelGroup}>
                              <span className={styles.dotRedSmall}></span>
                              {s.label}
                            </div>

                            <div className={styles.sideCountWrapper}>
                              <span className={styles.sideCount}>
                                {s.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* RIGHT CONTENT */}
                      <div className={styles.mainContent}>
                        {/* Tabs */}
                        <div className={styles.tabs}>
                          {item.tabs.map((t, i) => (
                            <span
                              key={i}
                              className={`${styles.tabItem} ${activeTabIndex === i ? styles.activeTab : ""
                                }`}
                              onClick={() => setActiveTabIndex(i)}
                            >
                              {t.label}
                              {t.red && (
                                <span className={styles.statusDotRed}></span>
                              )}
                              <span className={styles.tabBadgeGray}>
                                {t.count}
                              </span>
                            </span>
                          ))}
                        </div>

                        {/* ================= COMPANY TAB ================= */}
                        {activeTabIndex === 0 && (
                          <>
                            <div className={styles.regulatoryFilterText}>
                              Companies named in any violations or offence
                            </div>

                            <div className={styles.regulatoryTags}>
                              {[
                                "EPFO (9)",
                                "BSE (10)",
                                "CDSL (5)",
                                "NSDL (4)",
                                "SEBI (8)",
                                "BANKS (1)",
                                "MSEI (1)",
                                "NSE (1)",
                                "DRT (1)",
                                "DSE (2)",
                                "NCLT (2)",
                                "NHB (6)",
                                "CLB (1)",
                                "IRDA (26)",
                                "RBI (1)",
                                "FIU (1)",
                              ].map((tag, i) => (
                                <span key={i} className={styles.regTag}>
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className={styles.tableWrapper}>
                              <table
                                className={`${styles.detailTable} ${styles.customDetailTable}`}
                              >
                                <thead>
                                  <tr>
                                    {item.headers.map((h, i) => (
                                      <th key={i}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.rows.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      <td className={styles.regCell}>
                                        <div className={styles.regCellInner}>
                                          <div
                                            className={styles.regLogoContainer}
                                          >
                                            <img
                                              src={row.regIcon}
                                              alt={row.reg}
                                              className={styles.regLogo}
                                            />
                                          </div>
                                          <span>{row.reg}</span>
                                        </div>
                                      </td>

                                      <td>
                                        <div className={styles.companyNameCell}>
                                          <div className={styles.entityWrapper}>
                                            <img
                                              src={row.companyIcon}
                                              alt="entity"
                                              className={styles.entityIcon}
                                            />

                                            <div className={styles.nameGroup}>
                                              <div
                                                className={
                                                  styles.companyNameMain
                                                }
                                              >
                                                {row.name}
                                              </div>
                                            </div>
                                          </div>

                                          {row.subText && (
                                            <div
                                              className={styles.companySubText}
                                            >
                                              {(() => {
                                                const [label, value] =
                                                  row.subText.split(":");
                                                return (
                                                  <>
                                                    <span
                                                      className={
                                                        styles.subLabel
                                                      }
                                                    >
                                                      {label}:
                                                    </span>
                                                    <span
                                                      className={
                                                        styles.subValue
                                                      }
                                                    >
                                                      {value}
                                                    </span>
                                                  </>
                                                );
                                              })()}
                                            </div>
                                          )}
                                        </div>
                                      </td>

                                      <td className={styles.chgCell}>
                                        {row.chg}
                                      </td>
                                      <td className={styles.actionCell}>
                                        {row.act}
                                      </td>
                                      <td className={styles.advCell}>
                                        {(() => {
                                          const match = row.adv.match(
                                            /(.*?)(\d{2}\s[A-Za-z]{3}\s\d{4})$/,
                                          );

                                          if (!match) return row.adv;

                                          return (
                                            <>
                                              <div className={styles.advText}>
                                                {match[1].trim()}
                                              </div>
                                              <div className={styles.advDate}>
                                                {match[2]}
                                              </div>
                                            </>
                                          );
                                        })()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {/* Pagination Footer based on image data */}
                            <div
                              className={`${styles.paginationRow} ${styles.paginationRowExtra}`}
                            >
                              <span className={styles.showingText}>
                                Showing 1-10 of 20
                              </span>
                              <div className={styles.paginationControls}>
                                <div className={styles.paginationInfo}>
                                  <span className={styles.rowsLabel}>
                                    Rows per page
                                  </span>
                                  <RowsPerPage
                                    openTop={true}
                                    value={rowsPerPage}
                                    onChange={setRowsPerPage}
                                  />
                                </div>

                                <span className={styles.pageLabel}>
                                  Page 1 of 10
                                </span>
                                <div className={styles.navButtons}>
                                  <button className={styles.navBtnDisabled}>
                                    <img
                                      src="/icons/chevrons-left.svg"
                                      alt="First page"
                                      className={styles.navIcon}
                                    />
                                  </button>
                                  <button className={styles.navBtnDisabled}>
                                    <img
                                      src="/icons/chevron-left.svg"
                                      alt="First page"
                                      className={styles.navIcon}
                                    />
                                  </button>
                                  <button className={styles.navBtn}>
                                    <img
                                      src="/icons/chevron-right-black.svg"
                                      alt="First page"
                                      className={styles.navIcon}
                                    />
                                  </button>
                                  <button className={styles.navBtn}>
                                    <img
                                      src="/icons/chevrons-right.svg"
                                      alt="First page"
                                      className={styles.navIcon}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* ================= DIRECTOR TAB ================= */}
                        {activeTabIndex === 1 && (
                          <>
                            <div className={styles.regulatoryFilterText}>
                              Directors named in any violations or offence
                            </div>

                            <div className={styles.regulatoryTags}>
                              {[
                                "MCA (37)",
                                "SEBI (16)",
                                "Banks (6)",
                                "BSL (2)",
                                "DRT (2)",
                              ].map((tag, i) => (
                                <span key={i} className={styles.regTag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className={styles.tableWrapper}>
                              <table className={styles.detailTable}>
                                <thead>
                                  <tr>
                                    {item.directorHeaders.map((h, i) => (
                                      <th key={i}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.directorRows.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      {/* Person Column */}
                                      <td>
                                        <div className={styles.companyNameCell}>
                                          <div className={styles.entityWrapper}>
                                            <img
                                              src={row.personIcon}
                                              alt=""
                                              className={styles.avatarIcon}
                                            />
                                            <div className={styles.nameGroup}>
                                              <div
                                                className={
                                                  styles.companyNameMain
                                                }
                                              >
                                                {row.personName}
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            className={styles.companySubText}
                                          >
                                            {row.personSub}
                                          </div>
                                        </div>
                                      </td>
                                      {/* Company Column */}
                                      <td>
                                        <div className={styles.companyNameCell}>
                                          <div className={styles.entityWrapper}>
                                            <img
                                              src={row.companyIcon}
                                              alt=""
                                              className={styles.entityIcon}
                                            />
                                            <div className={styles.nameGroup}>
                                              <div
                                                className={
                                                  styles.companyNameMain
                                                }
                                              >
                                                {row.companyName}
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            className={styles.companySubText}
                                          >
                                            {row.companySub}
                                          </div>
                                        </div>
                                      </td>
                                      {/* Regulator Column */}
                                      <td>
                                        <div className={styles.regCellInner}>
                                          <div
                                            className={styles.regLogoContainer}
                                          >
                                            <img
                                              src={row.regIcon}
                                              alt=""
                                              className={styles.regLogo}
                                            />
                                          </div>
                                          <span>{row.reg}</span>
                                        </div>
                                      </td>
                                      {/* Action/Charges/Advancement Columns */}
                                      <td className={styles.chgCell}>
                                        {row.chg}
                                      </td>
                                      <td
                                        className={styles.actionCell}
                                        style={{
                                          color: "rgba(59, 130, 246, 1)",
                                          fontSize: "12px",
                                        }}
                                      >
                                        {row.act}
                                      </td>
                                      <td className={styles.advCell}>
                                        {(() => {
                                          const match = row.adv.match(
                                            /(.*?)(\d{2}\s[A-Za-z]{3}\s\d{4})$/,
                                          );

                                          if (!match) return row.adv;

                                          return (
                                            <>
                                              <div className={styles.advText}>
                                                {match[1].trim()}
                                              </div>
                                              <div className={styles.advDate}>
                                                {match[2]}
                                              </div>
                                            </>
                                          );
                                        })()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {/* Pagination Footer based on image data */}
                            <div className={styles.paginationFloating}>
                              <div
                                className={`${styles.paginationRow} ${styles.paginationRowExtra}`}
                              >
                                <span className={styles.showingText}>
                                  Showing 1-10 of 20
                                </span>
                                <div className={styles.paginationControls}>
                                  <div className={styles.paginationInfo}>
                                    <span className={styles.rowsLabel}>
                                      Rows per page
                                    </span>
                                    <RowsPerPage
                                      openTop={true}
                                      value={rowsPerPage}
                                      onChange={setRowsPerPage}
                                    />
                                  </div>

                                  <span className={styles.pageLabel}>
                                    Page 1 of 10
                                  </span>
                                  <div className={styles.navButtons}>
                                    <button className={styles.navBtnDisabled}>
                                      <img
                                        src="/icons/chevrons-left.svg"
                                        alt="First page"
                                        className={styles.navIcon}
                                      />
                                    </button>
                                    <button className={styles.navBtnDisabled}>
                                      <img
                                        src="/icons/chevron-left.svg"
                                        alt="First page"
                                        className={styles.navIcon}
                                      />
                                    </button>
                                    <button className={styles.navBtn}>
                                      <img
                                        src="/icons/chevron-right-black.svg"
                                        alt="First page"
                                        className={styles.navIcon}
                                      />
                                    </button>
                                    <button className={styles.navBtn}>
                                      <img
                                        src="/icons/chevrons-right.svg"
                                        alt="First page"
                                        className={styles.navIcon}
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
