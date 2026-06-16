"use client";

import { useEffect, useState } from "react";
import styles from "@/components/company/layout/CompanyLayout.module.css";
import CompanyNewHeader from "@/components/company/newHeader/newHeader";
import CompanyStickyHeader from "@/components/company/newHeader/CompanyStickyHeader";
import CompanyNewSidebar from "@/components/company/newSidebar/newSidebar";
import { useParams } from "next/navigation";
import VersionHistory from "@/components/company/versionHistory/VersionHistory";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";
import Link from "next/link";

export default function CompanyLayout({ children }) {
  const {
    setAlertsData,
    setAlertsLoading,
    setAlertsError,
    litigationPage,
    companyData,
    companyLoading,
    companyError
  } = useCompanySection() || {};
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const params = useParams();
  const rawCompanyName = (params.name.replaceAll("-", " ")).toUpperCase(); // from /company/dabur because route is [name]
  const [companyName, setCompanyName] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyHeader(window.scrollY > 220);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!rawCompanyName) return;
    const companyNamee = decodeURIComponent(rawCompanyName);
    setCompanyName(companyNamee);
  }, [rawCompanyName]);

  /* ================= VALIDATE COMPANY BY SUGGESTIONS ================= */
  useEffect(() => {
    if (!companyName) return;

    const validateCompany = async () => {
      try {
        setIsValidating(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://cpkycapi.webninjaz.com/api/search/suggestions?q=${encodeURIComponent(companyName)}&limit=40`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : ""
          }
        });
        if (!res.ok) {
          setIsNotFound(true);
          return;
        }
        const result = await res.json();
        if (result && result.total === 0) {
          setIsNotFound(true);
        } else {
          setIsNotFound(false);
        }
      } catch (err) {
        console.error("Validation error:", err);
        setIsNotFound(true);
      } finally {
        setIsValidating(false);
      }
    };

    validateCompany();
  }, [companyName]);

  /* ================= GET ALERTS DATA ================= */
  useEffect(() => {
    if (!companyName || isNotFound || isValidating) return;

    const getAlerts = async () => {
      try {
        setAlertsLoading(true);
        setAlertsError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/alerts?page=${litigationPage}&size=10`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Alerts Error ${response.status}`);
        }

        const data = await response.json();
        setAlertsData(data);
      } catch (error) {
        console.error("Error fetching Alerts in layout:", error);
        setAlertsError(error.message);
      } finally {
        setAlertsLoading(false);
      }
    };

    getAlerts();
  }, [companyName, setAlertsData, setAlertsLoading, setAlertsError, litigationPage, isNotFound, isValidating]);

  if (isValidating) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(4, 30, 66, 0.1)",
          borderTop: "4px solid rgba(4, 30, 66, 1)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className={styles.notFoundContainer}>
        <h1 className={styles.notFoundCode}>404</h1>
        <h2 className={styles.notFoundTitle}>Page Not Found</h2>
        <p className={styles.notFoundMessage}>
          Looks like this company doesn't exist in our records — or maybe we just haven't indexed this corner of the web yet.
        </p>
        <Link href="/" className={styles.notFoundButton}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* 🔹 Compact sticky header */}
      <CompanyStickyHeader visible={showStickyHeader} companyData={companyData} loading={companyLoading} />

      <div className={styles.container}>
        {/* 🔹 Full header */}
        <CompanyNewHeader companyData={companyData} loading={companyLoading} />

        {/* Sidebar + Content */}
        <div className={styles.contentWrapper}>
          <div className={styles.contentRow}>
            <aside className={styles.sidebar}>
              <CompanyNewSidebar />
            </aside>

            <main className={styles.main}>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}
