"use client";

import { useEffect, useState } from "react";
import styles from "@/components/company/layout/CompanyLayout.module.css";
import CompanyNewHeader from "@/components/company/newHeader/newHeader";
import CompanyStickyHeader from "@/components/company/newHeader/CompanyStickyHeader";
import CompanyNewSidebar from "@/components/company/newSidebar/newSidebar";
import { useParams, useRouter } from "next/navigation";
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
    companyError,
    setIsCompanyValid
  } = useCompanySection() || {};
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const params = useParams();
  const router = useRouter();
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
    if (setIsCompanyValid) setIsCompanyValid(null);
  }, [rawCompanyName, setIsCompanyValid]);

  /* ================= VALIDATE COMPANY BY SUGGESTIONS ================= */
  useEffect(() => {
    if (!companyName) return;

    // Check if navigation was internal search
    let isInternal = false;
    if (typeof window !== "undefined") {
      isInternal = sessionStorage.getItem("internalSearch") === "true";
      sessionStorage.removeItem("internalSearch"); // Consume flag immediately
    }

    if (isInternal) {
      setIsValidating(false);
      setIsNotFound(false);
      if (setIsCompanyValid) setIsCompanyValid(true);
      return;
    }

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
          if (setIsCompanyValid) setIsCompanyValid(false);
          return;
        }
        const result = await res.json();
        if (result && (result.total === 0 || !result.suggestions || result.suggestions.length === 0)) {
          setIsNotFound(true);
          if (setIsCompanyValid) setIsCompanyValid(false);
        } else {
          // Check if there is an exact case-insensitive match in suggestions list
          const exactMatch = result.suggestions.find(
            (s) => s.name.toUpperCase() === companyName
          );

          if (exactMatch) {
            setIsNotFound(false);
            if (setIsCompanyValid) setIsCompanyValid(true);
          } else {
            // Auto-redirect to the first suggestion that came in suggestions
            const firstSuggestionName = result.suggestions[0].name;
            const firstSuggestionSlug = firstSuggestionName.replaceAll(" ", "-").toLowerCase();
            const currentSlug = params.name.toLowerCase();

            if (currentSlug !== firstSuggestionSlug) {
              router.push(`/company/${firstSuggestionSlug}`);
              return;
            }

            setIsNotFound(false);
            if (setIsCompanyValid) setIsCompanyValid(true);
          }
        }
      } catch (err) {
        console.error("Validation error:", err);
        setIsNotFound(true);
        if (setIsCompanyValid) setIsCompanyValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateCompany();
  }, [companyName, setIsCompanyValid]);

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

  if (isNotFound) {
    return (
      <div className={styles.notFoundContainer}>
        <h1 className={styles.notFoundCode}>404</h1>
        <h2 className={styles.notFoundTitle}>Page Not Found</h2>
        <p className={styles.notFoundMessage}>
          Looks like this company doesn't exist in our records — or maybe we just haven't indexed this corner of the web yet.
        </p>
        <Link
          href="/"
          className={styles.notFoundButton}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* 🔹 Compact sticky header */}
      <CompanyStickyHeader visible={showStickyHeader} companyData={companyData} loading={companyLoading || isValidating} />

      <div className={styles.container}>
        {/* 🔹 Full header */}
        <CompanyNewHeader companyData={companyData} loading={companyLoading || isValidating} />

        {/* Sidebar + Content */}
        <div className={styles.contentWrapper}>
          <div className={styles.contentRow}>
            <aside className={styles.sidebar}>
              <CompanyNewSidebar loading={isValidating} />
            </aside>

            <main className={styles.main}>
              {isValidating ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
                  <div className={styles.skeletonItem} style={{ height: '200px' }} />
                  <div className={styles.skeletonItem} style={{ height: '350px' }} />
                </div>
              ) : (
                children
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
