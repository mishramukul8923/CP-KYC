import React, { useState, useEffect } from "react";
import styles from "./VersionHistory.module.css";
import { useCompanySection } from "../context/CompanySectionContext";
import { useParams } from "next/navigation";

const getVariant = (type) => {
  switch (type) {
    case "Financials": return "green";
    case "Directors": return "purple";
    case "Compliance": return "orange";
    default: return "blue";
  }
};

const VersionHistory = () => {
  const { isVersionHistoryOpen, setVersionHistoryOpen } = useCompanySection();
  const params = useParams();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(0);

  const companyName = params?.name ? decodeURIComponent(params.name).replaceAll("-", " ").toUpperCase() : "";

  useEffect(() => {
    if (!companyName) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/version-history/${encodeURIComponent(companyName)}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          }
        });

        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        
        // Map API to internal structure
        const mapped = (data.version_history || []).map((v, idx) => ({
          id: idx,
          date: v.date,
          time: v.time || "11:45 AM IST", // Defaulting if missing
          changesCount: v.changes?.length || 0,
          source: v.changes?.[0]?.source || "-",
          isCurrent: v.is_current,
          details: (v.changes || []).map(c => ({
            type: c.type,
            label: c.title,
            from: c.from,
            to: c.to,
            newStatus: (c.new && c.new !== "-") ? c.new : null,
            variant: getVariant(c.type)
          }))
        }));

        setHistoryData(mapped);
        if (mapped.length > 0) setExpandedId(0);
      } catch (err) {
        console.error("Version History Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [companyName]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const activeVersion = historyData.length > 0 ? historyData[0] : null;

  return (
    <div className={`${styles.sidebar} ${isVersionHistoryOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.internalWrapper}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.clockIcon}>
              <img src="/clock.svg" alt="" />
            </div>
            <div className={styles.titleText}>
              <h2>Version History</h2>
              <p>Track all data updates & changes</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={() => setVersionHistoryOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.timeline}>
            {loading ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className={`${styles.skeleton} ${styles.skeletonItem}`} />
                 ))}
               </div>
            ) : historyData.length > 0 ? (
              historyData.map((item) => (
                <div 
                  key={item.id} 
                  className={`${styles.versionItem} ${expandedId === item.id ? styles.versionItemActive : ""}`}
                >
                  <div className={styles.versionHeaderBox} onClick={() => toggleExpand(item.id)}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.versionCardContent}>
                      <div className={styles.versionHeader}>
                        <div className={styles.dateRow}>
                          <span className={styles.dateText}>{item.date}</span>
                          {item.isCurrent && <span className={styles.currentBadge}>Current</span>}
                        </div>
                        <div className={styles.chevronIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </div>
                      </div>
                      <span className={styles.timeText}>{item.time}</span>
                      <div className={styles.metaRow}>
                        <span className={styles.metaText}>{item.changesCount} changes • {item.source}</span>
                      </div>
                    </div>
                  </div>

                  {item.details && (
                    <div className={`${styles.detailsWrapper} ${expandedId === item.id ? styles.detailsWrapperOpen : ""}`}>
                      <div className={styles.expandedDetails}>
                        {item.details.map((detail, idx) => (
                          <div key={idx} className={styles.detailCard}>
                            <div className={`${styles.detailBadge} ${styles['badge' + detail.variant.charAt(0).toUpperCase() + detail.variant.slice(1)]}`}>
                              {detail.type === "Financials" && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                                </svg>
                              )}
                              {detail.type === "Directors" && <img src="/director.svg" alt="" width="12" />}
                              {detail.type === "Compliance" && <img src="/erroricon.svg" alt="" width="12" />}
                              {detail.type}
                            </div>
                            <div className={styles.detailLabel}>{detail.label}</div>
                            <div className={styles.valueRow}>
                              {detail.newStatus ? (
                                <div className={styles.valueNew}>New: <span className={styles.Val}>{detail.newStatus}</span></div>
                              ) : (
                                <>
                                  <div className={styles.valueFrom}>From: <strike>{detail.from}</strike></div>
                                  <div className={styles.valueTo}>To: <span className={styles.Val}>{detail.to}</span></div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No version history available</div>
            )}
          </div>
        </div>

        {activeVersion && (
          <div className={styles.footer}>
            <div className={styles.footerIconBox}>
              <img src="/view.svg" alt="" />
            </div>
            <div className={styles.footerInfo}>
              <h4>Viewing: {activeVersion.date}</h4>
              <p>{activeVersion.changesCount} updates by {activeVersion.source}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionHistory;
