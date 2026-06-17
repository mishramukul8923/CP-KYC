"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CompanySectionContext = createContext(null);

export function CompanySectionProvider({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sectionFromUrl = searchParams.get("section") || "companyDetails";
  const subFromUrl = searchParams.get("sub");

  const [activeSection, setActiveSection] = useState(sectionFromUrl);
  const [activeSubSection, setActiveSubSection] = useState(subFromUrl);
  const [isVersionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [alertsData, setAlertsData] = useState(null);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState(null);
  const [litigationPage, setLitigationPage] = useState(1);
  const [companyData, setCompanyData] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState(null);
  const [pdfDownloadTrigger, setPdfDownloadTrigger] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedReportSections, setSelectedReportSections] = useState(null);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [isCompanyValid, setIsCompanyValid] = useState(null); // null = validating, true = valid, false = invalid

  useEffect(() => {
    setActiveSection(sectionFromUrl);
    setActiveSubSection(subFromUrl);
  }, [sectionFromUrl, subFromUrl]);

  const updateSection = (section, sub = null) => {
    setActiveSection(section);
    setActiveSubSection(sub);
    setScrollTrigger(prev => prev + 1);

    const params = new URLSearchParams();
    params.set("section", section);
    if (sub) params.set("sub", sub);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <CompanySectionContext.Provider
      value={{
        activeSection,
        activeSubSection,
        scrollTrigger,
        setScrollTrigger,
        setActiveSection: updateSection,
        setActiveSubSection,
        isVersionHistoryOpen,
        setVersionHistoryOpen,
        alertsData,
        setAlertsData,
        alertsLoading,
        setAlertsLoading,
        alertsError,
        setAlertsError,
        litigationPage,
        setLitigationPage,
        pdfDownloadTrigger,
        setPdfDownloadTrigger,
        isGeneratingPdf,
        setIsGeneratingPdf,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        selectedReportSections,
        setSelectedReportSections,
        companyData,
        setCompanyData,
        companyLoading,
        setCompanyLoading,
        companyError,
        setCompanyError,
        isCompanyValid,
        setIsCompanyValid,
      }}
    >
      {children}
    </CompanySectionContext.Provider>
  );
}

export function useCompanySection() {
  const context = useContext(CompanySectionContext);
  if (!context) {
    throw new Error(
      "useCompanySection must be used inside CompanySectionProvider"
    );
  }
  return context;
}
