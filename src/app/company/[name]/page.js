"use client";
import { useRef, useEffect, useState } from "react";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";
import { scrollToElementWithOffset } from "@/utils/scrollUtils";


import CompanyOverview from "@/components/company/overview/CompanyOverview";
import CompanyDetails from "@/components/company/details/CompanyDetails";
import NameHistory from "@/components/company/history/NameHistory";
import ContactAddressSection from "@/components/company/contact/ContactAddressSection";
import CompanyNews from "@/components/company/news/CompanyNews";

import CompanyHighlights from "@/components/company/highlights/CompanyHighlights";
import FinancialHighlights from "@/components/company/financials/FinancialHighlights";
import CompanyCharts from "@/components/company/charts/CompanyCharts";
import ProductDetails from "@/components/company/productDetails/ProductDetails";

import DirectorsSection from "@/components/company/people/DirectorsSection";
import OwnershipSection from "@/components/company/ownership/OwnershipSection";
import FinancialHighlightsDetails from "@/components/company/financialHighlights/FinancialHighlightsDetails";
import LigilationDetails from "@/components/company/ligilation/LigilationDetails";
import Documents from "@/components/company/documents/Documents";

import ChargesPage from "@/components/company/charges/Charges";
import PeerComparison from "@/components/company/peerComparison/PeerComparison";
import RelatedCorporates from "@/components/company/relatedCorporates/RelatedCorporates";
import ComplianceDetails from "@/components/company/complianceDetails/ComplianceDetails";



import AlertsContainer from "@/components/company/alerts/AlertsContainer";
import { useParams } from "next/navigation";

