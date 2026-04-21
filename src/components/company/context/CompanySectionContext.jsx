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
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState(null);
  const [pdfDownloadTrigger, setPdfDownloadTrigger] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    setActiveSection(sectionFromUrl);
    setActiveSubSection(subFromUrl);
  }, [sectionFromUrl, subFromUrl]);

  const updateSection = (section, sub = null) => {
    setActiveSection(section);
    setActiveSubSection(sub);

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
        pdfDownloadTrigger,
        setPdfDownloadTrigger,
        isGeneratingPdf,
        setIsGeneratingPdf,
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
