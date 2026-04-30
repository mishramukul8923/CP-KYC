import { useState, useRef, useEffect } from "react";
import styles from "./DefaultsViolations.module.css";

const TruncatedText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const checkTruncation = () => {
      if (!isExpanded && textRef.current) {
        setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight + 2);
      }
    };

    checkTruncation();

    const resizeObserver = new ResizeObserver(() => {
      checkTruncation();
    });

    resizeObserver.observe(textRef.current);

    return () => resizeObserver.disconnect();
  }, [text, isExpanded]);

  if (!text || text === "-") return <span>{text}</span>;

  return (
    <div>
      <div
        ref={textRef}
        style={{
          display: isExpanded ? 'block' : '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }}
      >
        {text}
      </div>
      {(isTruncated || isExpanded) && (
        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          style={{ background: 'none', border: 'none', color: '#2859a9ff', cursor: 'pointer', padding: 0, fontSize: '12px', fontWeight: 500 }}
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default function DefaultsViolations({ alertsData, alertsLoading, alertsError }) {

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
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "8%" }}>Regulator</th>
                <th style={{ width: "20%" }}>Entity</th>
                <th style={{ width: "27%" }}>Regulatory Charges</th>
                <th style={{ width: "20%" }}>Regulatory Action</th>
                <th style={{ width: "25%" }}>Further Developments</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, index) => (
                <tr key={index}>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
                  <td><div className={`${styles.skeleton} ${styles.skeletonRow}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const violations = alertsData?.regulatory_alerts || [];

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Company-Level Defaults & Violations</h3>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "15%" }}>Regulator</th>
              <th style={{ width: "15%" }}>Entity</th>
              <th style={{ width: "25%" }}>Regulatory Charges</th>
              <th style={{ width: "20%" }}>Regulatory Action</th>
              <th style={{ width: "25%" }}>Further Developments</th>
            </tr>
          </thead>
          <tbody>
            {violations.length > 0 ? (
              violations.map((item, index) => (
                <tr key={index}>
                  <td><TruncatedText text={item.regulator} /></td>
                  <td><TruncatedText text={item.entity} /></td>
                  <td>
                    {item.regulatory_charges === "Not Available" ? (
                      <span className={styles.italicMuted}>{item.regulatory_charges}</span>
                    ) : (
                      <TruncatedText text={item.regulatory_charges} />
                    )}
                  </td>
                  <td><TruncatedText text={item.regulatory_action} /></td>
                  <td><TruncatedText text={item.further_developments} /></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#71717A', fontStyle: 'italic' }}>
                  No regulatory alerts found for this company.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}