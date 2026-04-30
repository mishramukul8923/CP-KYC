"use client";

import { useEffect, useState } from "react";
import styles from "@/components/company/layout/CompanyLayout.module.css";
import CompanyNewHeader from "@/components/company/newHeader/newHeader";
import CompanyStickyHeader from "@/components/company/newHeader/CompanyStickyHeader";
import CompanyNewSidebar from "@/components/company/newSidebar/newSidebar";
import { useParams } from "next/navigation";
import VersionHistory from "@/components/company/versionHistory/VersionHistory";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";

export default function CompanyLayout({ children }) {
  const {
    setAlertsData,
    setAlertsLoading,
    setAlertsError,
    litigationPage
  } = useCompanySection() || {};
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const params = useParams();
  const rawCompanyName = (params.name.replaceAll("-", " ")).toUpperCase(); // from /company/dabur because route is [name]
  const [companyName, setCompanyName] = useState("");
  // Company Details
  const [companyData, setCompanyData] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState(null);

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


  /* ================= GET COMPANY DETAILS ================= */

  useEffect(() => {
    if (!companyName) return;

    const getCompanyDetails = async () => {
      try {
        setCompanyLoading(true);
        setCompanyError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company-details/${encodeURIComponent(companyName)}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error("Invalid server response");
        }

        if (!response.ok) {
          throw new Error(
            data?.detail ||
            data?.message ||
            `Company Details Error ${response.status}: ${response.statusText}`
          );
        }

        setCompanyData(data);

      } catch (error) {
        console.log("Error fetching company details rahul :", error);
        setCompanyError(error.message);
      } finally {
        setCompanyLoading(false);
      }
    };

    getCompanyDetails();
  }, [companyName]);

  /* ================= GET ALERTS DATA ================= */
  useEffect(() => {
    if (!companyName) return;

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
  }, [companyName, setAlertsData, setAlertsLoading, setAlertsError, litigationPage]);

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
