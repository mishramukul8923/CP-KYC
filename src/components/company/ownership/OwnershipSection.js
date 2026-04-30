"use client";

import React from "react";
import styles from "./OwnershipSection.module.css";
import Link from "next/link";
import ShareHoldingsTables from "../shareHoldingsPattern/ShareHoldingsTables";
import ShareHoldingsTables2 from "../shareHoldingsPattern/ShareHoldingsTables2";
import SubsidiaryAccordion from "../subsidiary/SubsidiaryAccordion";
import InvestmentPage from "../overseasDirectInvestment/OverseasDirectInvestment";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";
import { useEffect, useRef } from "react";
import { scrollToElementWithOffset } from "@/utils/scrollUtils";
import { formatDateToIST } from "@/utils/dateFormatter";


import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const OwnershipSection = ({
  companyHighlights,
  shareholdingData,
  shareholdingLoading,
  shareholdingError,
  securityAllotmentData,
  securityAllotmentLoading,
  groupStructureData,
  groupStructureLoading,
  overseasInvestmentData,
  overseasInvestmentLoading
}) => {

  const shareholding = shareholdingData?.overview || companyHighlights?.shareholding;

  const { activeSubSection, setActiveSection, scrollTrigger } = useCompanySection();
  const mainWrapperRef = useRef(null);
  const shareholdingRef = useRef(null);
  const groupStructureRef = useRef(null);
  const odiRef = useRef(null);

  useEffect(() => {
    if (!activeSubSection) return;

    const scroll = (refOrId) => {
      const element = typeof refOrId === "string" ? document.getElementById(refOrId) : refOrId?.current;
      if (element) {
        scrollToElementWithOffset(element, 140);
      }
    };

    // Only skip if the specifically requested section is still loading
    const isLoadingRequested =
      (activeSubSection === "Shareholding" && shareholdingLoading) ||
      (activeSubSection === "Securities Allotment" && securityAllotmentLoading) ||
      (activeSubSection === "Group Structure" && groupStructureLoading) ||
      (activeSubSection === "Overseas Direct Investment (ODI)" && overseasInvestmentLoading);

    if (isLoadingRequested) return;

    const timer = setTimeout(() => {
      switch (activeSubSection) {
        case "Shareholding":
          scroll(shareholdingRef);
          break;

        case "Securities Allotment":
          scroll("Securities Allotment");
          break;

        case "Group Structure":
          scroll(groupStructureRef);
          break;

        case "Overseas Direct Investment (ODI)":
          scroll(odiRef);
          break;

        default:
          break;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [scrollTrigger, shareholdingLoading, securityAllotmentLoading, groupStructureLoading, overseasInvestmentLoading]);

  const colorMap = {
    "Indian": "#A5B4FC",                       // soft indigo
    "Non-Resident Indian (NRI)": "#C4B5FD",    // pastel violet
    "Insurance Companies": "#BBF7D0",          // soft green
    "Banks": "#DDD6FE",                        // light lavender
    "Foreign Institutional Investor": "#BFDBFE", // pastel blue
    "Domestic Institutional Investor": "#FBCFE8", // soft pink
    "Mutual Fund": "#BAE6FD",                  // sky pastel
    "Body Corporate": "#99F6E4",               // aqua pastel
    "Others": "#F5D0FE",                       // light magenta
    "Government": "#FDE68A",                   // pastel yellow
    "Financial Institutions": "#A7F3D0",       // mint green
    "Foreign Portfolio Investors": "#93C5FD",  // soft blue
    "Retail Investors": "#FDA4AF",             // pastel red/pink
    "Trusts": "#C7D2FE",                       // bluish lavender
    "Employees": "#76D7C4",                    // light emerald
    "Public": "#6EE7B7"
  };

  const fallbackColors = [
    "#FFB3BA", // light pink
    "#FFDFBA", // peach
    "#FFFFBA", // pale yellow
    "#BAFFC9", // mint green
    "#BAE1FF", // baby blue
    "#E3BAFF", // lavender
    "#FFCCE5", // blush pink
    "#D5FFCC", // soft green
    "#CCE5FF", // light sky blue
    "#FFF0B3", // cream yellow
    "#F0CCFF", // lilac
    "#FFD6CC", // soft coral
    "#CCFFD9", // aqua green
    "#D9CCFF", // pastel violet
    "#FFE5CC", // light apricot
    "#CCF2FF", // pale cyan
    "#F2FFCC", // light lime
    "#FFCCF2", // pink lavender
    "#E6FFCC", // soft lime green
    "#CCE0FF"  // cool blue
  ];

  let fallbackIndex = 0;

  const rawPromoterHoldingData = (shareholdingData?.promoter_holding_section?.non_promoter_holding_breakdown || [])
    .filter(item => item.holding_percentage && item.holding_percentage !== "-")
    .map(item => {
      let color = colorMap[item.holder_category];
      if (!color) {
        color = fallbackColors[fallbackIndex % fallbackColors.length];
        fallbackIndex++;
      }
      return {
        name: item.holder_category,
        value: parseFloat(item.holding_percentage.replace('%', '')),
        color: color
      };
    });

  const totalHolding = rawPromoterHoldingData.reduce((acc, curr) => acc + curr.value, 0);
  const promoterHoldingData = [...rawPromoterHoldingData];

  if (totalHolding < 100 && totalHolding > 0) {
    promoterHoldingData.push({
      name: "Promoter Holding",
      value: parseFloat((100 - totalHolding).toFixed(2)),
      color: "#f4f4f5"
    });
  }

  const [isPromoterOpen, setIsPromoterOpen] = React.useState(true);

  const isGroupStructureEmpty = !groupStructureData || !groupStructureData.group_entities || groupStructureData.group_entities.length === 0 || (
    groupStructureData.group_entities.length === 1 && Object.entries(groupStructureData.group_entities[0]).every(([key, value]) => {
      if (key === 'ownership_type') return true;
      return !value || value === '-';
    })
  );

  const mockGroupStructureData = {
    summary: {
      other_entities: "1",
      subsidiaries: "5",
      associates: "2",
      joint_ventures: "0"
    },
    parent_company: {
      company_name: "SAMPLE HOLDING COMPANY LTD",
      company_role: "Parent Company",
      total_subsidiaries: 5
    },
    group_entities: [
      { subsidiary_name: "Subsidiary Entity One Ltd", country: "India", ownership_percentage: "100", ownership_type: "Direct Subsidiary", status: "Active" },
      { subsidiary_name: "Subsidiary Entity Two LLC", country: "USA", ownership_percentage: "75", ownership_type: "Indirect Subsidiary", status: "Active" },
      { subsidiary_name: "Subsidiary Entity Three Pvt Ltd", country: "UK", ownership_percentage: "100", ownership_type: "Direct Subsidiary", status: "Active" }
    ]
  };

  const groupDataToUse = isGroupStructureEmpty ? mockGroupStructureData : groupStructureData;

  const groupStats = [
    { label: "Holding Company", value: groupDataToUse?.summary?.other_entities || "-", type: "blue" },
    { label: "Subsidiary Company", value: groupDataToUse?.summary?.subsidiaries || "-", type: "red" },
    { label: "Associate Company", value: groupDataToUse?.summary?.associates || "-", type: "purple" },
    { label: "Joint Ventures", value: groupDataToUse?.summary?.joint_ventures || "-", type: "green" },
  ];

  return (
    <div ref={mainWrapperRef} className={styles.mainWrapper} id="control-ownership">
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Control & Ownership</h1>
        <div className={styles.headerInfo}>
          <span className={styles.infoGroup}>
            <span className={styles.infoLabel}>Source:</span>
            <span className={styles.infoValue}>{shareholdingData?.source || "-"}</span>
          </span>
          <span className={styles.infoDivider}></span>
          <span className={styles.infoGroup}>
            <span className={styles.infoLabel}>Last Updated:</span>
            <span className={styles.infoValue}>{formatDateToIST(shareholdingData?.last_updated) || "-"}</span>
          </span>
        </div>
      </div>

      <section className={styles.section} id="Shareholding">
        <div className={styles.sectionHeader} ref={shareholdingRef}>
          <h2 className={styles.sectionTitle}>Shareholding </h2>
        </div>

        <div className={styles.card}>
          {shareholdingLoading ? (
            <div className={styles.shareholdingSection}>
              <div className={styles.statsGrid}>
                <div className={`${styles.statItem} ${styles.statItemFirst}`}>
                  <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonValue}`} />
                </div>
                <div className={`${styles.statItem} ${styles.statItemMiddle}`}>
                  <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonValue}`} />
                </div>
                <div className={`${styles.statItem} ${styles.statItemLast}`}>
                  <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonValue}`} />
                </div>
              </div>
              <div className={styles.chartHeader}>
                <div className={styles.chartLine}></div>
                <span className={styles.chartHeaderText}>Shareholding</span>
                <div className={styles.chartLine}></div>
              </div>
              <div className={styles.progressContainer}>
                <div className={`${styles.skeleton} ${styles.skeletonProgress}`} />
              </div>
              <div className={styles.legendGrid}>
                <div className={styles.legendItem}>
                  <div className={`${styles.skeleton} ${styles.skeletonDot}`} />
                  <div>
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '80px' }} />
                    <div className={`${styles.skeleton} ${styles.skeletonLegendValue}`} />
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.skeleton} ${styles.skeletonDot}`} />
                  <div>
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '80px' }} />
                    <div className={`${styles.skeleton} ${styles.skeletonLegendValue}`} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.shareholdingSection}>
                <div className={styles.statsGrid}>
                  <div className={`${styles.statItem} ${styles.statItemFirst}`}>
                    <span className={styles.statLabel}>Total Equity Shares</span>
                    <span className={styles.statValue}>{shareholding?.total_equity_shares ?? "-"}</span>
                  </div>
                  <div className={`${styles.statItem} ${styles.statItemMiddle}`}>
                    <span className={styles.statLabel}>Promoter Holding</span>
                    <span className={styles.statValue}>{shareholding?.promoter_holding_shares ?? "-"}</span>
                  </div>
                  <div className={`${styles.statItem} ${styles.statItemLast}`}>
                    <span className={styles.statLabel}>Non-Promoter Holding</span>
                    <span className={styles.statValue}>{shareholding?.non_promoter_holding_shares ?? "-"}</span>
                  </div>
                </div>
                <div className={styles.chartHeader}>
                  <div className={styles.chartLine}></div>
                  <span className={styles.chartHeaderText}>Shareholding</span>
                  <div className={styles.chartLine}></div>
                </div>

                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressPromoter}
                      style={{ width: `${parseFloat(shareholdingData?.summary?.promoter_percentage || 0)}%` }}
                    ></div>
                    <div
                      className={styles.progressNonPromoter}
                      style={{ width: `${parseFloat(shareholdingData?.summary?.public_percentage || 0)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className={styles.legendGrid}>
                <div className={styles.legendItem}>
                  <div className={`${styles.dot} ${styles.dotPromoter}`}></div>
                  <div>
                    <p className={styles.legendLabel}>Promoter </p>
                    <p className={styles.legendValue}>{shareholdingData?.summary?.promoter_percentage ? `${shareholdingData?.summary?.promoter_percentage}` : "-"}</p>
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.dot} ${styles.dotNonPromoter}`}></div>
                  <div>
                    <p className={styles.legendLabel}>Non Promoter</p>
                    <p className={styles.legendValue}>{shareholdingData?.summary?.public_percentage ? `${shareholdingData?.summary?.public_percentage}` : "-"}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {shareholdingLoading ? (
          <div className={styles.controlInsightCard}>
            <div className={`${styles.skeleton} ${styles.skeletonValue}`} style={{ width: '150px' }} />
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100%' }} />
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '80%' }} />
          </div>
        ) : (
          <div className={styles.controlInsightCard}>
            <div className={styles.controlInsightHeader}>
              <img src="/icons/blacktick.svg" alt="" className={styles.controlInsightIcon} />
              <h3 className={styles.controlInsightTitle}>Control Insight</h3>
            </div>
            <p className={styles.controlInsightText}>
              {shareholdingData?.control_insight?.replace(/;/g, ' ') || "No control insight available."}
            </p>
          </div>
        )}

        {shareholdingLoading ? (
          <div className={styles.promoterHoldingSection}>
            <div className={`${styles.skeleton} ${styles.skeletonValue}`} style={{ width: '200px' }} />
            <div className={styles.promoterContent}>
              <div className={styles.promoterLeft}>
                <div className={`${styles.skeleton} ${styles.skeletonValue}`} style={{ width: '100px', height: '32px' }} />
                <div className={`${styles.skeleton} ${styles.skeletonValue}`} style={{ width: '150px', height: '40px' }} />
                <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100%' }} />
              </div>
              <div className={styles.promoterRight}>
                <div className={`${styles.skeleton} ${styles.skeletonValue}`} style={{ width: '150px' }} />
                <div className={styles.chartContainer}>
                  <div className={`${styles.skeleton} ${styles.skeletonDot}`} style={{ width: '150px', height: '150px' }} />
                  <div className={styles.chartLegendGrid}>
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '100%' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.promoterHoldingSection}>
            <div
              className={styles.promoterHeader}
              onClick={() => setIsPromoterOpen(!isPromoterOpen)}
              style={{ cursor: "pointer" }}
            >
              <h3 className={styles.promoterTitle}>Promoter Holding</h3>
              <img
                src="/icons/chevron-down-dark.svg"
                alt="Expand"
                className={`${styles.expandIcon} ${isPromoterOpen ? styles.rotateIcon : ""}`}
              />
            </div>

            {isPromoterOpen && (
              <div className={styles.promoterContent}>
                <div className={styles.promoterLeft}>
                  <div className={styles.promoterStatBig}>
                    <span className={styles.promoterStatValue}>{shareholdingData?.promoter_holding_section?.promoter_holding_shares || "-"}</span>
                    <span className={styles.promoterStatLabel}>Shares</span>
                  </div>

                  <div className={styles.promoterBadge}>
                    <span className={styles.promoterBadgeValue}>
                      {shareholdingData?.promoter_holding_section?.promoter_holding_percentage_of_total_equity &&
                        shareholdingData?.promoter_holding_section?.promoter_holding_percentage_of_total_equity !== "-"
                        ? `${shareholdingData?.promoter_holding_section?.promoter_holding_percentage_of_total_equity}`
                        : "-"}
                    </span>
                    <span className={styles.promoterBadgeLabel}>of total equity</span>
                  </div>

                  <p className={styles.promoterDescription}>
                    {shareholdingData?.promoter_holding_section?.detailed_classification_note || "Detailed classification not available in current filings."}
                  </p>

                  <div className={styles.pledgeLockin}>
                    <div className={styles.pledgeBox}>Pledge: {shareholdingData?.promoter_holding_section?.pledge_status || "-"}</div>
                    <div className={styles.pledgeBox}>Lock-in: {shareholdingData?.promoter_holding_section?.lock_in_status || "-"}</div>
                  </div>
                </div>

                <div className={styles.promoterRight}>
                  <h4 className={styles.chartTitle}>Non-Promoter Holding Breakdown</h4>
                  <div className={styles.chartContainer}>
                    <div className={styles.donutWrapper}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip
                            formatter={(value, name) => [`${value}%`, name]}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #E4E4E7', fontSize: '12px' }}
                          />
                          <Pie
                            data={promoterHoldingData}
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={0.5}
                            dataKey="value"
                            stroke="none"
                          >
                            {promoterHoldingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className={styles.chartLegendGrid}>
                      <div className={styles.chartLegendItem}>
                        <div className={styles.legendLeft}>
                          <div
                            className={styles.legendColor}
                            style={{ backgroundColor: "#f4f4f5" }}
                          ></div>
                          <span className={styles.legendName}>Promoter Holding:</span>
                        </div>
                        <span className={styles.legendPercent}>
                          {shareholdingData?.promoter_holding_section?.promoter_holding_percentage_of_total_equity || "-"}
                        </span>
                      </div>
                      {promoterHoldingData
                        .filter(item => item.name !== "Remaining" && item.name !== "Promoter Holding")
                        .map((item, idx) => (
                          <div key={idx} className={styles.chartLegendItem}>
                            <div className={styles.legendLeft}>
                              <div
                                className={styles.legendColor}
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className={styles.legendName}>{item.name}:</span>
                            </div>
                            <span className={styles.legendPercent}>{item.value}%</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <ShareHoldingsTables
          shareholdingData={shareholdingData}
          promoters_table_totals={shareholdingData?.promoters_table_totals}
          public_table_totals={shareholdingData?.public_other_than_promoters_table_totals}
          loading={shareholdingLoading}
        />
      </section>

      {securityAllotmentLoading ? (
        <section className={styles.section}>
          <div className={`${styles.skeleton} ${styles.skeletonValue}`} style={{ width: '200px' }} />
          <div className={styles.tableWrapper}>
            <div className={`${styles.skeleton} ${styles.skeletonProgress}`} style={{ height: '300px' }} />
          </div>
        </section>
      ) : (
        <ShareHoldingsTables2
          shareholdingData={shareholdingData}
          securityAllotmentData={securityAllotmentData}
        />
      )}

      {groupStructureLoading ? (
        <section className={styles.section}>
          <div className={styles.sectionWrapper}>
            <h2 className={styles.sectionTitle}>Group Structure</h2>
          </div>
          <div className={styles.statsGrid}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`${styles.skeleton} ${styles.skeletonStat}`} style={{ height: '80px' }} />
            ))}
          </div>
          <div className={`${styles.skeleton} ${styles.skeletonProgress}`} style={{ height: '200px' }} />
        </section>
      ) : (
        <section ref={groupStructureRef} className={styles.section} id="Group Structure">
          <div className={styles.sectionWrapper}>
            <h2 className={styles.sectionTitle}>Group Structure</h2>
          </div>

          <div className={styles.blurContainer}>
            {!groupStructureLoading && isGroupStructureEmpty && (
              <div className={styles.overlay}>
                <span className={styles.overlayTitle}>Content Not Available</span>
                <span className={styles.overlaySubtitle}>Need MCA Documents.</span>
                <div className={styles.lockIcon} onClick={() => { setActiveSection?.("documents"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ cursor: "pointer" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
                </div>
              </div>
            )}
            <div className={isGroupStructureEmpty ? styles.blurContent : ""}>
              {!groupStats.every(stat => !stat.value || stat.value === "-") && (
                <div className={styles.statsGrid}>
                  {groupStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className={`${styles.statCard} ${styles[stat.type + "Stat"]}`}
                    >
                      <p className={styles.statLabel}>{stat.label}</p>
                      <p className={styles.statValue}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}
              <SubsidiaryAccordion groupStructureData={groupDataToUse} />
            </div>
          </div>
        </section>
      )}

      {overseasInvestmentLoading ? (
        <section className={styles.section}>
          <div className={`${styles.skeleton} ${styles.skeletonValue}`} style={{ width: '200px' }} />
          <div className={`${styles.skeleton} ${styles.skeletonProgress}`} style={{ height: '300px' }} />
        </section>
      ) : (
        <div ref={odiRef} id="Overseas Direct Investment (ODI)">
          <InvestmentPage overseasInvestmentData={overseasInvestmentData} />
        </div>
      )}
    </div>
  );
};

export default OwnershipSection;