export default function CompanyPage() {
  const { activeSection, activeSubSection, scrollTrigger } = useCompanySection();
  const params = useParams();
  const rawCompanyName = (params.name.replaceAll("-", " ")).toUpperCase(); // from /company/dabur because route is [name]


  const [companyName, setCompanyName] = useState("");

  // Company Details
  const [companyData, setCompanyData] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyError, setCompanyError] = useState(null);

  // Profit & Loss
  const [pnlViewType, setPnlViewType] = useState("Standalone");
  const [pnlStandalone, setPnlStandalone] = useState(null);
  const [pnlConsolidated, setPnlConsolidated] = useState(null);
  const [pnlLoading, setPnlLoading] = useState(true);
  const [pnlError, setPnlError] = useState(null);

  // Derived state for existing components
  const pnlApiData = pnlViewType === "Standalone" ? pnlStandalone : pnlConsolidated;

  // Financial Highlights
  const [financialHighlights, setFinancialHighlights] = useState(null);
  const [financialLoading, setFinancialLoading] = useState(true);
  const [financialError, setFinancialError] = useState(null);

  // Revenue Trend
  const [revenueProfitTrend, setRevenueProfitTrend] = useState(null);
  const [trendLoading, setTrendLoading] = useState(true);
  const [trendError, setTrendError] = useState(null);

  // Common Directorship
  const [commonDirectorship, setCommonDirectorship] = useState(null);
  const [directorshipLoading, setDirectorshipLoading] = useState(true);
  const [directorshipError, setDirectorshipError] = useState(null);

  // Company Highlights (Paginated)
  const [companyHighlights, setCompanyHighlights] = useState(null);
  const [highlightsLoading, setHighlightsLoading] = useState(true);
  const [highlightsError, setHighlightsError] = useState(null);
  const [highlightsPage, setHighlightsPage] = useState(1);
  const [highlightsLimit, setLimit] = useState(10);

  // Charges
  const [chargesData, setChargesData] = useState(null);
  const [chargesLoading, setChargesLoading] = useState(true);
  const [chargesError, setChargesError] = useState(null);
  const [openPage, setOpenPage] = useState(1);
  const [closedPage, setClosedPage] = useState(1);
  const [chargesLimit, setChargesLimit] = useState(10);

  // Directors & KMPS
  const [directorsData, setDirectorsData] = useState(null);
  const [directorsLoading, setDirectorsLoading] = useState(true);
  const [directorsError, setDirectorsError] = useState(null);

  // Consume Alerts and PDF trigggers from shared context
  const { alertsData, alertsLoading, alertsError, pdfDownloadTrigger, setIsGeneratingPdf } = useCompanySection();
  const lastHandledTrigger = useRef(pdfDownloadTrigger);


  // Auditors Details
  const [auditorsLoading, setAuditorsLoading] = useState(true);
  const [auditorsError, setAuditorsError] = useState(null);
  const [audType, setAudType] = useState("Standalone");
  const [audStandalone, setAudStandalone] = useState([]);
  const [audConsolidated, setAudConsolidated] = useState([]);

  // Derived state for existing components
  const auditorsData = audType === "Standalone" ? audStandalone : audConsolidated;

  // Balance Sheet Details
  const [balanceSheetLoading, setBalanceSheetLoading] = useState(true);
  const [balanceSheetError, setBalanceSheetError] = useState(null);
  const [bsType, setBsType] = useState("Standalone");
  const [bsStandalone, setBsStandalone] = useState(null);
  const [bsConsolidated, setBsConsolidated] = useState(null);

  // Derived state for existing components
  const balanceSheetData = bsType === "Standalone" ? bsStandalone : bsConsolidated;

  // Cash Flow Details
  const [cashFlowLoading, setCashFlowLoading] = useState(false);
  const [cashFlowError, setCashFlowError] = useState(null);
  const [cfType, setCfType] = useState("Standalone");
  const [cfStandalone, setCfStandalone] = useState(null);
  const [cfConsolidated, setCfConsolidated] = useState(null);

  // Derived state for existing components
  const cashFlowData = cfType === "Standalone" ? cfStandalone : cfConsolidated;

  // Ratios Details
  const [ratiosLoading, setRatiosLoading] = useState(false);
  const [ratiosError, setRatiosError] = useState(null);
  const [ratiosType, setRatiosType] = useState("Standalone");
  const [ratioStandalone, setRatioStandalone] = useState(null);
  const [ratioConsolidated, setRatioConsolidated] = useState(null);

  // Derived state for existing components
  const ratiosData = ratiosType === "Standalone" ? ratioStandalone : ratioConsolidated;

  // Shareholding Details
  const [shareholdingData, setShareholdingData] = useState(null);
  const [shareholdingLoading, setShareholdingLoading] = useState(false);
  const [shareholdingError, setShareholdingError] = useState(null);

  const [securityAllotmentData, setSecurityAllotmentData] = useState(null);
  const [securityAllotmentLoading, setSecurityAllotmentLoading] = useState(false);
  const [securityAllotmentError, setSecurityAllotmentError] = useState(null);

  const [groupStructureData, setGroupStructureData] = useState(null);
  const [groupStructureLoading, setGroupStructureLoading] = useState(false);
  const [groupStructureError, setGroupStructureError] = useState(null);

  const [overseasInvestmentData, setOverseasInvestmentData] = useState(null);
  const [overseasInvestmentLoading, setOverseasInvestmentLoading] = useState(false);
  const [overseasInvestmentError, setOverseasInvestmentError] = useState(null);

  // Peer Comparison
  const [peerComparisonData, setPeerComparisonData] = useState(null);
  const [peerComparisonLoading, setPeerComparisonLoading] = useState(false);
  const [peerComparisonError, setPeerComparisonError] = useState(null);
  const [peerPage, setPeerPage] = useState(1);
  const [peerLimit, setPeerLimit] = useState(10);

  // Litigation
  const [litigationData, setLitigationData] = useState(null);
  const [litigationLoading, setLitigationLoading] = useState(false);
  const [litigationError, setLitigationError] = useState(null);

  const [paPage, setPaPage] = useState(1);
  const [paSize, setPaSize] = useState(10);
  const [pbPage, setPbPage] = useState(1);
  const [pbSize, setPbSize] = useState(10);
  const [daPage, setDaPage] = useState(1);
  const [daSize, setDaSize] = useState(10);
  const [dbPage, setDbPage] = useState(1);
  const [dbSize, setDbSize] = useState(10);

  // Auditor Remarks
  const [auditorRemarksData, setAuditorRemarksData] = useState(null);


  const overviewRef = useRef(null);
  const nameHistoryRef = useRef(null);
  const contactRef = useRef(null);
  const newsRef = useRef(null);

  /* ================= SET COMPANY NAME ================= */

  useEffect(() => {
    if (!rawCompanyName) return;
    const companyNamee = decodeURIComponent(rawCompanyName);
    setCompanyName(companyNamee);
  }, [rawCompanyName]);


  /* ================= PDF GENERATION LISTENER ================= */

  useEffect(() => {
    if (pdfDownloadTrigger > lastHandledTrigger.current) {
      lastHandledTrigger.current = pdfDownloadTrigger;
      const generateAndDownloadPdf = async () => {
        try {
          setIsGeneratingPdf(true);

          const token = localStorage.getItem("token");
          const companyNameEncoded = encodeURIComponent(companyName);

          // Fetch Standalone and Consolidated balance sheets if not already present
          let standalone = bsStandalone;
          let consolidated = bsConsolidated;

          const fetchBS = async (type) => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${companyNameEncoded}/balance-sheet?type=${type}`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };

          if (!standalone) {
            try { standalone = await fetchBS("Standalone"); setBsStandalone(standalone); } catch (e) { console.error(e); }
          }
          if (!consolidated) {
            try { consolidated = await fetchBS("Consolidated"); setBsConsolidated(consolidated); } catch (e) { console.error(e); }
          }

          // Fetch Standalone and Consolidated P&L if not already present
          let pnlStan = pnlStandalone;
          let pnlCons = pnlConsolidated;

          const fetchPNL = async (type) => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/screener/profit-loss?result_type=${type}`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };

          if (!pnlStan) {
            try { pnlStan = await fetchPNL("Standalone"); setPnlStandalone(pnlStan); } catch (e) { console.error(e); }
          }
          if (!pnlCons) {
            try { pnlCons = await fetchPNL("Consolidated"); setPnlConsolidated(pnlCons); } catch (e) { console.error(e); }
          }

          // Fetch Standalone and Consolidated Cash Flow if not already present
          let cfStan = cfStandalone;
          let cfCons = cfConsolidated;

          const fetchCF = async (type) => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${companyNameEncoded}/cash-flow?type=${type}`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };

          if (!cfStan) {
            try { cfStan = await fetchCF("Standalone"); setCfStandalone(cfStan); } catch (e) { console.error(e); }
          }
          if (!cfCons) {
            try { cfCons = await fetchCF("Consolidated"); setCfConsolidated(cfCons); } catch (e) { console.error(e); }
          }

          // Fetch Standalone and Consolidated Ratios if not already present
          let ratioStan = ratioStandalone;
          let ratioCons = ratioConsolidated;

          const fetchRatio = async (type) => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${companyNameEncoded}/ratios?type=${type}`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };

          if (!ratioStan) {
            try { ratioStan = await fetchRatio("Standalone"); setRatioStandalone(ratioStan); } catch (e) { console.error(e); }
          }
          if (!ratioCons) {
            try { ratioCons = await fetchRatio("Consolidated"); setRatioConsolidated(ratioCons); } catch (e) { console.error(e); }
          }

          // Fetch Standalone and Consolidated Auditors if not already present
          let audStan = audStandalone;
          let audCons = audConsolidated;

          const fetchAud = async (type) => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${companyNameEncoded}/auditors?type=${type}&limit=1000`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };

          try {
            const standData = await fetchAud("Standalone");
            audStan = standData?.auditors || [];
            setAudStandalone(audStan);
          } catch (e) { console.error("Error fetching standalone auditors for PDF:", e); }

          try {
            const consData = await fetchAud("Consolidated");
            audCons = consData?.auditors || [];
            setAudConsolidated(audCons);
          } catch (e) { console.error("Error fetching consolidated auditors for PDF:", e); }

          // Fetch Directors with limit 1000
          let directors = directorsData;
          const fetchDirectors = async () => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/directors-detailed?limit=1000`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };
          try { directors = await fetchDirectors(); setDirectorsData(directors); } catch (e) { console.error(e); }

          // Fetch Shareholding with limit 1000
          let shareholding = shareholdingData;
          const fetchShareholding = async () => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/control-ownership/shareholding?limit=1000`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };
          try { shareholding = await fetchShareholding(); setShareholdingData(shareholding); } catch (e) { console.error(e); }

          // Fetch Security Allotment with limit 1000
          let securityAllotment = securityAllotmentData;
          const fetchSecurityAllotment = async () => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/control-ownership/security-allotment?limit=1000`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };
          try { securityAllotment = await fetchSecurityAllotment(); setSecurityAllotmentData(securityAllotment); } catch (e) { console.error(e); }

          // Fetch Group Structure with limit 1000
          let groupStructure = groupStructureData;
          const fetchGroupStructure = async () => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/control-ownership/group-structure?limit=1000`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };
          try { groupStructure = await fetchGroupStructure(); setGroupStructureData(groupStructure); } catch (e) { console.error(e); }

          // Fetch Overseas Investment with limit 1000
          let overseasInvestment = overseasInvestmentData;
          const fetchOverseasInvestment = async () => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/control-ownership/overseas-direct-investment?limit=1000`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };
          try { overseasInvestment = await fetchOverseasInvestment(); setOverseasInvestmentData(overseasInvestment); } catch (e) { console.error(e); }

          // Fetch Charges with limit 1000 for the report
          let charges = chargesData;
          const fetchChargesLimit = 1000;

          const fetchCharges = async () => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/charges?open_page=1&closed_page=1&limit=${fetchChargesLimit}`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };

          try {
            charges = await fetchCharges();
            setChargesData(charges);
          } catch (e) { console.error("Error fetching charges for PDF:", e); }

          // Fetch Peer Comparison with per_page 1000 for the report
          let peerComparison = peerComparisonData;
          const fetchPeers = async () => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${companyNameEncoded}/peer-comparison?page=1&per_page=100`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };
          try {
            peerComparison = await fetchPeers();
            setPeerComparisonData(peerComparison);
          } catch (e) { console.error("Error fetching peer comparison for PDF:", e); }

          // Fetch Auditor Remarks for the report
          let auditorRemarks = null;
          const fetchAuditorRemarksRepo = async () => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/compliance-details/auditors-remark`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };
          try {
            auditorRemarks = await fetchAuditorRemarksRepo();
            setAuditorRemarksData(auditorRemarks);
          } catch (e) { console.error("Error fetching auditor remarks for PDF:", e); }

          // Fetch Alerts data for the report with size 1000
          let finalAlertsData = alertsData;
          const fetchAlerts = async () => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/alerts?page=1&size=1000`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };
          try {
            finalAlertsData = await fetchAlerts();
          } catch (e) { console.error("Error fetching alerts for PDF:", e); }

          // Fetch Litigation data for the report
          let litigation = litigationData;
          const fetchLitigation = async () => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/litigation?pending_against_page=1&pending_against_size=200&pending_by_page=1&pending_by_size=200&disposed_against_page=1&disposed_against_size=200&disposed_by_page=1&disposed_by_size=200`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            return await response.json();
          };
          try {
            litigation = await fetchLitigation();
            setLitigationData(litigation);
          } catch (e) { console.error("Error fetching litigation for PDF:", e); }

          // Small delay to allow state and UI to settle
          await new Promise(resolve => setTimeout(resolve, 800));

          const { pdf } = await import("@react-pdf/renderer");
          const { default: ReportDocument } = await import("@/components/company/pdf/ReportDocument");

          const blob = await pdf(<ReportDocument
            companyData={companyData}
            alertsData={finalAlertsData}
            directorsData={directors}
            shareholdingData={shareholding}
            securityAllotmentData={securityAllotment}
            groupStructureData={groupStructure}
            overseasInvestmentData={overseasInvestment}
            financialHighlights={financialHighlights}
            revenueProfitTrend={revenueProfitTrend}
            bsStandalone={standalone}
            bsConsolidated={consolidated}
            pnlStandalone={pnlStan}
            pnlConsolidated={pnlCons}
            cfStandalone={cfStan}
            cfConsolidated={cfCons}
            ratioStandalone={ratioStan}
            ratioConsolidated={ratioCons}
            audStandalone={audStan}
            audConsolidated={audCons}
            chargesData={charges}
            peerComparisonData={peerComparison}
            auditorRemarksData={auditorRemarks}
            litigationData={litigation}
          />).toBlob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${companyName || "Company"}_Report.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error generating PDF:", error);
        } finally {
          setIsGeneratingPdf(false);
        }
      };

      generateAndDownloadPdf();
    }
  }, [pdfDownloadTrigger]);


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
        console.log("Error fetching company details:", error);
        setCompanyError(error.message);
      } finally {
        setCompanyLoading(false);
      }
    };

    getCompanyDetails();
  }, [companyName]);

  /* ================= PROFIT & LOSS ================= */

  useEffect(() => {
    if (!companyName) return;

    const fetchPnlData = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/screener/profit-loss?result_type=${pnlViewType}`;

      setPnlLoading(true);
      setPnlError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.detail || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (pnlViewType === "Standalone") setPnlStandalone(data);
        else setPnlConsolidated(data);
      } catch (error) {
        console.error("Error fetching P&L data:", error);
        setPnlError(error.message);
        if (pnlViewType === "Standalone") setPnlStandalone(null);
        else setPnlConsolidated(null);
      } finally {
        setPnlLoading(false);
      }
    };

    fetchPnlData();
  }, [companyName, pnlViewType]);

  /* ================= FINANCIAL HIGHLIGHTS ================= */

  useEffect(() => {
    if (!companyName) return;

    const getFinancialHighlights = async () => {
      try {

        setFinancialLoading(true);
        setFinancialError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/highlights`,
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
          throw new Error(data?.detail ||
            data?.message ||
            `Finanical Highlights Error ${response.status}: ${response.statusText}`);
        }

        setFinancialHighlights(data);
        // console.log(data);

      } catch (error) {
        console.log("Error fetching company's financial highlights:", error);
        setFinancialError(error.message);
      } finally {
        setFinancialLoading(false);
      }
    };

    getFinancialHighlights();
  }, [companyName]);

  /* ================= REVENUE & PROFIT TREND ================= */
  // Used in FinancialHighlightsDetails and FinancialHighlights
  useEffect(() => {
    if (!companyName) return;

    const getRevenueProfitTrend = async () => {
      try {

        setTrendError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/revenue-profit-trend`,
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
          throw new Error(data?.detail || data?.message || `Revenue Profit Trend Error ${response.status}: ${response.statusText}`);
        }


        setRevenueProfitTrend(data);
        // console.log(data);

      } catch (error) {
        console.log("Error fetching company's Revenue Profit Trend:", error);
        setTrendError(error.message);
      } finally {
        setTrendLoading(false);
      }
    };

    getRevenueProfitTrend();
  }, [companyName]);

  /* ================= COMMON DIRECTORSHIP ================= */
  // Used in RelatedCorporates
  useEffect(() => {
    if (!companyName) return;

    const getCommonDirectorship = async () => {
      try {
        setDirectorshipLoading(true);
        setDirectorshipError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(companyName)}/common-directorship`,
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
          throw new Error(`HTTP error of Common Directorship: ${response.status}`);
        }

        setCommonDirectorship(data);
        // console.log(data);

      } catch (error) {
        console.log("Error fetching company's Common Directorship:", error);
        setDirectorshipError(error.message);
      } finally {
        setDirectorshipLoading(false);
      }
    };

    getCommonDirectorship();
  }, [companyName]);

  /* ================= GET CASH FLOW DATA ================= */
  // Used in FinancialHighlightsDetails and FinancialHighlights
  useEffect(() => {
    if (!companyName) return;

    const getCashFlowData = async () => {
      try {
        setCashFlowLoading(true);
        setCashFlowError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/cash-flow?type=${cfType}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Cash flow data not available");
        }

        const data = await response.json();
        if (cfType === "Standalone") setCfStandalone(data);
        else setCfConsolidated(data);
      } catch (error) {
        console.error("Error in cash flow fetch:", error);
        setCashFlowError(error.message);
        if (cfType === "Standalone") setCfStandalone(null);
        else setCfConsolidated(null);
      } finally {
        setCashFlowLoading(false);
      }
    };

    getCashFlowData();
  }, [companyName, cfType]);

  /* ================= COMPANY HIGHLIGHTS (PAGINATED) ================= */
  // Used in CompanyHighlights and OwnershipSection
  useEffect(() => {
    if (!companyName) return;

    const fetchCompanyHighlights = async () => {
      try {
        setHighlightsLoading(true);
        setHighlightsError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(
            companyName
          )}/highlights?page=${highlightsPage}&limit=${highlightsLimit}`,
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

        if (response.status === 500) {
          throw new Error("Server Error");
        }


        if (!response.ok) {
          throw new Error(
            data?.detail ||
            data?.message ||
            `Company Highlights Error ${response.status}: ${response.statusText}`
          );
        }

        setCompanyHighlights(data);

      } catch (err) {
        console.log("Highlights API Error:", err);
        setHighlightsError(err.message);

      } finally {
        setHighlightsLoading(false);
      }
    };

    fetchCompanyHighlights();
  }, [companyName, highlightsPage, highlightsLimit]);


  /* ================= COMPANY CHARGES (PAGINATED) ================= */
  // Used in ChargesPage
  useEffect(() => {
    if (!companyName) return;

    const fetchCharges = async () => {
      try {
        setChargesLoading(true);
        setChargesError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(
            companyName
          )}/charges?open_page=${openPage}&closed_page=${closedPage}&limit=${chargesLimit}`,
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
            `Charges Error ${response.status}: ${response.statusText}`
          );
        }

        setChargesData(data);

      } catch (err) {
        console.log("Charges API Error:", err);
        setChargesError(err.message);
      } finally {
        setChargesLoading(false);
      }
    };

    fetchCharges();
  }, [companyName, openPage, closedPage, chargesLimit]);


  /* ================= DIRECTORS & KMPS ================= */
  // Used in DirectorsSection (which renders DirectorProfile)
  useEffect(() => {
    if (!companyName) return;

    const getDirectors = async () => {
      try {
        setDirectorsLoading(true);
        setDirectorsError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(
            companyName
          )}/directors-detailed`,
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
            `Directors Error ${response.status}: ${response.statusText}`
          );
        }

        setDirectorsData(data);
        console.log("Directors API:", data);
      } catch (error) {
        console.log("Error fetching Directors:", error);
        setDirectorsError(error.message);
      } finally {
        setDirectorsLoading(false);
      }
    };

    getDirectors();
  }, [companyName]);


  /* ================= SECURITY ALLOTMENT DETAILS ================= */
  useEffect(() => {
    if (!companyName) return;

    const getSecurityAllotment = async () => {
      try {
        setSecurityAllotmentLoading(true);
        setSecurityAllotmentError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(
            companyName
          )}/control-ownership/security-allotment`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch Security Allotment");

        const data = await response.json();
        setSecurityAllotmentData(data);
      } catch (error) {
        setSecurityAllotmentError(error.message);
      } finally {
        setSecurityAllotmentLoading(false);
      }
    };

    getSecurityAllotment();
  }, [companyName]);

  /* ================= GROUP STRUCTURE DETAILS ================= */
  useEffect(() => {
    if (!companyName) return;

    const getGroupStructure = async () => {
      try {
        setGroupStructureLoading(true);
        setGroupStructureError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(
            companyName
          )}/control-ownership/group-structure`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch Group Structure");

        const data = await response.json();
        setGroupStructureData(data);
      } catch (error) {
        setGroupStructureError(error.message);
      } finally {
        setGroupStructureLoading(false);
      }
    };

    getGroupStructure();
  }, [companyName]);

  /* ================= OVERSEAS DIRECT INVESTMENT DETAILS ================= */
  useEffect(() => {
    if (!companyName) return;

    const getOverseasInvestment = async () => {
      try {
        setOverseasInvestmentLoading(true);
        setOverseasInvestmentError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(
            companyName
          )}/control-ownership/overseas-direct-investment`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch Overseas Direct Investment");

        const data = await response.json();
        setOverseasInvestmentData(data);
      } catch (error) {
        setOverseasInvestmentError(error.message);
      } finally {
        setOverseasInvestmentLoading(false);
      }
    };

    getOverseasInvestment();
  }, [companyName]);
  // Used in OwnershipSection
  useEffect(() => {
    if (!companyName) return;

    const getShareholdingData = async () => {
      try {
        setShareholdingLoading(true);
        setShareholdingError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(
            companyName
          )}/control-ownership/shareholding`,
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
            `Shareholding Error ${response.status}: ${response.statusText}`
          );
        }

        setShareholdingData(data);
        console.log("Shareholding API:", data);
      } catch (error) {
        console.log("Error fetching Shareholding:", error);
        setShareholdingError(error.message);
      } finally {
        setShareholdingLoading(false);
      }
    };

    getShareholdingData();
  }, [companyName]);

  /* ================= AUDITORS DETAILS ================= */
  // Used in FinancialHighlightsDetails and FinancialHighlights
  useEffect(() => {
    if (!companyName || !audType) return;

    const getAuditorsData = async () => {
      try {
        setAuditorsLoading(true);
        setAuditorsError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/auditors?type=${audType}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const data = await response.json();
        const auds = data?.auditors || [];
        if (audType === "Standalone") setAudStandalone(auds);
        else setAudConsolidated(auds);
      } catch (error) {
        console.log("Error in auditors fetch:", error);
        setAuditorsError(error.message);
        if (audType === "Standalone") setAudStandalone([]);
        else setAudConsolidated([]);
      } finally {
        setAuditorsLoading(false);
      }
    };

    getAuditorsData();
  }, [companyName, audType]);

  /* ================= PEER COMPARISON ================= */
  useEffect(() => {
    if (!companyName) return;

    const fetchPeerComparison = async () => {
      try {
        setPeerComparisonLoading(true);
        setPeerComparisonError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(
            companyName
          )}/peer-comparison?page=${peerPage}&per_page=${peerLimit}`,
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
            `Peer Comparison Error ${response.status}: ${response.statusText}`
          );
        }

        setPeerComparisonData(data);
      } catch (err) {
        console.log("Peer Comparison API Error:", err);
        setPeerComparisonError(err.message);
      } finally {
        setPeerComparisonLoading(false);
      }
    };

    fetchPeerComparison();
  }, [companyName, peerPage, peerLimit]);

  /* ================= LITIGATION DETAILS ================= */

  useEffect(() => {
    if (!companyName) return;

    const fetchLitigationData = async () => {
      try {
        setLitigationLoading(true);
        setLitigationError(null);

        const token = localStorage.getItem("token");
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(
          companyName
        )}/litigation?pending_against_page=${paPage}&pending_against_size=${paSize}&pending_by_page=${pbPage}&pending_by_size=${pbSize}&disposed_against_page=${daPage}&disposed_against_size=${daSize}&disposed_by_page=${dbPage}&disposed_by_size=${dbSize}`;

        const response = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

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
            `Litigation Error ${response.status}: ${response.statusText}`
          );
        }

        setLitigationData(data);
      } catch (err) {
        console.log("Litigation API Error:", err);
        setLitigationError(err.message);
      } finally {
        setLitigationLoading(false);
      }
    };

    fetchLitigationData();
  }, [companyName, paPage, paSize, pbPage, pbSize, daPage, daSize, dbPage, dbSize]);

  /* ================= BALANCE SHEET DETAILS ================= */
  // Used in FinancialHighlightsDetails and FinancialHighlights
  useEffect(() => {
    if (!companyName || !bsType) return;

    const getBalanceSheet = async () => {
      try {
        setBalanceSheetLoading(true);
        setBalanceSheetError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/balance-sheet?type=${bsType}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const data = await response.json();
        if (bsType === "Standalone") setBsStandalone(data);
        else setBsConsolidated(data);
      } catch (error) {
        console.log("Error in balance sheet fetch:", error);
        setBalanceSheetError(error.message);
      } finally {
        setBalanceSheetLoading(false);
      }
    };

    getBalanceSheet();
  }, [companyName, bsType]);

  /* ================= RATIOS DETAILS ================= */
  // Used in FinancialHighlightsDetails and FinancialHighlights
  useEffect(() => {
    if (!companyName || !ratiosType) return;

    const getRatiosData = async () => {
      try {
        setRatiosLoading(true);
        setRatiosError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/ratios?type=${ratiosType}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Ratios data not available");
        }

        const data = await response.json();
        if (ratiosType === "Standalone") setRatioStandalone(data);
        else setRatioConsolidated(data);
      } catch (error) {
        console.error("Error in ratios fetch:", error);
        setRatiosError(error.message);
        if (ratiosType === "Standalone") setRatioStandalone(null);
        else setRatioConsolidated(null);
      } finally {
        setRatiosLoading(false);
      }
    };

    getRatiosData();
  }, [companyName, ratiosType]);


  /* 🔥 Scroll when sidebar sub-item changes */
  useEffect(() => {
    if (activeSection !== "companyDetails") return;

    const map = {
      Summary: overviewRef,
      "Name History": nameHistoryRef,
      "Contact Details": contactRef,
      "Company News": newsRef,
    };

    const targetRef = map[activeSubSection];
    if (targetRef?.current) {
      scrollToElementWithOffset(targetRef.current, 140);
    }

  }, [activeSection, scrollTrigger]);

  return (
    <>
      {activeSection === "companyDetails" && (
        <>
          <div ref={overviewRef} id="Summary">
            <CompanyOverview companyData={companyData} loading={companyLoading} error={companyError} />
            <CompanyDetails companyData={companyData} loading={companyLoading} error={companyError} />
          </div>

          <div ref={nameHistoryRef} id="Name History">
            <NameHistory companyData={companyData} loading={companyLoading} error={companyError} />
          </div>

          <div ref={contactRef} id="Contact Details">
            <ContactAddressSection companyData={companyData} loading={companyLoading} error={companyError} />
          </div>

          <div ref={newsRef} id="Company News">
            <CompanyNews companyName={companyName} />
          </div>
        </>
      )}

      {/* Company Highlights */}
      {activeSection === "companyHighlights" && (
        <>
          <CompanyHighlights
            companyHighlights={companyHighlights}
            page={highlightsPage}
            limit={highlightsLimit}
            loading={highlightsLoading}
            error={highlightsError}
            setPage={setHighlightsPage}
            setLimit={setLimit}
          />
          <FinancialHighlightsDetails
            financialHighlights={financialHighlights}
            revenueProfitTrend={revenueProfitTrend}
            financialLoading={financialLoading}
            financialError={financialError}
            revenueLoading={trendLoading}
            revenueError={trendError}
            pnlApiData={pnlApiData}
            pnlLoading={pnlLoading}
            pnlError={pnlError}
            pnlViewType={pnlViewType}
            setPnlViewType={setPnlViewType}
            auditorsData={auditorsData}
            auditorsLoading={auditorsLoading}
            auditorsError={auditorsError}
            audType={audType}
            setAudType={setAudType}
            balanceSheetData={balanceSheetData}
            balanceSheetLoading={balanceSheetLoading}
            balanceSheetError={balanceSheetError}
            bsType={bsType}
            setBsType={setBsType}
            cashFlowData={cashFlowData}
            cashFlowLoading={cashFlowLoading}
            cashFlowError={cashFlowError}
            cfType={cfType}
            setCfType={setCfType}
            ratiosData={ratiosData}
            ratiosLoading={ratiosLoading}
            ratiosError={ratiosError}
            ratiosType={ratiosType}
            setRatiosType={setRatiosType}
          />
          <CompanyCharts
            businessActivity={peerComparisonData?.business_activity}
            loading={peerComparisonLoading}
            layout="column"
          />
          <ProductDetails />
        </>
      )}

      {/* Financials */}
      {activeSection === "financials" && (
        <FinancialHighlights
          financialHighlights={financialHighlights}
          revenueProfitTrend={revenueProfitTrend}
          financialLoading={financialLoading}
          financialError={financialError}
          revenueLoading={trendLoading}
          revenueError={trendError}
          pnlApiData={pnlApiData}
          pnlLoading={pnlLoading}
          pnlError={pnlError}
          pnlViewType={pnlViewType}
          setPnlViewType={setPnlViewType}
          auditorsData={auditorsData}
          auditorsLoading={auditorsLoading}
          auditorsError={auditorsError}
          audType={audType}
          setAudType={setAudType}
          balanceSheetData={balanceSheetData}
          balanceSheetLoading={balanceSheetLoading}
          balanceSheetError={balanceSheetError}
          bsType={bsType}
          setBsType={setBsType}
          cashFlowData={cashFlowData}
          cashFlowLoading={cashFlowLoading}
          cashFlowError={cashFlowError}
          cfType={cfType}
          setCfType={setCfType}
          ratiosData={ratiosData}
          ratiosLoading={ratiosLoading}
          ratiosError={ratiosError}
          ratiosType={ratiosType}
          setRatiosType={setRatiosType}
        />
      )}

      {/* Directors & KMP */}
      {activeSection === "directorsKmp" && <DirectorsSection directorsData={directorsData} directorsLoading={directorsLoading} directorsError={directorsError} />}

      {/* Control & Ownership */}

      {activeSection === "controlOwnership" && (
        <OwnershipSection
          companyHighlights={companyHighlights}
          highlightsLoading={highlightsLoading}
          highlightsError={highlightsError}
          shareholdingData={shareholdingData}
          shareholdingLoading={shareholdingLoading}
          shareholdingError={shareholdingError}
          securityAllotmentData={securityAllotmentData}
          securityAllotmentLoading={securityAllotmentLoading}
          groupStructureData={groupStructureData}
          groupStructureLoading={groupStructureLoading}
          overseasInvestmentData={overseasInvestmentData}
          overseasInvestmentLoading={overseasInvestmentLoading}
        />
      )}

      {/* Charges */}
      {activeSection === "charges" && (
        <ChargesPage charges={chargesData} loading={chargesLoading}
          error={chargesError}
          openPage={openPage}
          closedPage={closedPage}
          limit={chargesLimit}
          setOpenPage={setOpenPage}
          setClosedPage={setClosedPage}
          setLimit={setChargesLimit} />
      )}

      {/* Peer Comparison */}
      {activeSection === "peerComparison" && (
        <PeerComparison
          data={peerComparisonData}
          loading={peerComparisonLoading}
          error={peerComparisonError}
          page={peerPage}
          perPage={peerLimit}
          setPage={setPeerPage}
          setPerPage={setPeerLimit}
        />
      )}

      {/* Related Corporates */}
      {activeSection === "relatedCorporates" && (
        <RelatedCorporates commonDirectorship={commonDirectorship}
          loading={directorshipLoading}
          error={directorshipError} />
      )}

      {activeSection === "alerts" && <AlertsContainer companyName={companyName} alertsData={alertsData} alertsLoading={alertsLoading} alertsError={alertsError} />}

      {activeSection === "litigation" && (
        <LigilationDetails
          data={litigationData}
          loading={litigationLoading}
          error={litigationError}
          paPage={paPage}
          paSize={paSize}
          setPaPage={setPaPage}
          setPaSize={setPaSize}
          pbPage={pbPage}
          pbSize={pbSize}
          setPbPage={setPbPage}
          setPbSize={setPbSize}
          daPage={daPage}
          daSize={daSize}
          setDaPage={setDaPage}
          setDaSize={setDaSize}
          dbPage={dbPage}
          dbSize={dbSize}
          setDbPage={setDbPage}
          setDbSize={setDbSize}
        />
      )}
      {activeSection === "documents" && <Documents companyName={companyName} />}

      {activeSection === "compliance" && <ComplianceDetails />}
    </>
  );
}
