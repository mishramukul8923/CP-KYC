"use client";
import { useRef, useEffect, useState } from "react";
import { useCompanySection } from "@/components/company/context/CompanySectionContext";
import { scrollToElementWithOffset } from "@/utils/scrollUtils";
import { convertWebpToPng } from "@/utils/imageUtils";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// Static imports (Immediate above-the-fold content)
import CompanyOverview from "@/components/company/overview/CompanyOverview";
import CompanyDetails from "@/components/company/details/CompanyDetails";
import NameHistory from "@/components/company/history/NameHistory";
import ContactAddressSection from "@/components/company/contact/ContactAddressSection";

// Dynamic imports (Heavy / deferred subcomponents)
const CompanyNews = dynamic(() => import("@/components/company/news/CompanyNews"), { ssr: false });
const CompanyHighlights = dynamic(() => import("@/components/company/highlights/CompanyHighlights"), { ssr: false });
const FinancialHighlights = dynamic(() => import("@/components/company/financials/FinancialHighlights"), { ssr: false });
const CompanyCharts = dynamic(() => import("@/components/company/charts/CompanyCharts"), { ssr: false });
const ProductDetails = dynamic(() => import("@/components/company/productDetails/ProductDetails"), { ssr: false });
const DirectorsSection = dynamic(() => import("@/components/company/people/DirectorsSection"), { ssr: false });
const OwnershipSection = dynamic(() => import("@/components/company/ownership/OwnershipSection"), { ssr: false });
const FinancialHighlightsDetails = dynamic(() => import("@/components/company/financialHighlights/FinancialHighlightsDetails"), { ssr: false });
const LigilationDetails = dynamic(() => import("@/components/company/ligilation/LigilationDetails"), { ssr: false });
const Documents = dynamic(() => import("@/components/company/documents/Documents"), { ssr: false });
const ChargesPage = dynamic(() => import("@/components/company/charges/Charges"), { ssr: false });
const PeerComparison = dynamic(() => import("@/components/company/peerComparison/PeerComparison"), { ssr: false });
const RelatedCorporates = dynamic(() => import("@/components/company/relatedCorporates/RelatedCorporates"), { ssr: false });
const ComplianceDetails = dynamic(() => import("@/components/company/complianceDetails/ComplianceDetails"), { ssr: false });
const AlertsContainer = dynamic(() => import("@/components/company/alerts/AlertsContainer"), { ssr: false });

export default function CompanyPage() {
  const {
    activeSection,
    activeSubSection,
    scrollTrigger,
    setCompanyData,
    setCompanyLoading,
    setCompanyError,
    companyData,
    companyLoading,
    companyError
  } = useCompanySection();
  const params = useParams();
  const rawCompanyName = (params.name.replaceAll("-", " ")).toUpperCase(); // from /company/dabur because route is [name]


  const [companyName, setCompanyName] = useState("");


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
  const { alertsData, alertsLoading, alertsError, pdfDownloadTrigger, setIsGeneratingPdf, selectedReportSections } = useCompanySection();
  const lastHandledTrigger = useRef(pdfDownloadTrigger);


  // Auditors Details
  const [auditorsLoading, setAuditorsLoading] = useState(true);
  const [auditorsError, setAuditorsError] = useState(null);
  const [audType, setAudType] = useState("Standalone");
  const [audStandalone, setAudStandalone] = useState(null);
  const [audConsolidated, setAudConsolidated] = useState(null);

  // Derived state for existing components
  const auditorsData = (audType === "Standalone" ? audStandalone : audConsolidated) || [];

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
  const [allotmentPage, setAllotmentPage] = useState(1);
  const [allotmentLimit, setAllotmentLimit] = useState(10);

  const [groupStructureData, setGroupStructureData] = useState(null);
  const [groupStructureLoading, setGroupStructureLoading] = useState(false);
  const [groupStructureError, setGroupStructureError] = useState(null);
  const [groupPage, setGroupPage] = useState(1);
  const [groupLimit, setGroupLimit] = useState(10);

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

  // Section Activity Check Indicators (to prevent initial eager fetching of invisible tabs)
  const isFinancialsActive = activeSection === "companyHighlights" || activeSection === "financials";
  const isOwnershipActive = activeSection === "controlOwnership";
  const isDirectorsActive = activeSection === "directorsKmp";
  const isChargesActive = activeSection === "charges";
  const isPeerActive = activeSection === "peerComparison" || activeSection === "companyHighlights";
  const isRelatedActive = activeSection === "relatedCorporates";
  const isLitigationActive = activeSection === "litigation";
  const isHighlightsActive = activeSection === "companyHighlights" || activeSection === "controlOwnership";

  // Pagination caching Refs
  const lastHighlightsPageRef = useRef(null);
  const lastHighlightsLimitRef = useRef(null);
  const lastChargesOpenPageRef = useRef(null);
  const lastChargesClosedPageRef = useRef(null);
  const lastChargesLimitRef = useRef(null);
  const lastAllotmentPageRef = useRef(null);
  const lastAllotmentLimitRef = useRef(null);
  const lastGroupPageRef = useRef(null);
  const lastGroupLimitRef = useRef(null);
  const lastPeerPageRef = useRef(null);
  const lastPeerLimitRef = useRef(null);
  const lastPaPageRef = useRef(null);
  const lastPaSizeRef = useRef(null);
  const lastPbPageRef = useRef(null);
  const lastPbSizeRef = useRef(null);
  const lastDaPageRef = useRef(null);
  const lastDaSizeRef = useRef(null);
  const lastDbPageRef = useRef(null);
  const lastDbSizeRef = useRef(null);

  /* ================= SET COMPANY NAME ================= */

  useEffect(() => {
    if (!rawCompanyName) return;
    const companyNamee = decodeURIComponent(rawCompanyName);
    setCompanyName(companyNamee);
  }, [rawCompanyName]);

  // Scroll to top when company name changes
  useEffect(() => {
    if (companyName) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [companyName]);

  // Reset all states and pagination refs when company name changes (to prevent stale cached data when navigating to other companies)
  useEffect(() => {
    if (!companyName) return;

    // Clear data states
    setPnlStandalone(null);
    setPnlConsolidated(null);
    setFinancialHighlights(null);
    setRevenueProfitTrend(null);
    setCommonDirectorship(null);
    setCompanyHighlights(null);
    setChargesData(null);
    setDirectorsData(null);
    setSecurityAllotmentData(null);
    setGroupStructureData(null);
    setOverseasInvestmentData(null);
    setShareholdingData(null);
    setAudStandalone(null);
    setAudConsolidated(null);
    setPeerComparisonData(null);
    setLitigationData(null);
    setBsStandalone(null);
    setBsConsolidated(null);
    setRatioStandalone(null);
    setRatioConsolidated(null);

    // Reset loading states
    setPnlLoading(true);
    setFinancialLoading(true);
    setTrendLoading(true);
    setDirectorshipLoading(true);
    setHighlightsLoading(true);
    setChargesLoading(true);
    setDirectorsLoading(true);
    setSecurityAllotmentLoading(false);
    setGroupStructureLoading(false);
    setOverseasInvestmentLoading(false);
    setShareholdingLoading(false);
    setAuditorsLoading(true);
    setPeerComparisonLoading(false);
    setLitigationLoading(false);
    setBalanceSheetLoading(true);
    setCashFlowLoading(false);
    setRatiosLoading(false);

    // Reset pagination states
    setHighlightsPage(1);
    setOpenPage(1);
    setClosedPage(1);
    setAllotmentPage(1);
    setGroupPage(1);
    setPeerPage(1);
    setPaPage(1);
    setPbPage(1);
    setDaPage(1);
    setDbPage(1);

    // Reset pagination refs
    lastHighlightsPageRef.current = null;
    lastHighlightsLimitRef.current = null;
    lastChargesOpenPageRef.current = null;
    lastChargesClosedPageRef.current = null;
    lastChargesLimitRef.current = null;
    lastAllotmentPageRef.current = null;
    lastAllotmentLimitRef.current = null;
    lastGroupPageRef.current = null;
    lastGroupLimitRef.current = null;
    lastPeerPageRef.current = null;
    lastPeerLimitRef.current = null;
    lastPaPageRef.current = null;
    lastPaSizeRef.current = null;
    lastPbPageRef.current = null;
    lastPbSizeRef.current = null;
    lastDaPageRef.current = null;
    lastDaSizeRef.current = null;
    lastDbPageRef.current = null;
    lastDbSizeRef.current = null;

  }, [companyName]);


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

          if (selectedReportSections?.financials) {
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
          }

          // Fetch Standalone and Consolidated P&L if not already present
          let pnlStan = pnlStandalone;
          let pnlCons = pnlConsolidated;

          if (selectedReportSections?.financials) {
            const fetchPNL = async (type) => {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${companyNameEncoded}/profit-loss?type=${type}`,
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
          }

          // Fetch Standalone and Consolidated Cash Flow if not already present
          let cfStan = cfStandalone;
          let cfCons = cfConsolidated;

          if (selectedReportSections?.financials) {
            const fetchCF = async (type) => {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${companyNameEncoded}/cash-flow?type=${type}`,
                { headers: { Authorization: token ? `Bearer ${token}` : "" }, accept: 'application/json' }
              );
              return await response.json();
            };

            if (!cfStan) {
              try { cfStan = await fetchCF("Standalone"); setCfStandalone(cfStan); } catch (e) { console.error(e); }
            }
            if (!cfCons) {
              try { cfCons = await fetchCF("Consolidated"); setCfConsolidated(cfCons); } catch (e) { console.error(e); }
            }
          }

          // Fetch Standalone and Consolidated Ratios if not already present
          let ratioStan = ratioStandalone;
          let ratioCons = ratioConsolidated;

          if (selectedReportSections?.financials) {
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
          }

          // Fetch Standalone and Consolidated Auditors if not already present
          let audStan = audStandalone;
          let audCons = audConsolidated;

          if (selectedReportSections?.financials) {
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
          }

          // Fetch Directors with limit 1000
          let directors = directorsData;
          if (selectedReportSections?.directorsKmp) {
            const fetchDirectors = async () => {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/directors-detailed?limit=1000`,
                { headers: { Authorization: token ? `Bearer ${token}` : "" } }
              );
              return await response.json();
            };
            try { directors = await fetchDirectors(); setDirectorsData(directors); } catch (e) { console.error(e); }
          }

          // Fetch Shareholding with limit 1000
          let shareholding = shareholdingData;
          let securityAllotment = securityAllotmentData;
          let groupStructure = groupStructureData;
          let overseasInvestment = overseasInvestmentData;

          if (selectedReportSections?.controlOwnership) {
            const fetchShareholding = async () => {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/control-ownership/shareholding?limit=1000`,
                { headers: { Authorization: token ? `Bearer ${token}` : "" } }
              );
              return await response.json();
            };
            try { shareholding = await fetchShareholding(); setShareholdingData(shareholding); } catch (e) { console.error(e); }

            // Fetch Security Allotment with limit 1000
            const fetchSecurityAllotment = async () => {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/control-ownership/security-allotment?page=1&per_page=1000`,
                { headers: { Authorization: token ? `Bearer ${token}` : "" } }
              );
              return await response.json();
            };
            try { securityAllotment = await fetchSecurityAllotment(); setSecurityAllotmentData(securityAllotment); } catch (e) { console.error(e); }

            // Fetch Group Structure with limit 1000
            const fetchGroupStructure = async () => {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/control-ownership/group-structure?page=1&per_page=1000`,
                { headers: { Authorization: token ? `Bearer ${token}` : "" } }
              );
              return await response.json();
            };
            try { groupStructure = await fetchGroupStructure(); setGroupStructureData(groupStructure); } catch (e) { console.error(e); }

            // Fetch Overseas Investment with limit 1000
            const fetchOverseasInvestment = async () => {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${companyNameEncoded}/control-ownership/overseas-direct-investment?limit=1000`,
                { headers: { Authorization: token ? `Bearer ${token}` : "" } }
              );
              return await response.json();
            };
            try { overseasInvestment = await fetchOverseasInvestment(); setOverseasInvestmentData(overseasInvestment); } catch (e) { console.error(e); }
          }

          // Fetch Charges with limit 1000 for the report
          let charges = chargesData;
          if (selectedReportSections?.charges) {
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
          }

          // Fetch Peer Comparison with per_page 1000 for the report
          let peerComparison = peerComparisonData;
          if (selectedReportSections?.peerComparison) {
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
          }

          // Fetch Auditor Remarks for the report
          let auditorRemarks = null;
          if (selectedReportSections?.complianceDetails) {
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
          }

          // Fetch Alerts data for the report with size 1000
          let finalAlertsData = alertsData;
          if (selectedReportSections?.alerts) {
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
          }

          // Fetch Litigation data for the report
          let litigation = litigationData;
          if (selectedReportSections?.litigation) {
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
          }

          // Small delay to allow state and UI to settle
          await new Promise(resolve => setTimeout(resolve, 800));

          // Convert WebP logo to PNG if necessary before passing to PDF component
          const originalLogoUrl = companyData?.header?.logo_url;
          const pngLogoUrl = await convertWebpToPng(originalLogoUrl);

          const processedCompanyData = {
            ...companyData,
            header: {
              ...companyData?.header,
              logo_url: pngLogoUrl
            }
          };

          const { pdf } = await import("@react-pdf/renderer");
          const { default: ReportDocument } = await import("@/components/company/pdf/ReportDocument");

          const blob = await pdf(<ReportDocument
            selectedSections={selectedReportSections}
            companyData={processedCompanyData}
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
  }, [companyName, setCompanyData, setCompanyLoading, setCompanyError]);

  /* ================= PROFIT & LOSS ================= */

  useEffect(() => {
    if (!companyName || !isFinancialsActive) return;
    if (pnlViewType === "Standalone" && pnlStandalone) return;
    if (pnlViewType === "Consolidated" && pnlConsolidated) return;

    const fetchPnlData = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/profit-loss?type=${pnlViewType}`;

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
  }, [companyName, pnlViewType, isFinancialsActive, pnlStandalone, pnlConsolidated]);

  /* ================= FINANCIAL HIGHLIGHTS ================= */

  useEffect(() => {
    if (!companyName || !isFinancialsActive) return;
    if (financialHighlights) return;

    const getFinancialHighlights = async () => {
      try {

        setFinancialLoading(true);
        setFinancialError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/highlights`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : ""
              , accept: 'application/json'
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
  }, [companyName, isFinancialsActive, financialHighlights]);

  /* ================= REVENUE & PROFIT TREND ================= */
  // Used in FinancialHighlightsDetails and FinancialHighlights
  useEffect(() => {
    if (!companyName || !isFinancialsActive) return;
    if (revenueProfitTrend) return;

    const getRevenueProfitTrend = async () => {
      try {

        setTrendError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/revenue-profit-trend`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : ""
              , accept: 'application/json'
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
  }, [companyName, isFinancialsActive, revenueProfitTrend]);

  /* ================= COMMON DIRECTORSHIP ================= */
  // Used in RelatedCorporates
  useEffect(() => {
    if (!companyName || !isRelatedActive) return;
    if (commonDirectorship) return;

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
  }, [companyName, isRelatedActive, commonDirectorship]);

  /* ================= GET CASH FLOW DATA ================= */
  // Used in FinancialHighlightsDetails and FinancialHighlights
  useEffect(() => {
    if (!companyName || !isFinancialsActive) return;
    if (cfType === "Standalone" && cfStandalone) return;
    if (cfType === "Consolidated" && cfConsolidated) return;

    const getCashFlowData = async () => {
      try {
        setCashFlowLoading(true);
        setCashFlowError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/cash-flow?type=${cfType}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "", accept: 'application/json'
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
  }, [companyName, cfType, isFinancialsActive, cfStandalone, cfConsolidated]);

  /* ================= COMPANY HIGHLIGHTS (PAGINATED) ================= */
  // Used in CompanyHighlights and OwnershipSection
  useEffect(() => {
    if (!companyName || !isHighlightsActive) return;
    if (companyHighlights && lastHighlightsPageRef.current === highlightsPage && lastHighlightsLimitRef.current === highlightsLimit) return;

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
              Authorization: token ? `Bearer ${token}` : ""
              , accept: 'application/json'
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
        lastHighlightsPageRef.current = highlightsPage;
        lastHighlightsLimitRef.current = highlightsLimit;
      } catch (err) {
        console.log("Highlights API Error:", err);
        setHighlightsError(err.message);

      } finally {
        setHighlightsLoading(false);
      }
    };

    fetchCompanyHighlights();
  }, [companyName, highlightsPage, highlightsLimit, isHighlightsActive, companyHighlights]);


  /* ================= COMPANY CHARGES (PAGINATED) ================= */
  // Used in ChargesPage
  useEffect(() => {
    if (!companyName || !isChargesActive) return;
    if (chargesData &&
        lastChargesOpenPageRef.current === openPage &&
        lastChargesClosedPageRef.current === closedPage &&
        lastChargesLimitRef.current === chargesLimit) return;

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
        lastChargesOpenPageRef.current = openPage;
        lastChargesClosedPageRef.current = closedPage;
        lastChargesLimitRef.current = chargesLimit;
      } catch (err) {
        console.log("Charges API Error:", err);
        setChargesError(err.message);
      } finally {
        setChargesLoading(false);
      }
    };

    fetchCharges();
  }, [companyName, openPage, closedPage, chargesLimit, isChargesActive, chargesData]);


  /* ================= DIRECTORS & KMPS ================= */
  // Used in DirectorsSection (which renders DirectorProfile)
  useEffect(() => {
    if (!companyName || !isDirectorsActive) return;
    if (directorsData) return;

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
  }, [companyName, isDirectorsActive, directorsData]);


  /* ================= SECURITY ALLOTMENT DETAILS ================= */
  useEffect(() => {
    if (!companyName || !isOwnershipActive) return;
    if (securityAllotmentData &&
        lastAllotmentPageRef.current === allotmentPage &&
        lastAllotmentLimitRef.current === allotmentLimit) return;

    const getSecurityAllotment = async () => {
      try {
        setSecurityAllotmentLoading(true);
        setSecurityAllotmentError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(
            companyName
          )}/control-ownership/security-allotment?page=${allotmentPage}&per_page=${allotmentLimit}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch Security Allotment");

        const data = await response.json();
        setSecurityAllotmentData(data);
        lastAllotmentPageRef.current = allotmentPage;
        lastAllotmentLimitRef.current = allotmentLimit;
      } catch (error) {
        setSecurityAllotmentError(error.message);
      } finally {
        setSecurityAllotmentLoading(false);
      }
    };

    getSecurityAllotment();
  }, [companyName, allotmentPage, allotmentLimit, isOwnershipActive, securityAllotmentData]);

  /* ================= GROUP STRUCTURE DETAILS ================= */
  useEffect(() => {
    if (!companyName || !isOwnershipActive) return;
    if (groupStructureData &&
        lastGroupPageRef.current === groupPage &&
        lastGroupLimitRef.current === groupLimit) return;

    const getGroupStructure = async () => {
      try {
        setGroupStructureLoading(true);
        setGroupStructureError(null);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/${encodeURIComponent(
            companyName
          )}/control-ownership/group-structure?page=${groupPage}&per_page=${groupLimit}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch Group Structure");

        const data = await response.json();
        setGroupStructureData(data);
        lastGroupPageRef.current = groupPage;
        lastGroupLimitRef.current = groupLimit;
      } catch (error) {
        setGroupStructureError(error.message);
      } finally {
        setGroupStructureLoading(false);
      }
    };

    getGroupStructure();
  }, [companyName, groupPage, groupLimit, isOwnershipActive, groupStructureData]);

  /* ================= OVERSEAS DIRECT INVESTMENT DETAILS ================= */
  useEffect(() => {
    if (!companyName || !isOwnershipActive) return;
    if (overseasInvestmentData) return;

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
  }, [companyName, isOwnershipActive, overseasInvestmentData]);
  // Used in OwnershipSection
  useEffect(() => {
    if (!companyName || !isOwnershipActive) return;
    if (shareholdingData) return;

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
  }, [companyName, isOwnershipActive, shareholdingData]);

  /* ================= AUDITORS DETAILS ================= */
  // Used in FinancialHighlightsDetails and FinancialHighlights
  useEffect(() => {
    if (!companyName || !audType || !isFinancialsActive) return;
    if (audType === "Standalone" && audStandalone !== null) return;
    if (audType === "Consolidated" && audConsolidated !== null) return;

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
  }, [companyName, audType, isFinancialsActive, audStandalone, audConsolidated]);

  /* ================= PEER COMPARISON ================= */
  useEffect(() => {
    if (!companyName || !isPeerActive) return;
    if (peerComparisonData &&
        lastPeerPageRef.current === peerPage &&
        lastPeerLimitRef.current === peerLimit) return;

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
        lastPeerPageRef.current = peerPage;
        lastPeerLimitRef.current = peerLimit;
      } catch (err) {
        console.log("Peer Comparison API Error:", err);
        setPeerComparisonError(err.message);
      } finally {
        setPeerComparisonLoading(false);
      }
    };

    fetchPeerComparison();
  }, [companyName, peerPage, peerLimit, isPeerActive, peerComparisonData]);

  /* ================= LITIGATION DETAILS ================= */

  useEffect(() => {
    if (!companyName || !isLitigationActive) return;
    if (litigationData &&
        lastPaPageRef.current === paPage &&
        lastPaSizeRef.current === paSize &&
        lastPbPageRef.current === pbPage &&
        lastPbSizeRef.current === pbSize &&
        lastDaPageRef.current === daPage &&
        lastDaSizeRef.current === daSize &&
        lastDbPageRef.current === dbPage &&
        lastDbSizeRef.current === dbSize) return;

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
        lastPaPageRef.current = paPage;
        lastPaSizeRef.current = paSize;
        lastPbPageRef.current = pbPage;
        lastPbSizeRef.current = pbSize;
        lastDaPageRef.current = daPage;
        lastDaSizeRef.current = daSize;
        lastDbPageRef.current = dbPage;
        lastDbSizeRef.current = dbSize;
      } catch (err) {
        console.log("Litigation API Error:", err);
        setLitigationError(err.message);
      } finally {
        setLitigationLoading(false);
      }
    };

    fetchLitigationData();
  }, [companyName, paPage, paSize, pbPage, pbSize, daPage, daSize, dbPage, dbSize, isLitigationActive, litigationData]);

  /* ================= BALANCE SHEET DETAILS ================= */
  // Used in FinancialHighlightsDetails and FinancialHighlights
  useEffect(() => {
    if (!companyName || !bsType || !isFinancialsActive) return;
    if (bsType === "Standalone" && bsStandalone) return;
    if (bsType === "Consolidated" && bsConsolidated) return;

    const getBalanceSheet = async () => {
      try {
        setBalanceSheetLoading(true);
        setBalanceSheetError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/balance-sheet?type=${bsType}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : ""
              , accept: 'application/json'
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
  }, [companyName, bsType, isFinancialsActive, bsStandalone, bsConsolidated]);

  /* ================= RATIOS DETAILS ================= */
  // Used in FinancialHighlightsDetails and FinancialHighlights
  useEffect(() => {
    if (!companyName || !ratiosType || !isFinancialsActive) return;
    if (ratiosType === "Standalone" && ratioStandalone) return;
    if (ratiosType === "Consolidated" && ratioConsolidated) return;

    const getRatiosData = async () => {
      try {
        setRatiosLoading(true);
        setRatiosError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/financials/${encodeURIComponent(companyName)}/ratios?type=${ratiosType}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : ""
              , accept: 'application/json'
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
  }, [companyName, ratiosType, isFinancialsActive, ratioStandalone, ratioConsolidated]);


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
        <div id="companyHighlights">
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
        </div>
      )}

      {/* Financials */}
      {activeSection === "financials" && (
        <div id="financials">
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
        </div>
      )}

      {/* Directors & KMP */}
      {activeSection === "directorsKmp" && (
        <div id="directorsKmp">
          <DirectorsSection directorsData={directorsData} directorsLoading={directorsLoading} directorsError={directorsError} />
        </div>
      )}

      {/* Control & Ownership */}
      {activeSection === "controlOwnership" && (
        <div id="controlOwnership">
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
            groupPage={groupPage}
            setGroupPage={setGroupPage}
            groupLimit={groupLimit}
            setGroupLimit={setGroupLimit}
            allotmentPage={allotmentPage}
            setAllotmentPage={setAllotmentPage}
            allotmentLimit={allotmentLimit}
            setAllotmentLimit={setAllotmentLimit}
            overseasInvestmentData={overseasInvestmentData}
            overseasInvestmentLoading={overseasInvestmentLoading}
          />
        </div>
      )}

      {/* Charges */}
      {activeSection === "charges" && (
        <div id="charges">
          <ChargesPage charges={chargesData} loading={chargesLoading}
            error={chargesError}
            openPage={openPage}
            closedPage={closedPage}
            limit={chargesLimit}
            setOpenPage={setOpenPage}
            setClosedPage={setClosedPage}
            setLimit={setChargesLimit} />
        </div>
      )}

      {/* Peer Comparison */}
      {activeSection === "peerComparison" && (
        <div id="peerComparison">
          <PeerComparison
            data={peerComparisonData}
            loading={peerComparisonLoading}
            error={peerComparisonError}
            page={peerPage}
            perPage={peerLimit}
            setPage={setPeerPage}
            setPerPage={setPeerLimit}
          />
        </div>
      )}

      {/* Related Companies */}
      {activeSection === "relatedCorporates" && (
        <div id="relatedCorporates">
          <RelatedCorporates commonDirectorship={commonDirectorship}
            loading={directorshipLoading}
            error={directorshipError} />
        </div>
      )}

      {activeSection === "alerts" && <AlertsContainer companyName={companyName} alertsData={alertsData} alertsLoading={alertsLoading} alertsError={alertsError} />}

      {activeSection === "litigation" && (
        <div id="litigation">
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
        </div>
      )}
      {activeSection === "documents" && <Documents companyName={companyName} />}

      {activeSection === "compliance" && (
        <div id="compliance">
          <ComplianceDetails />
        </div>
      )}
    </>
  );
}
