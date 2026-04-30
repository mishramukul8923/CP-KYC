import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link, Svg, Rect, G, Line, Path } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  letterheadContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -10,
  },
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  watermarkImage: {
    width: 600,
    opacity: 0.1,
    transform: 'rotate(-45deg)',
  },
  section: {
    marginBottom: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  heading2: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: '#041e42',
    color: '#ffffff',
    padding: 6,
    borderRadius: 2,
  },
  paragraph: {
    marginBottom: 5,
    lineHeight: 1,
    textAlign: 'justify',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cellLabel: {
    width: '30%',
    fontFamily: 'Helvetica-Bold',
  },
  cellValue: {
    width: '70%',
  },
  // Table Styles
  table: {
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 20,
    alignItems: 'stretch',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 4,
    backgroundColor: '#f4f4f4',
  },
  tableCol: {
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 4,
    minHeight: 20,
  },
  tableCellHeader: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  tableCell: {
    fontSize: 8,
  },
  // Litigation KPI Styles
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  kpiCard: {
    width: '24%',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  kpiLabel: {
    fontSize: 7,
    color: '#4b5563',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#041e42',
  },
  variant1: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  variant2: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  variant3: { backgroundColor: '#fff7ed', borderColor: '#fed7aa' },
  variant4: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },

  // Premium Header Styles
  premiumHeaderContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    paddingBottom: 10,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerInfoRight: {
    flex: 1,
    marginLeft: 15,
  },
  companyNameLarge: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 6,
  },
  industryListingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  industryLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  industryTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 9,
    color: '#374151',
    marginLeft: 6,
  },
  listingBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 6,
  },
  listingText: {
    color: '#10b981',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  metaIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  metaText: {
    fontSize: 9,
    color: '#6b7280',
    marginLeft: 5,
  },
  websiteText: {
    fontSize: 9,
    color: '#2563eb',
    textDecoration: 'underline',
    marginLeft: 5,
  },
  alertBadgeContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertBadge: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 2,
  },
  alertText: {
    fontSize: 9,
    color: '#f97316',
    fontFamily: 'Helvetica-Bold',
  },
  socialIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
  },
  socialIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  // Shareholding Premium Styles
  shareholdingCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statVerticalLine: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
  },
  statLabelSmall: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValueBold: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  chartHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f1f1',
  },
  chartHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#041e42',
    marginHorizontal: 10,
    textTransform: 'uppercase',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 14,
    flexDirection: 'row',
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  progressPromoter: {
    backgroundColor: '#93c5fd',
    height: '100%',
  },
  progressNonPromoter: {
    backgroundColor: '#d8b4fe',
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 8,
    color: '#4b5563',
  },
  legendValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginLeft: 4,
  },
});

export const ReportDocument = ({
  companyData,
  alertsData,
  directorsData,
  shareholdingData,
  securityAllotmentData,
  groupStructureData,
  overseasInvestmentData,
  financialHighlights,
  revenueProfitTrend,
  bsStandalone,
  bsConsolidated,
  pnlStandalone,
  pnlConsolidated,
  cfStandalone,
  cfConsolidated,
  ratioStandalone,
  ratioConsolidated,
  audStandalone,
  audConsolidated,
  chargesData,
  peerComparisonData,
  auditorRemarksData,
  litigationData
}) => {
  const ci = companyData?.company_information || {};
  const contact = companyData?.contact_details || {};
  const about = companyData?.about?.description || "No description available.";
  const headerInfo = companyData?.header || {};

  const alerts = alertsData?.regulatory_alerts || [];
  const statutoryAlerts = alertsData?.statutory_compliance || [];
  const auditorAlerts = alertsData?.auditors || [];
  const litigationAlerts = alertsData?.litigations?.detailed_cases?.items || [];
  const litigationSummaryCards = alertsData?.litigations?.summary_cards || {};
  const litigationSummaryTable = alertsData?.litigations?.summary_table || [];

  const allDirectors = directorsData?.directors || [];
  const currentDirectors = allDirectors.filter(d => !d.cessation_date || d.cessation_date === '-');
  const pastDirectors = allDirectors.filter(d => d.cessation_date && d.cessation_date !== '-');

  const renderCompactHeader = () => (
    <View style={{
      position: 'absolute',
      top: 10,
      left: 30,
      right: 30,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f1f1',
      paddingBottom: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100
    }} fixed render={({ pageNumber }) => (
      pageNumber > 1 ? (
        <>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#041e42' }}>{ci.legal_name || "Company Report"}</Text>
          <Image src="/icons/pdfLogocompanyWiki.png" style={{ width: 50 }} />
        </>
      ) : null
    )} />
  );

  const renderDirectorTable = (directorsList, tableTitle) => {
    if (directorsList.length === 0) return null;
    return (
      <View style={styles.section} wrap={false}>
        <Text style={styles.heading2}>{tableTitle}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow} fixed>
            <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>DIN/PAN</Text></View>
            <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Name</Text></View>
            <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Designation</Text></View>
            <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Category</Text></View>
            <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Appt Date</Text></View>
          </View>
          {directorsList.map((d, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(d.din_pan)}</Text></View>
              <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{formatValue(d.name)} {d.is_kmp ? '(KMP)' : ''}</Text></View>
              <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(d.designation)}</Text></View>
              <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{formatValue(d.category)}</Text></View>
              <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{formatValue(d.appointment_date)}</Text></View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const formatValue = (text) => {
    if (text === null || text === undefined || String(text).trim() === "" || text === "-") return "-";
    const str = String(text);
    // Only insert zero-width spaces for long strings that DON'T contain spaces and AREN'T emails
    if (!str.includes(' ') && !str.includes('@') && str.length > 20) {
      // Don't break strings that look like formatted numbers/currency (digits, commas, dots)
      if (/^[\d,.\s]+$/.test(str)) return str;
      return str.replace(/([^\s]{15})(?=[^\s])/g, '$1\u200B');
    }
    return str;
  };

  const cleanEmail = (email) => {
    if (!email || email === "-") return "-";
    return email
      .replace(/\[\s*d\s*ot\s*\]/gi, '.')
      .replace(/\[\s*dot\s*\]/gi, '.')
      .replace(/\[\s*at\s*\]/gi, '@')
      .replace(/\s*\[at\]\s*/gi, '@')
      .replace(/\s*\[dot\]\s*/gi, '.')
      .replace(/\[\s*at\s*\]/gi, '@')
      .trim();
  };

  const renderPremiumHeader = () => {
    const alertsCount = alertsData?.regulatory_alerts?.length || 0;
    const foundedYear = ci.incorporation_date ? ci.incorporation_date.split('/').pop() : "-";
    const zipCode = contact.registered_address ? contact.registered_address.split(',').pop().trim() : "-";

    const nseSymbol = ci.nse_symbol;
    const bseSymbol = ci.bse_symbol;
    const hasNse = nseSymbol && nseSymbol !== "-";
    const hasBse = bseSymbol && bseSymbol !== "-";

    let listingStatusText = "-";
    if (hasNse && hasBse) listingStatusText = "NSE & BSE";
    else if (hasNse) listingStatusText = "NSE";
    else if (hasBse) listingStatusText = "BSE";

    return (
      <View style={styles.premiumHeaderContainer}>
        {/* Logo */}
        <View style={styles.logoCircle}>
          <Image
            src={(headerInfo.logo_url && headerInfo.logo_url !== "-" && headerInfo.logo_url !== "null")
              ? headerInfo.logo_url
              : "/fallbackimagelogoforpdf.png"}
            style={{
              width: (headerInfo.logo_url && headerInfo.logo_url !== "-" && headerInfo.logo_url !== "null") ? 50 : 120,
              height: (headerInfo.logo_url && headerInfo.logo_url !== "-" && headerInfo.logo_url !== "null") ? 50 : 120
            }}
          />
        </View>

        {/* Company Info */}
        <View style={styles.headerInfoRight}>
          {/* Line 1: Company Name */}
          <Text style={styles.companyNameLarge}>{formatValue(ci.legal_name)}</Text>

          {/* Line 2: Industry and Listing Status */}
          <View style={styles.industryListingRow}>
            <Text style={styles.industryLabel}>Industry :</Text>
            <View style={styles.industryTag}><Text>{formatValue(ci.industry)}</Text></View>

            <Text style={[styles.industryLabel, { marginLeft: 7 }]}>Listing Status :</Text>
            <View style={styles.listingBadge}><Text style={styles.listingText}>{listingStatusText}</Text></View>
          </View>

          {/* Line 3: Founded, Classification, Pincode */}
          <View style={[styles.metaIconRow, { marginTop: 2 }]}>
            <View style={styles.metaItem}>
              <Svg width="12" height="12" viewBox="0 0 24 24"><Path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" fill="#9ca3af" /></Svg>
              <Text style={styles.metaText}>Founded {foundedYear}</Text>
            </View>
            <View style={[styles.metaItem, { marginLeft: 1 }]}>
              <Svg width="12" height="12" viewBox="0 0 24 24"><Path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" fill="#9ca3af" /></Svg>
              <Text style={styles.metaText}>{formatValue(ci.classification)}</Text>
            </View>
            <View style={[styles.metaItem, { marginLeft: 1 }]}>
              <Svg width="12" height="12" viewBox="0 0 24 24"><Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#9ca3af" /></Svg>
              <Text style={styles.metaText}>{zipCode}</Text>
            </View>
          </View>

          {/* Line 4: Website and Social Media Icons */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <View style={styles.metaItem}>
              <Svg width="12" height="12" viewBox="0 0 24 24"><Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#2563eb" /></Svg>
              <Link src={`https://${contact.website}`}><Text style={[styles.websiteText, { marginRight: 20 }]}>{formatValue(contact.website)}</Text></Link>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -1 }}>
              {(contact.social_media || []).map((url, i) => {
                let iconSrc = null;
                if (url.includes('twitter.com') || url.includes('x.com')) iconSrc = "/twitterforpdf.png";
                else if (url.includes('facebook.com')) iconSrc = "/facebookforpdf.png";
                else if (url.includes('linkedin.com')) iconSrc = "/linkforpdf.png";
                else if (url.includes('instagram.com')) iconSrc = "/instaforpdf.png";
                else if (url.includes('youtube.com')) iconSrc = "/youtubeforpdf.png";

                if (!iconSrc) return null;

                return (
                  <Link key={i} src={url}>
                    <Image src={iconSrc} style={{ width: 14, height: 14, marginRight: 3 }} />
                  </Link>
                );
              })}
            </View>
          </View>
        </View>

        {/* <View style={styles.alertBadgeContainer}>
          <View style={styles.alertBadge}>
            <Text style={styles.alertText}>🛡️ {alertsCount} Regulatory Issues</Text>
          </View>
          <Text style={{ fontSize: 10, color: '#041E42', fontFamily: 'Helvetica-Bold', textDecoration: 'underline' }}>View All Alert ↓</Text>
        </View> */}
      </View>
    );
  };

  const getPiePath = (cx, cy, r, startAngle, endAngle) => {
    const x1 = cx + r * Math.cos(Math.PI * (startAngle - 90) / 180);
    const y1 = cy + r * Math.sin(Math.PI * (startAngle - 90) / 180);
    const x2 = cx + r * Math.cos(Math.PI * (endAngle - 90) / 180);
    const y2 = cy + r * Math.sin(Math.PI * (endAngle - 90) / 180);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const renderDynamicTable = (dataArray, title) => {
    if (!dataArray || dataArray.length === 0) return null;
    const headers = Object.keys(dataArray[0]).filter(k => typeof dataArray[0][k] !== "object");
    if (headers.length === 0) return null;

    // Calculate smart column weights based on content length
    const colWeights = headers.map(h => {
      let maxLen = h.length;
      dataArray.forEach(row => {
        const valStr = String(row[h] || "");
        if (valStr.length > maxLen) maxLen = valStr.length;
      });
      return maxLen;
    });

    const totalWeight = colWeights.reduce((a, b) => a + b, 0) || 1;
    const calculatedWidths = colWeights.map(w => {
      let percent = (w / totalWeight) * 100;
      if (percent < 12) percent = 12; // Minimum col width
      if (percent > 45) percent = 45; // Maximum col width limit
      return percent;
    });

    // Normalize widths so they sum to exactly 100
    const adjustedTotal = calculatedWidths.reduce((sum, w) => sum + w, 0) || 1;
    const colWidths = calculatedWidths.map(w => `${(w / adjustedTotal) * 100}%`);

    return (
      <View style={[styles.section, { marginTop: 15 }]}>
        <Text style={styles.heading2}>{title}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow} fixed>
            {headers.map((h, i) => (
              <View key={i} style={[styles.tableColHeader, { width: colWidths[i] }]}>
                <Text style={styles.tableCellHeader}>{formatValue(h.replace(/_/g, ' ').toUpperCase())}</Text>
              </View>
            ))}
          </View>
          {dataArray.map((row, rowIndex) => (
            <View style={styles.tableRow} key={rowIndex}>
              {headers.map((h, colIndex) => (
                <View key={colIndex} style={[styles.tableCol, { width: colWidths[colIndex] }]}>
                  <Text style={styles.tableCell}>{formatValue(row[h])}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderDictTable = (dictObj, title, keys = null, marginTop = 15) => {
    if (!dictObj) return null;
    const flatKeys = keys || Object.keys(dictObj).filter(k => typeof dictObj[k] !== 'object' || dictObj[k] === null);
    if (flatKeys.length === 0) return null;

    return (
      <View style={[styles.section, { marginTop: marginTop }]}>
        <Text style={styles.heading2}>{title}</Text>
        <View style={styles.table}>
          {flatKeys.map((k, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>{formatValue(k.replace(/_/g, ' ').toUpperCase())}</Text></View>
              <View style={[styles.tableCol, { width: '70%' }]}><Text style={styles.tableCell}>{formatValue(dictObj[k])}</Text></View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderBalanceSheetTable = (bsData, reportType) => {
    if (!bsData || !bsData.periods) return null;

    // Filter out metadata and "setAttributes"
    const years = bsData.periods.filter(p => p !== "setAttributes");
    if (years.length === 0) return null;

    const sections = [
      { label: "Shareholder's Fund", data: bsData.shareholders_fund },
      { label: "Non Current Liabilities", data: bsData.non_current_liabilities },
      { label: "Current Liabilities", data: bsData.current_liabilities },
      { label: "Non Current Assets", data: bsData.non_current_assets },
      { label: "Current Assets", data: bsData.current_assets },
    ];

    // Adjust widths for 12+ columns
    const particularsWidth = 18; // 18% for labels
    const yearColWidth = (100 - particularsWidth) / years.length;

    return (
      <View style={{ marginTop: 10 }}>
        <Text style={styles.heading2}>
          Balance Sheet - {reportType} ({bsData.currency || "Values in Cr."})
        </Text>

        <View style={styles.table}>
          {/* Header Row - Years */}
          <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]} fixed>
            <View style={[styles.tableColHeader, { width: `${particularsWidth}%` }]}>
              <Text style={[styles.tableCellHeader, { fontSize: 7 }]}>Particulars</Text>
            </View>
            {years.map((year, i) => (
              <View key={i} style={[styles.tableColHeader, { width: `${yearColWidth}%` }]}>
                <Text style={[styles.tableCellHeader, { textAlign: 'center', fontSize: 7 }]}>{year}</Text>
              </View>
            ))}
          </View>

          {/* Data Sections */}
          {sections.map((section, idx) => {
            if (!section.data) return null;
            const rows = Object.keys(section.data);

            return (
              <React.Fragment key={idx}>
                {/* Section Header */}
                <View style={[styles.tableRow, { backgroundColor: '#e5e7eb' }]}>
                  <View style={[styles.tableCol, { width: '100%', borderRightWidth: 0 }]}>
                    <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold', fontSize: 8 }]}>{section.label}</Text>
                  </View>
                </View>

                {/* Section Rows */}
                {rows.map((rowKey, rowIdx) => {
                  const rowData = section.data[rowKey];
                  if (!rowData || !rowData.values) return null;

                  return (
                    <View style={styles.tableRow} key={`${idx}-${rowIdx}`}>
                      <View style={[styles.tableCol, { width: `${particularsWidth}%` }]}>
                        <Text style={[styles.tableCell, { textTransform: 'capitalize', fontSize: 7 }]}>
                          {rowKey.replace(/_/g, ' ')}
                        </Text>
                      </View>
                      {years.map((year, i) => (
                        <View key={i} style={[styles.tableCol, { width: `${yearColWidth}%`, textAlign: 'center' }]}>
                          <Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(rowData.values[year])}</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  };

  const renderPnlTable = (pnlData, reportType) => {
    if (!pnlData || !pnlData.periods) return null;

    // Filter out metadata, setAttributes, TTM, and isExpandable
    const ignoreKeys = ["setAttributes", "TTM", "isExpandable"];
    const years = pnlData.periods.filter(p => !ignoreKeys.includes(p));
    if (years.length === 0) return null;

    const sections = [
      { label: "Revenue", data: pnlData.revenue },
      { label: "Expenses", data: pnlData.expenses },
      { label: "Exceptional & Extra Ordinary Items", data: pnlData.exceptional },
      { label: "Tax Expense", data: pnlData.tax_expense },
    ];

    const isTotalRows = ["Total Revenue", "Total Expense", "Ebitda", "Profit Before Tax", "Profit/Loss"];

    const particularsWidth = 18;
    const yearColWidth = (100 - particularsWidth) / years.length;

    return (
      <View style={{ marginTop: 15 }}>
        <Text style={styles.heading2}>
          Profit & Loss Statement - {reportType} ({pnlData.currency || "Values in Cr."})
        </Text>

        <View style={styles.table}>
          {/* Header Row - Years */}
          <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]} fixed>
            <View style={[styles.tableColHeader, { width: `${particularsWidth}%` }]}>
              <Text style={[styles.tableCellHeader, { fontSize: 7 }]}>Particulars</Text>
            </View>
            {years.map((year, i) => (
              <View key={i} style={[styles.tableColHeader, { width: `${yearColWidth}%` }]}>
                <Text style={[styles.tableCellHeader, { textAlign: 'center', fontSize: 7 }]}>{year}</Text>
              </View>
            ))}
          </View>

          {/* Data Sections */}
          {sections.map((section, idx) => {
            if (!section.data) return null;
            const rows = Object.keys(section.data);

            return (
              <React.Fragment key={idx}>
                {/* Section Header */}
                <View style={[styles.tableRow, { backgroundColor: '#f9fafb' }]}>
                  <View style={[styles.tableCol, { width: '100%', borderRightWidth: 0 }]}>
                    <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#4b5563' }]}>{section.label}</Text>
                  </View>
                </View>

                {/* Section Rows */}
                {rows.map((rowKey, rowIdx) => {
                  const rowData = section.data[rowKey];
                  if (!rowData || !rowData.values) return null;

                  const isTotal = isTotalRows.includes(rowKey);

                  return (
                    <View style={[styles.tableRow, isTotal && { backgroundColor: '#f3f4f6' }]} key={`${idx}-${rowIdx}`}>
                      <View style={[styles.tableCol, { width: `${particularsWidth}%` }]}>
                        <Text style={[
                          styles.tableCell,
                          { fontSize: 7 },
                          isTotal && { fontFamily: 'Helvetica-Bold' }
                        ]}>
                          {rowKey}
                        </Text>
                      </View>
                      {years.map((year, i) => (
                        <View key={i} style={[styles.tableCol, { width: `${yearColWidth}%`, textAlign: 'center' }]}>
                          <Text style={[
                            styles.tableCell,
                            { fontSize: 7 },
                            isTotal && { fontFamily: 'Helvetica-Bold' }
                          ]}>{formatValue(rowData.values[year])}</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  };

  const renderCashFlowTable = (cfData, reportType) => {
    if (!cfData || !cfData.periods) return null;

    const ignoreKeys = ["setAttributes"];
    const years = cfData.periods.filter(p => !ignoreKeys.includes(p));
    if (years.length === 0) return null;

    const cfRows = [
      { label: "Cash from Operating Activity", path: "cash_from_operating_activity" },
      { label: "Cash from Investing Activity", path: "cash_from_investing_activity" },
      { label: "Cash from Financing Activity", path: "cash_from_financing_activity" },
      { type: "total", label: "Net Cash Flow", path: "net_cash_flow" },
      { label: "Free Cash Flow", path: "free_cash_flow" }
    ];

    const particularsWidth = 18;
    const yearColWidth = (100 - particularsWidth) / years.length;

    return (
      <View style={{ marginTop: 15 }}>
        <Text style={styles.heading2}>
          Cash Flow Statement - {reportType} ({cfData.currency || "Values in Cr."})
        </Text>

        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]} fixed>
            <View style={[styles.tableColHeader, { width: `${particularsWidth}%` }]}>
              <Text style={[styles.tableCellHeader, { fontSize: 7 }]}>Particulars</Text>
            </View>
            {years.map((year, i) => (
              <View key={i} style={[styles.tableColHeader, { width: `${yearColWidth}%` }]}>
                <Text style={[styles.tableCellHeader, { textAlign: 'center', fontSize: 7 }]}>{year}</Text>
              </View>
            ))}
          </View>

          {/* Specified Rows */}
          {cfRows.map((row, idx) => {
            const rowData = cfData.summary?.[row.path];
            if (!rowData || !rowData.values) return null;

            const isTotal = row.type === "total";

            return (
              <View style={[styles.tableRow, isTotal && { backgroundColor: '#f3f4f6' }]} key={idx}>
                <View style={[styles.tableCol, { width: `${particularsWidth}%` }]}>
                  <Text style={[styles.tableCell, { fontSize: 7 }, isTotal && { fontFamily: 'Helvetica-Bold' }]}>
                    {row.label}
                  </Text>
                </View>
                {years.map((year, i) => (
                  <View key={i} style={[styles.tableCol, { width: `${yearColWidth}%`, textAlign: 'center' }]}>
                    <Text style={[styles.tableCell, { fontSize: 7 }, isTotal && { fontFamily: 'Helvetica-Bold' }]}>
                      {formatValue(rowData.values[year])}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderRatiosTable = (ratiosData, reportType) => {
    if (!ratiosData || !ratiosData.periods) return null;

    const ignoreKeys = ["setAttributes"];
    const years = ratiosData.periods.filter(p => !ignoreKeys.includes(p));
    if (years.length === 0) return null;

    const sections = [
      { label: "Profitability Ratios", data: ratiosData.profitability },
      { label: "Efficiency Ratios", data: ratiosData.efficiency },
      { label: "Leverage/Solvency Ratios", data: ratiosData.leverage_solvency },
      { label: "Liquidity Ratios", data: ratiosData.liquidity },
      { label: "Valuation Ratios", data: ratiosData.valuation },
      { label: "Growth Metrics", data: ratiosData.growth_metrics },
    ];

    const particularsWidth = 18;
    const yearColWidth = (100 - particularsWidth) / years.length;

    return (
      <View style={{ marginTop: 15 }}>
        <Text style={styles.heading2}>
          Financial Ratios - {reportType} ({ratiosData.currency || "Values in Cr."})
        </Text>

        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]} fixed>
            <View style={[styles.tableColHeader, { width: `${particularsWidth}%` }]}>
              <Text style={[styles.tableCellHeader, { fontSize: 7 }]}>Particulars</Text>
            </View>
            {years.map((year, i) => (
              <View key={i} style={[styles.tableColHeader, { width: `${yearColWidth}%` }]}>
                <Text style={[styles.tableCellHeader, { textAlign: 'center', fontSize: 7 }]}>{year}</Text>
              </View>
            ))}
          </View>

          {/* Ratio Sections */}
          {sections.map((section, idx) => {
            if (!section.data || section.data.length === 0) return null;

            return (
              <React.Fragment key={idx}>
                {/* Section Header */}
                <View style={[styles.tableRow, { backgroundColor: '#f9fafb' }]}>
                  <View style={[styles.tableCol, { width: '100%', borderRightWidth: 0 }]}>
                    <Text style={[styles.tableCell, { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#4b5563' }]}>{section.label}</Text>
                  </View>
                </View>

                {/* Section Rows */}
                {section.data.map((row, rowIdx) => {
                  if (!row || !row.values) return null;

                  return (
                    <View style={styles.tableRow} key={`${idx}-${rowIdx}`}>
                      <View style={[styles.tableCol, { width: `${particularsWidth}%` }]}>
                        <Text style={[styles.tableCell, { fontSize: 7 }]}>
                          {row.particular_name}
                        </Text>
                      </View>
                      {years.map((year, i) => (
                        <View key={i} style={[styles.tableCol, { width: `${yearColWidth}%`, textAlign: 'center' }]}>
                          <Text style={[styles.tableCell, { fontSize: 7 }]}>
                            {formatValue(row.values[year])}
                          </Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  };

  const renderAuditorsTable = (audData, reportType) => {
    if (!audData || audData.length === 0) return null;

    const columns = [
      { label: "Particulars", key: "auditor_type", width: 15 },
      { label: "Membership Number", key: "membership", width: 15 },
      { label: "Firm Registration number", key: "registration_no", width: 20 },
      { label: "Name of auditor firm", key: "firm_name", width: 25 },
      { label: "PAN", key: "pan", width: 15 },
      { label: "Period", key: "period", width: 10 },
    ];

    return (
      <View style={{ marginTop: 15 }}>
        <Text style={styles.heading2}>
          Auditors Details - {reportType}
        </Text>

        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]} fixed>
            {columns.map((col, i) => (
              <View key={i} style={[styles.tableColHeader, { width: `${col.width}%` }]}>
                <Text style={[styles.tableCellHeader, { fontSize: 7 }]}>{col.label}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {audData.map((row, idx) => (
            <View style={styles.tableRow} key={idx}>
              {columns.map((col, i) => (
                <View key={i} style={[styles.tableCol, { width: `${col.width}%` }]}>
                  <Text style={[styles.tableCell, { fontSize: 7 }]}>
                    {formatValue(row[col.key])}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPeerComparisonSection = (data) => {
    if (!data) return null;

    const businessActivity = data.business_activity || {};
    const activityRows = businessActivity.table_rows || [];
    const turnoverChart = data.peer_turnover_chart || {};
    const peerItems = turnoverChart.items || [];
    const peerCompanies = data.peer_companies?.items || [];

    // Colors similar to web UI
    const colors = ["#D8B4FE", "#BBF7D8", "#93C5FD", "#FDBA74", "#F9A8D4", "#A5F3FC", "#C7D2FE", "#FEF08A"];

    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={[styles.title, { fontSize: 16, marginBottom: 0 }]}>Peer Comparison & Business Activity</Text>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 8, color: '#6b7280' }}>Source: {formatValue(data.source)}</Text>
            <Text style={{ fontSize: 8, color: '#6b7280' }}>Updated: {formatValue(data.last_updated)}</Text>
          </View>
        </View>

        {/* 1. Business Activity Analysis */}
        <View style={[styles.section, { padding: 10, backgroundColor: '#f9fafb', borderRadius: 4 }]}>
          <Text style={styles.heading2}>
            Business Activity Analysis
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 8, color: '#6b7280' }}>Financial Year:</Text>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{formatValue(businessActivity.financial_year)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 8, color: '#6b7280' }}>Total Turnover:</Text>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#10b981' }}>{formatValue(businessActivity.total_turnover)} Cr.</Text>
            </View>
          </View>

          {/* Pie Chart & Vertical Legend Row */}
          <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
            {/* Pie Chart SVG */}
            <View style={{ width: '40%', height: 120, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width="120" height="120" viewBox="0 0 100 100">
                {(() => {
                  let currentAngle = 0;
                  const segments = businessActivity.chart_segments || [];
                  return segments.map((seg, i) => {
                    const pct = parseFloat(seg.turnover_percentage) || 0;
                    if (pct <= 0) return null;
                    const angleSize = (pct / 100) * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angleSize;
                    currentAngle += angleSize;
                    return (
                      <Path
                        key={i}
                        d={getPiePath(50, 50, 45, startAngle, endAngle)}
                        fill={colors[i % colors.length]}
                      />
                    );
                  });
                })()}
              </Svg>
            </View>

            {/* Vertical Legend */}
            <View style={{ width: '60%', paddingLeft: 20 }}>
              {(businessActivity.chart_segments || []).map((seg, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, borderBottom: '1 solid #f1f1f1', paddingBottom: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 6, height: 6, backgroundColor: colors[i % colors.length], marginRight: 4, borderRadius: 1 }} />
                    <Text style={{ fontSize: 7, color: '#444' }}>{seg.segment_name}</Text>
                  </View>
                  <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold' }}>{seg.turnover_percentage}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Activity Table */}
          <View style={styles.table}>
            <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
              <View style={[styles.tableColHeader, { width: '60%' }]}><Text style={styles.tableCellHeader}>Business Activity</Text></View>
              <View style={[styles.tableColHeader, { width: '20%', textAlign: 'center' }]}><Text style={styles.tableCellHeader}>Turnover %</Text></View>
              <View style={[styles.tableColHeader, { width: '20%', textAlign: 'right' }]}><Text style={styles.tableCellHeader}>Turnover</Text></View>
            </View>
            {activityRows.map((row, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '60%' }]}><Text style={styles.tableCell}>{formatValue(row.business_activity)}</Text></View>
                <View style={[styles.tableCol, { width: '20%', textAlign: 'center' }]}><Text style={styles.tableCell}>{formatValue(row.turnover_percentage)}</Text></View>
                <View style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}><Text style={styles.tableCell}>{formatValue(row.turnover)}</Text></View>
              </View>
            ))}
          </View>
        </View>

        {/* 2. Peer Turnover Comparison (Vertical Bar Chart) */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.heading2}>Peer Turnover Comparison ({formatValue(turnoverChart.metric_unit)})</Text>
          <View style={{ padding: 15, border: '1 solid #e5e7eb', borderRadius: 4, backgroundColor: '#fff' }}>
            <Svg width="100%" height="160" viewBox="0 0 500 160">
              {/* Horizontal Grid lines */}
              {[0, 25, 50, 75, 100].map((level, i) => (
                <G key={i}>
                  <Line x1="40" y1={120 - (level * 1.2)} x2="480" y2={120 - (level * 1.2)} stroke="#f1f1f1" strokeWidth="1" strokeDasharray="4 4" />
                  <Text x="5" y={120 - (level * 1.2) + 3} style={{ fontSize: 6, fill: '#999' }}>{`${level}%`}</Text>
                </G>
              ))}

              {/* Bars */}
              {(() => {
                const maxVal = Math.max(...peerItems.map(p => p.turnover_numeric || 1));
                const chartWidth = 440;
                const barWidth = 30;
                const gap = (chartWidth - (peerItems.length * barWidth)) / (peerItems.length + 1);

                return peerItems.map((item, idx) => {
                  const h = ((item.turnover_numeric || 0) / maxVal) * 100; // max height 100
                  const x = 50 + (idx * (barWidth + gap));
                  const y = 120 - h;

                  return (
                    <G key={idx}>
                      {/* Bar */}
                      <Rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={h}
                        fill={item.is_selected_company ? "#3b82f6" : "#93c5fd"}
                        rx="4"
                      />
                      {/* Value label on top */}
                      <Text x={x + barWidth / 2} y={y - 5} style={{ fontSize: 6, fill: '#666', textAnchor: 'middle' }}>
                        {item.turnover}
                      </Text>
                      {/* Company name at bottom (handled carefully) */}
                      {(() => {
                        const words = item.company_name.split(' ');
                        return words.slice(0, 3).map((word, wIdx) => (
                          <Text key={wIdx} x={x + barWidth / 2} y={130 + (wIdx * 7)} style={{ fontSize: 6, fill: item.is_selected_company ? '#27272a' : '#6b7280', textAnchor: 'middle', fontFamily: item.is_selected_company ? 'Helvetica-Bold' : 'Helvetica' }}>
                            {word}
                          </Text>
                        ));
                      })()}
                    </G>
                  );
                });
              })()}

              {/* Baseline */}
              <Line x1="40" y1="120" x2="480" y2="120" stroke="#e5e7eb" strokeWidth="1" />
            </Svg>
          </View>
        </View>

        {/* 3. Peer Comparison Table */}
        <View style={styles.section} break>
          <Text style={styles.heading2}>Peer Financial Comparison Matrix</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
              <View style={[styles.tableColHeader, { width: '23%' }]}><Text style={styles.tableCellHeader}>Company Name</Text></View>
              <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableCellHeader}>CMP</Text></View>
              <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableCellHeader}>MCap (Cr)</Text></View>
              <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableCellHeader}>P/E</Text></View>
              <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableCellHeader}>Ind. P/E</Text></View>
              <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableCellHeader}>Rev Gr. %</Text></View>
              <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableCellHeader}>Prf Gr. %</Text></View>
              <View style={[styles.tableColHeader, { width: '11%' }]}><Text style={styles.tableCellHeader}>ROCE %</Text></View>
            </View>
            {peerCompanies.map((row, i) => (
              <View key={i} style={[styles.tableRow, row.is_selected_company && { backgroundColor: '#eff6ff' }]}>
                <View style={[styles.tableCol, { width: '23%' }]}><Text style={[styles.tableCell, row.is_selected_company && { fontFamily: 'Helvetica-Bold' }]}>{formatValue(row.company_name)}</Text></View>
                <View style={[styles.tableCol, { width: '11%', textAlign: 'right' }]}><Text style={styles.tableCell}>{formatValue(row.cmp)}</Text></View>
                <View style={[styles.tableCol, { width: '11%', textAlign: 'right' }]}><Text style={styles.tableCell}>{formatValue(row.market_cap)}</Text></View>
                <View style={[styles.tableCol, { width: '11%', textAlign: 'right' }]}><Text style={styles.tableCell}>{formatValue(row.pe)}</Text></View>
                <View style={[styles.tableCol, { width: '11%', textAlign: 'right' }]}><Text style={styles.tableCell}>{formatValue(row.industry_pe)}</Text></View>
                <View style={[styles.tableCol, { width: '11%', textAlign: 'right' }]}><Text style={styles.tableCell}>{formatValue(row.sales_growth)}</Text></View>
                <View style={[styles.tableCol, { width: '11%', textAlign: 'right' }]}><Text style={styles.tableCell}>{formatValue(row.profit_growth)}</Text></View>
                <View style={[styles.tableCol, { width: '11%', textAlign: 'right' }]}><Text style={styles.tableCell}>{formatValue(row.roce)}</Text></View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderComplianceTable = (data, title, fallback = null) => {
    if (!data && !fallback) return null;

    let columns = [];
    let rows = [];
    const tableTitle = data?.table_title || title;

    if (data) {
      columns = data.financial_year_columns || [];
      rows = data.rows || [];
    } else if (fallback) {
      columns = fallback.years.map(y => ({ key: String(y), label: String(y) }));
      rows = fallback.rows.map(r => ({
        row_label: r.label,
        financial_year_cells: fallback.years.reduce((acc, year, idx) => {
          acc[String(year)] = { value: r.values[idx] };
          return acc;
        }, {})
      }));
    }

    if (columns.length === 0) return null;

    // First column is always 'Particulars' at 35%, rest distributed
    const particularsWidth = 35;
    const yearColWidth = (100 - particularsWidth) / columns.length;

    return (
      <View style={[styles.section, { marginTop: 10 }]} wrap={false}>
        <Text style={styles.heading2}>{tableTitle}</Text>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
            <View style={[styles.tableColHeader, { width: `${particularsWidth}%` }]}>
              <Text style={styles.tableCellHeader}>Financial Year</Text>
            </View>
            {columns.map((col, i) => (
              <View key={i} style={[styles.tableColHeader, { width: `${yearColWidth}%`, textAlign: 'center' }]}>
                <Text style={styles.tableCellHeader}>{col.label}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {rows.map((row, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={[styles.tableCol, { width: `${particularsWidth}%` }]}>
                <Text style={styles.tableCell}>{formatValue(row.row_label)}</Text>
              </View>
              {columns.map((col, i) => (
                <View key={i} style={[styles.tableCol, { width: `${yearColWidth}%`, textAlign: 'center' }]}>
                  <Text style={styles.tableCell}>{formatValue(row.financial_year_cells?.[col.key]?.value)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderComplianceSection = (data) => {
    // Fallback data structure to use when API is not present (for CARO)
    const caroFallback = {
      years: [2025, 2024, 2023, 2022, 2021, 2020],
      rows: [{ label: "Qualified Report / CARO Remark", values: ["-", "-", "-", "-", "-", "-"] }]
    };

    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={[styles.title, { fontSize: 18, marginBottom: 0 }]}>Compliance Details</Text>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 8, color: '#6b7280' }}>Source: {formatValue(data?.source || "MCA")}</Text>
            <Text style={{ fontSize: 8, color: '#6b7280' }}>Updated: {formatValue(data?.last_updated)}</Text>
          </View>
        </View>

        {/* 1. Auditors' Remarks */}
        {renderComplianceTable(data?.auditors_remarks_standalone_table, "Auditors' Remarks Standalone")}
        {renderComplianceTable(data?.auditors_remarks_consolidated_table, "Auditors' Remarks Consolidated")}

        {/* 2. CARO Tables (Using placeholders/mapping comments as requested) */}
        {/* Placeholder: Once API provides data, pass it as first argument e.g., data?.caro_standalone_table */}
        {renderComplianceTable(null, "CARO Standalone", caroFallback)}
        {renderComplianceTable(null, "CARO Consolidated", caroFallback)}
      </View>
    );
  };

  const renderLitigationKPIs = (kpis) => {
    if (!kpis || kpis.length === 0) return null;
    return (
      <View style={styles.kpiContainer}>
        {kpis.slice(0, 4).map((kpi, idx) => (
          <View
            key={idx}
            style={[styles.kpiCard, styles[`variant${idx + 1}`]]}
          >
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
            <Text style={styles.kpiValue}>{kpi.count}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderLitigationTable = (tableData) => {
    if (!tableData) return null;
    const columns = tableData.columns || [];
    const rows = tableData.tableData?.rows || [];
    if (columns.length === 0) return null;

    // Distribute width based on total columns
    const totalCols = columns.length;
    const colWidth = `${100 / totalCols}%`;

    return (
      <View style={[styles.section, { marginTop: 10 }]}>
        <Text style={styles.heading2}>
          {tableData.tableTitle || "Litigation Table"}
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: '#f9fafb' }]}>
            {columns.map((col, i) => (
              <View key={i} style={[styles.tableColHeader, { width: colWidth }]}>
                <Text style={styles.tableCellHeader}>{col.label}</Text>
              </View>
            ))}
          </View>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <View style={styles.tableRow} key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <View key={colIndex} style={[styles.tableCol, { width: colWidth }]}>
                    <Text style={styles.tableCell}>{formatValue(row[col.key])}</Text>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '100%', alignItems: 'center' }]}>
                <Text style={styles.tableCell}>No data available for this section.</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderLitigationSection = (data) => {
    if (!data) return null;
    const kpis = data.summaryCardsSection?.cards || [];
    const sections = [
      { key: "pendingCasesFiledAgainstCompanyTable" },
      { key: "pendingCasesFiledByCompanyTable" },
      { key: "disposedCasesFiledAgainstCompanyTable" },
      { key: "disposedCasesFiledByCompanyTable" }
    ];

    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <Text style={[styles.title, { fontSize: 18, marginBottom: 0 }]}>Litigation Details</Text>
        </View>

        {renderLitigationKPIs(kpis)}

        {sections.map((sec, idx) => (
          <View key={idx} wrap={false}>
            {renderLitigationTable(data[sec.key])}
          </View>
        ))}
      </View>
    );
  };

  const renderNameHistoryTable = (history) => {
    if (!history || history.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.heading2}>Name History</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: '#f9fafb' }]}>
            <View style={[styles.tableColHeader, { width: '70%' }]}><Text style={styles.tableCellHeader}>Name</Text></View>
            <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Till Date</Text></View>
          </View>
          {history.map((h, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={[styles.tableCol, { width: '70%' }]}><Text style={styles.tableCell}>{formatValue(h.name)}</Text></View>
              <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{formatValue(h.till_date)}</Text></View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderChargesSection = (charges) => {
    if (!charges) return null;

    const summary = charges.summary || {};
    const stats = charges.statistics || {};
    const openItems = charges.open_charges?.items || [];
    const closedItems = charges.closed_charges?.items || [];

    return (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.title}>Charges Information</Text>

        {/* Status Summary */}
        <View style={styles.kpiContainer}>
          {[
            { label: "Open Charges", value: summary.open_count },
            { label: "Open Charges Amount", value: summary.open_amount },
            { label: "Closed Charges", value: summary.closed_count },
            { label: "Closed Charges Amount", value: summary.closed_amount }
          ].map((item, i) => (
            <View key={i} style={[styles.kpiCard, styles[`variant${(i % 4) + 1}`]]}>
              <Text style={styles.kpiLabel}>{item.label}</Text>
              <Text style={styles.kpiValue}>{formatValue(item.value)}</Text>
            </View>
          ))}
        </View>

        {/* General Statistics */}
        <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#f9fafb', borderRadius: 4 }}>
          {[
            { label: "Total Open Charges", value: stats.total_open_amount },
            { label: "Total Satisfied Charges", value: stats.total_satisfied_amount },
            { label: "Total No. of Lender(s)", value: stats.total_lenders },
            { label: "Top Lender", value: stats.top_lender },
            { label: "Last Charge Activity", value: stats.last_charge_activity },
            { label: "Last Charge Date", value: stats.last_charge_date },
            { label: "Last Charge Amount", value: stats.last_charge_amount }
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottom: '1pt solid #e5e7eb' }}>
              <Text style={{ fontSize: 8, color: '#374151' }}>{item.label}</Text>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold' }}>{formatValue(item.value)}</Text>
            </View>
          ))}
        </View>

        {/* Open Charges Table */}
        <Text style={styles.heading2}>Open Charges</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]} fixed>
            {["Charge ID", "Lender", "Amount (Cr.)", "Creation Date", "Modification Date"].map((h, i) => (
              <View key={i} style={[styles.tableColHeader, { width: i === 1 ? '35%' : '16.25%' }]}>
                <Text style={[styles.tableCellHeader, { fontSize: 7 }]}>{h}</Text>
              </View>
            ))}
          </View>
          {openItems.length > 0 ? openItems.map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={[styles.tableCol, { width: '16.25%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.charge_id)}</Text></View>
              <View style={[styles.tableCol, { width: '35%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.lender)}</Text></View>
              <View style={[styles.tableCol, { width: '16.25%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.amount_cr)}</Text></View>
              <View style={[styles.tableCol, { width: '16.25%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.creation_date)}</Text></View>
              <View style={[styles.tableCol, { width: '16.25%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.modification_date)}</Text></View>
            </View>
          )) : (
            <View style={styles.tableRow}><Text style={[styles.tableCell, { fontSize: 7, textAlign: 'center', width: '100%', padding: 10 }]}>No open charges found</Text></View>
          )}
        </View>

        {/* Closed Charges Table */}
        <Text style={styles.heading2}>Closed Charges</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]} fixed>
            {["Charge ID", "Lender", "Amount (Cr.)", "Creation", "Modification", "Satisfaction"].map((h, i) => (
              <View key={i} style={[styles.tableColHeader, { width: i === 1 ? '30%' : '14%' }]}>
                <Text style={[styles.tableCellHeader, { fontSize: 7 }]}>{h}</Text>
              </View>
            ))}
          </View>
          {closedItems.length > 0 ? closedItems.map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={[styles.tableCol, { width: '14%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.charge_id)}</Text></View>
              <View style={[styles.tableCol, { width: '30%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.lender)}</Text></View>
              <View style={[styles.tableCol, { width: '14%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.amount_cr)}</Text></View>
              <View style={[styles.tableCol, { width: '14%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.creation_date)}</Text></View>
              <View style={[styles.tableCol, { width: '14%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.modification_date)}</Text></View>
              <View style={[styles.tableCol, { width: '14%' }]}><Text style={[styles.tableCell, { fontSize: 7 }]}>{formatValue(item.satisfaction_date)}</Text></View>
            </View>
          )) : (
            <View style={styles.tableRow}><Text style={[styles.tableCell, { fontSize: 7, textAlign: 'center', width: '100%', padding: 10 }]}>No closed charges found</Text></View>
          )}
        </View>
      </View>
    );
  };

  const renderBarChart = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return null;

    // Ensure all values are numeric
    const cleanData = dataArray.map(d => ({
      ...d,
      revenue_cr: Number(d.revenue_cr) || 0,
      profit_cr: Number(d.profit_cr) || 0
    }));

    const width = 500;
    const height = 180;
    const padding = { top: 20, right: 20, bottom: 30, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find max value for scaling
    const maxVal = Math.max(...cleanData.map(d => Math.max(d.revenue_cr, d.profit_cr)), 1);
    const scale = chartHeight / maxVal;

    const barGroupWidth = chartWidth / cleanData.length;
    const barWidth = barGroupWidth * 0.35;

    // Generate Y-axis ticks (5 ticks)
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(p => Math.round(maxVal * p));

    return (
      <View style={[styles.section, { marginTop: 10, alignItems: 'center' }]}>
        <Text style={[styles.title, { fontSize: 16, marginBottom: 0 }]}>Revenue & Profit Trend Chart (Cr)</Text>
        <Svg width={width} height={height}>
          {/* Grid Lines */}
          {ticks.map((t, i) => {
            const yPos = height - padding.bottom - (t * scale);
            if (isNaN(yPos)) return null;
            return (
              <G key={`grid-${i}`}>
                <Line
                  x1={padding.left}
                  y1={yPos}
                  x2={width - padding.right}
                  y2={yPos}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <Text
                  x={padding.left - 5}
                  y={yPos + 3}
                  style={{ fontSize: 8, textAnchor: 'end', fill: '#6b7280' }}
                >
                  {t.toLocaleString()}
                </Text>
              </G>
            );
          })}

          {/* Bars */}
          {cleanData.map((d, i) => {
            const xBase = padding.left + (i * barGroupWidth) + (barGroupWidth * 0.15);
            const revHeight = (d.revenue_cr || 0) * scale;
            const profHeight = (d.profit_cr || 0) * scale;

            return (
              <G key={`bars-${i}`}>
                {/* Revenue Bar (Blue) */}
                <Rect
                  x={xBase}
                  y={height - padding.bottom - revHeight}
                  width={barWidth}
                  height={revHeight}
                  fill="#3b82f6"
                />
                {/* Profit Bar (Green) */}
                <Rect
                  x={xBase + barWidth + 2}
                  y={height - padding.bottom - profHeight}
                  width={barWidth}
                  height={profHeight}
                  fill="#22c55e"
                />
                {/* Year Label */}
                <Text
                  x={xBase + barWidth}
                  y={height - padding.bottom + 12}
                  style={{ fontSize: 7, textAnchor: 'middle', fill: '#374151' }}
                >
                  {d.year?.replace('Mar ', '')}
                </Text>
              </G>
            );
          })}

          {/* Axes */}
          <Line
            x1={padding.left} y1={height - padding.bottom}
            x2={width - padding.right} y2={height - padding.bottom}
            stroke="#9ca3af" strokeWidth={1}
          />
          <Line
            x1={padding.left} y1={padding.top}
            x2={padding.left} y2={height - padding.bottom}
            stroke="#9ca3af" strokeWidth={1}
          />
        </Svg>

        {/* Legend */}
        <View style={{ flexDirection: 'row', marginTop: 10, gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 10, height: 10, backgroundColor: '#3b82f6' }} />
            <Text style={{ fontSize: 8 }}>Revenue</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 10, height: 10, backgroundColor: '#22c55e' }} />
            <Text style={{ fontSize: 8 }}>Profit</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Document>
      {/* Premium First Page */}
      <Page size="A4" style={styles.page}>
        {renderCompactHeader()}
        <View style={[styles.letterheadContainer, { borderBottomWidth: 1, borderBottomColor: '#f1f1f1', paddingBottom: 15, width: '100%' }]}>
          <Image src="/icons/pdfLogocompanyWiki.png" style={{ width: 100 }} />
        </View>
        {renderPremiumHeader()}

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.heading2}>About Company</Text>
          <Text style={[styles.paragraph, { textAlign: 'justify' }]}>
            {formatValue(companyData?.about?.description)}
          </Text>
        </View>

        {/* Company Information */}
        <View style={styles.section}>
          <Text style={styles.heading2}>Company Information</Text>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>CIN:</Text>
            <Text style={styles.cellValue}>{formatValue(ci.cin)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>PAN:</Text>
            <Text style={styles.cellValue}>{formatValue(ci.pan)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>ROC Code:</Text>
            <Text style={styles.cellValue}>{formatValue(ci.roc_code)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Registration No:</Text>
            <Text style={styles.cellValue}>{formatValue(ci.company_no)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Authorized Capital:</Text>
            <Text style={styles.cellValue}>{formatValue(ci.authorised_capital)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Paid Up Capital:</Text>
            <Text style={styles.cellValue}>{formatValue(ci.paid_up_capital)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Incorporation Date:</Text>
            <Text style={styles.cellValue}>{formatValue(ci.incorporation_date)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Listing Status:</Text>
            <Text style={styles.cellValue}>{formatValue(ci.listing_status)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Stock Symbol:</Text>
            <Text style={styles.cellValue}>{formatValue(ci.stock_symbol)}</Text>
          </View>
        </View>

        {/* Name History */}
        {renderNameHistoryTable(companyData?.name_history)}

        {/* Contact Details */}
        <View style={styles.section}>
          <Text style={styles.heading2}>Contact Details</Text>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Address:</Text>
            <Text style={styles.cellValue}>{formatValue(contact.registered_address)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Email:</Text>
            <Text style={styles.cellValue}>{formatValue(cleanEmail(contact.email_address))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Telephone:</Text>
            <Text style={styles.cellValue}>{formatValue(contact.telephone)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellLabel}>Website:</Text>
            <Text style={styles.cellValue}>{formatValue(contact.website)}</Text>
          </View>
        </View>

        {/* Footer Info */}
        <View style={{ marginTop: 'auto', borderTopWidth: 1, borderTopColor: '#f1f1f1', paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 8, color: '#9ca3af' }}>Source: {formatValue(headerInfo.source)}</Text>
            <Text style={{ fontSize: 8, color: '#9ca3af' }}>Last Updated: {formatValue(headerInfo.last_updated)}</Text>
          </View>
        </View>
      </Page>

      {/* Alerts Page (Moved to BEFORE Directors) */}
      {(alerts.length > 0 || statutoryAlerts.length > 0 || auditorAlerts.length > 0 || litigationAlerts.length > 0) && (
        <Page size="A4" style={styles.page}>
          {renderCompactHeader()}
          {/* Regulatory Alerts */}
          {alerts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.heading2}>Regulatory Alerts</Text>
              <View style={styles.table}>
                <View style={styles.tableRow} fixed>
                  <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Regulator</Text></View>
                  <View style={[styles.tableColHeader, { width: '35%' }]}><Text style={styles.tableCellHeader}>Charges</Text></View>
                  <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Action Taken</Text></View>
                  <View style={[styles.tableColHeader, { width: '10%' }]}><Text style={styles.tableCellHeader}>Severity</Text></View>
                  <View style={[styles.tableColHeader, { width: '10%' }]}><Text style={styles.tableCellHeader}>Source</Text></View>
                </View>
                {alerts.map((alert, index) => (
                  <View style={styles.tableRow} key={index} wrap={false}>
                    <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{formatValue(alert.regulator)}</Text></View>
                    <View style={[styles.tableCol, { width: '35%' }]}><Text style={styles.tableCell}>{formatValue(alert.regulatory_charges)}</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{formatValue(alert.regulatory_action)}</Text></View>
                    <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{formatValue(alert.severity)}</Text></View>
                    <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{formatValue(alert.source)}</Text></View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Statutory Compliance Alerts */}
          {statutoryAlerts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.heading2}>Statutory Compliance Alerts</Text>
              <View style={styles.table}>
                <View style={styles.tableRow} fixed>
                  <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Area</Text></View>
                  <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Description</Text></View>
                  <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Authority</Text></View>
                  <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Date</Text></View>
                  <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.tableCellHeader}>Status</Text></View>
                </View>
                {statutoryAlerts.map((item, index) => (
                  <View style={styles.tableRow} key={index} wrap={false}>
                    <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(item.compliance_area)}</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{formatValue(item.description)}</Text></View>
                    <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(item.authority)}</Text></View>
                    <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{formatValue(item.effective_date)}</Text></View>
                    <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.tableCell}>{formatValue(item.status)}</Text></View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Auditor Alerts */}
          {auditorAlerts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.heading2}>Auditor Alerts</Text>
              <View style={styles.table}>
                <View style={styles.tableRow} fixed>
                  <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Auditor Name</Text></View>
                  <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Appt Date</Text></View>
                  <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Remarks</Text></View>
                  <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Status</Text></View>
                </View>
                {auditorAlerts.map((item, index) => (
                  <View style={styles.tableRow} key={index} wrap={false}>
                    <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{formatValue(item.auditor_name)}</Text></View>
                    <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(item.appointment_date)}</Text></View>
                    <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{formatValue(item.remarks)}</Text></View>
                    <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(item.status)}</Text></View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Litigation Alerts (Complete UI) */}
          {(litigationAlerts.length > 0 || Object.keys(litigationSummaryCards).length > 0 || litigationSummaryTable.length > 0) && (
            <View style={styles.section}>
              <Text style={styles.heading2}>Litigation Alerts</Text>

              {/* Summary Cards */}
              {Object.keys(litigationSummaryCards).length > 0 && (
                <View style={styles.kpiContainer}>
                  {[
                    { label: "Cases Filed By Company", value: litigationSummaryCards.cases_filed_by, variant: 'variant1' },
                    { label: "Cases Filed Against Company", value: litigationSummaryCards.cases_filed_against, variant: 'variant4' },
                    { label: "Pending Cases", value: litigationSummaryCards.pending_cases, variant: 'variant3' }
                  ].map((item, i) => (
                    <View key={i} style={[styles.kpiCard, styles[item.variant], { width: '32%' }]}>
                      <Text style={styles.kpiLabel}>{item.label}</Text>
                      <Text style={styles.kpiValue}>{formatValue(item.value)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Summary Table */}
              {litigationSummaryTable.length > 0 && (
                <View style={{ marginBottom: 15 }}>
                  <Text style={[styles.tableCellHeader, { marginBottom: 5 }]}>Summary by Court Type</Text>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Court Type</Text></View>
                      <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Cases Filed By</Text></View>
                      <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Cases Against</Text></View>
                      <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Pending</Text></View>
                      <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Total</Text></View>
                    </View>
                    {litigationSummaryTable.map((item, index) => (
                      <View style={styles.tableRow} key={index} wrap={false}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(item.court_type)}</Text></View>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(item.cases_filed_by)}</Text></View>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(item.cases_against)}</Text></View>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(item.pending)}</Text></View>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(item.total)}</Text></View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Detailed Alerts */}
              {litigationAlerts.length > 0 && (
                <View>
                  <Text style={[styles.tableCellHeader, { marginBottom: 5 }]}>Detailed Litigation Alerts</Text>
                  <View style={styles.table}>
                    <View style={styles.tableRow} fixed>
                      <View style={[styles.tableColHeader, { width: '20%' }]}><Text style={styles.tableCellHeader}>Court</Text></View>
                      <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Filed By</Text></View>
                      <View style={[styles.tableColHeader, { width: '30%' }]}><Text style={styles.tableCellHeader}>Against</Text></View>
                      <View style={[styles.tableColHeader, { width: '10%' }]}><Text style={styles.tableCellHeader}>Pending</Text></View>
                      <View style={[styles.tableColHeader, { width: '10%' }]}><Text style={styles.tableCellHeader}>Severity</Text></View>
                    </View>
                    {litigationAlerts.map((item, index) => (
                      <View style={styles.tableRow} key={index} wrap={false}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{formatValue(item.court_type)}</Text></View>
                        <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{formatValue(item.filed_by)}</Text></View>
                        <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{formatValue(item.filed_against)}</Text></View>
                        <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{formatValue(item.pending_count)}</Text></View>
                        <View style={[styles.tableCol, { width: '10%' }]}><Text style={styles.tableCell}>{formatValue(item.severity)}</Text></View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={styles.watermarkContainer} fixed>
            <Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />
          </View>
        </Page>
      )}

      {/* Directors Overview Page */}
      {allDirectors.length > 0 && (
        <Page size="A4" style={styles.page}>
          {renderCompactHeader()}
          <Text style={styles.heading2}>Directors & KMP Details</Text>

          {(() => {
            const dirStats = [
              { label: 'Current Directors', count: directorsData?.summary?.current_directors ?? "-" },
              { label: 'Past Directors', count: directorsData?.summary?.past_directors ?? "-" },
              { label: 'Current KMPs', count: directorsData?.summary?.current_kmp ?? "-" },
              { label: 'Past KMPs', count: directorsData?.summary?.past_kmp ?? "-" },
            ];
            return renderLitigationKPIs(dirStats);
          })()}

          {renderDirectorTable(currentDirectors, "Current Directors & KMP")}
          {renderDirectorTable(pastDirectors, "Past Directors & KMP")}

          <View style={styles.watermarkContainer} fixed>
            <Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />
          </View>
        </Page>
      )}

      {/* Individual Director Data Page(s) */}
      {allDirectors.length > 0 && allDirectors.map((d, index) => (
        <Page size="A4" style={styles.page} key={`dir-detail-${index}`}>
          <View style={[styles.header, { marginBottom: 5 }]}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{d.name}</Text>
              <Text style={styles.subtitle}>{d.designation} | DIN/PAN: {d.din_pan}</Text>
            </View>
          </View>

          {/* Main Flat Data */}
          {renderDictTable(d, "Primary Information", null, 0)}

          {/* Details Dictionary */}
          {(() => {
            const personalDetailsKeys = [
              "din_pan", "pan", "dob", "nationality",
              "gender", "residential_status", "email", "mobile",
              "director_type", "din_status", "current_residential_address",
              "permanent_address"
            ];
            return d.details && renderDictTable(d.details, "Personal Details", personalDetailsKeys);
          })()}

          {/* Sub-tables Arrays */}
          <View break>
            {renderDynamicTable(d.career_timeline, "Career Timeline")}
          </View>
          {renderDynamicTable(d.qualifications, "Qualifications")}

          {d.details?.current_positions && renderDynamicTable(d.details.current_positions.map(p => ({
            "Company/LLP name": p.company_name || "-",
            "Designation": p.designation || "-",
            "Type": formatValue(p.category),
            "Period": p.tenure_years || p.tenure || "-",
            "Appointment Date": p.appointment_date || "-"
          })), "Current Positions")}

          {d.details?.past_positions && renderDynamicTable(d.details.past_positions.map(p => ({
            "Company/LLP name": p.company_name || "-",
            "Designation": p.designation || "-",
            "Tenure": p.tenure_years || p.tenure || "-"
          })), "Past Positions")}

          {renderDynamicTable(d.previous_companies ? d.previous_companies.map(p => ({
            "Company/LLP name": p.company_name,
            "Designation": p.designation,
            "Tenure": p.tenure
          })) : null, "Previous Companies")}

          {renderDynamicTable(d.shareholding ? d.shareholding.map(s => ({
            "Company/LLP name": s.company_name,
            "Shareholding %": s.shareholding_percentage,
            "Nature": s.nature
          })) : null, "Shareholding")}

          {renderDynamicTable(d.negative_media, "Negative Media")}
          {renderDynamicTable(d.banking_default_declarations, "Banking Default Declarations")}
          {renderDynamicTable(d.regulatory_compliance_history, "Regulatory Compliance History")}
          {renderDynamicTable(d.pep_sanctions_checks, "PEP & Sanctions Checks")}

          <View style={styles.watermarkContainer} fixed>
            <Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />
          </View>
        </Page>
      ))}

      {/* Phase 3: Control & Ownership - Shareholding (Moved to after directors) */}
      {shareholdingData && (
        <Page size="A4" style={styles.page}>
          <Text style={[styles.title, { marginBottom: 15 }]}>Control & Ownership - Shareholding</Text>

          {/* Shareholding Overview Stats */}
          <View style={styles.shareholdingCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabelSmall}>Total Equity Shares</Text>
                <Text style={styles.statValueBold}>{formatValue(shareholdingData?.overview?.total_equity_shares ?? shareholdingData?.summary?.total_equity_shares)}</Text>
              </View>
              <View style={styles.statVerticalLine} />
              <View style={styles.statItem}>
                <Text style={styles.statLabelSmall}>Promoter Holding</Text>
                <Text style={styles.statValueBold}>{formatValue(shareholdingData?.overview?.promoter_holding_shares ?? shareholdingData?.summary?.promoter_holding_shares)}</Text>
              </View>
              <View style={styles.statVerticalLine} />
              <View style={styles.statItem}>
                <Text style={styles.statLabelSmall}>Non-Promoter Holding</Text>
                <Text style={styles.statValueBold}>{formatValue(shareholdingData?.overview?.non_promoter_holding_shares ?? shareholdingData?.summary?.non_promoter_holding_shares)}</Text>
              </View>
            </View>

            <View style={styles.chartHeaderContainer}>
              <View style={styles.chartLine} />
              <Text style={styles.chartHeaderText}>Shareholding</Text>
              <View style={styles.chartLine} />
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressPromoter,
                    { width: `${parseFloat(shareholdingData?.summary?.promoter_percentage) || 0}%` }
                  ]}
                />
                <View
                  style={[
                    styles.progressNonPromoter,
                    { width: `${parseFloat(shareholdingData?.summary?.public_percentage) || 0}%` }
                  ]}
                />
              </View>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendCircle, { backgroundColor: '#93c5fd' }]} />
                <Text style={styles.legendLabel}>Promoter</Text>
                <Text style={styles.legendValue}>{formatValue(shareholdingData?.summary?.promoter_percentage)}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendCircle, { backgroundColor: '#d8b4fe' }]} />
                <Text style={styles.legendLabel}>Non Promoter</Text>
                <Text style={styles.legendValue}>{formatValue(shareholdingData?.summary?.public_percentage)}</Text>
              </View>
            </View>
          </View>

          {/* Control Insight */}
          {shareholdingData?.control_insight && (
            <View style={[styles.section, { marginBottom: 25 }]}>
              <Text style={styles.heading2}>Control Insight</Text>
              <Text style={[styles.paragraph, { fontSize: 9, color: '#444' }]}>{shareholdingData.control_insight}</Text>
            </View>
          )}

          {/* Promoters Table */}
          {(() => {
            const promotersData = Array.isArray(shareholdingData?.promoters_table) ? shareholdingData.promoters_table : [];
            const mappedPromoters = promotersData.map(r => ({
              "Category": formatValue(r.category),
              "Eq No. of Shares": formatValue(r.equity_number_of_shares),
              "Eq %": formatValue(r.equity_percentage),
              "Pref No. of Shares": formatValue(r.preference_number_of_shares),
              "Pref %": formatValue(r.preference_percentage)
            }));
            return renderDynamicTable(mappedPromoters, `Promoters`);
          })()}

          {/* Public / Other Than Promoters Table */}
          {(() => {
            const publicData = Array.isArray(shareholdingData?.public_other_than_promoters_table) ? shareholdingData.public_other_than_promoters_table : [];
            const mappedPublic = publicData.map(r => ({
              "Category": formatValue(r.category),
              "Eq No. of Shares": formatValue(r.equity_number_of_shares),
              "Eq %": formatValue(r.equity_percentage),
              "Pref No. of Shares": formatValue(r.preference_number_of_shares),
              "Pref %": formatValue(r.preference_percentage)
            }));
            return renderDynamicTable(mappedPublic, `Public / Other Than Promoters`);
          })()}

          {/* Directors Shareholdings Table */}
          {(() => {
            const dsObj = shareholdingData?.directors_shareholdings;
            const dsData = Array.isArray(dsObj) ? dsObj : (dsObj?.data || dsObj?.items || []);
            const mappedDs = dsData.map(d => ({
              "Director Name": formatValue(d.director_name),
              "Share Type": formatValue(d.share_type),
              "Shares Held": formatValue(d.shares_held),
              "Percentage": formatValue(d.percentage)
            }));
            return renderDynamicTable(mappedDs, `Directors Shareholdings`);
          })()}

          {/* Foreign Institutional Investor Table */}
          {(() => {
            const fiiObj = shareholdingData?.foreign_institutional_investor;
            const fiiData = Array.isArray(fiiObj) ? fiiObj : (fiiObj?.data || fiiObj?.items || []);
            const mappedFii = fiiData.map(f => ({
              "Name of the FII": formatValue(f.name_of_the_fii),
              "Share Type": formatValue(f.share_type),
              "Shares Held": formatValue(f.shares_held),
              "Percentage": formatValue(f.percentage)
            }));
            return renderDynamicTable(mappedFii, `Foreign Institutional Investor`);
          })()}

          {/* Section 2: Security Allotment */}
          {securityAllotmentData && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.heading2, { backgroundColor: 'transparent', color: '#000000', paddingLeft: 0 }]}>Securities Allotment</Text>
              {securityAllotmentData.overview && renderDictTable({
                "Issued Size": securityAllotmentData.overview.issued_size,
                "Face Value": securityAllotmentData.overview.face_value,
                "Class of Share": securityAllotmentData.overview.class_of_share,
                "Board Status": securityAllotmentData.overview.board_status
              }, "Allotment Overview")}

              {securityAllotmentData.trading_details && renderDictTable({
                "Trading Status": securityAllotmentData.trading_details.trading_status,
                "Trading Segment": securityAllotmentData.trading_details.trading_segment,
                "Derivatives": securityAllotmentData.trading_details.derivatives,
                "SLB": securityAllotmentData.trading_details.slb
              }, "Trading Details")}

              {(() => {
                const items = securityAllotmentData.allotment_records?.items || [];
                const mappedItems = items.map(a => ({
                  "Allotment Date": formatValue(a.allotment_date),
                  "Allotment Type": formatValue(a.allotment_type),
                  "Instrument": formatValue(a.instrument),
                  "Amount (Cr)": formatValue(a.amount_cr),
                  "No. of Securities Allotted": formatValue(a.no_of_securities_allotted),
                  "Nominal Value": formatValue(a.nominal_value),
                  "Premium Value": formatValue(a.premium_value)
                }));
                return renderDynamicTable(mappedItems, "Allotment Records");
              })()}
            </View>
          )}

          {/* Section 3: Group Structure */}
          {groupStructureData && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.heading2, { backgroundColor: 'transparent', color: '#000000', paddingLeft: 0 }]}>Group Structure</Text>
              {groupStructureData.summary && renderDictTable({
                "Holding Company": formatValue(groupStructureData.summary.other_entities),
                "Subsidiary Company": formatValue(groupStructureData.summary.subsidiaries),
                "Associate Company": formatValue(groupStructureData.summary.associates),
                "Joint Ventures": formatValue(groupStructureData.summary.joint_ventures)
              }, "Structure Summary")}

              {groupStructureData.parent_company && renderDictTable({
                "Company Name": groupStructureData.parent_company.company_name,
                "Company Role": groupStructureData.parent_company.company_role,
                "Total Subsidiaries": groupStructureData.parent_company.total_subsidiaries
              }, "Parent Company Details")}

              {(() => {
                const items = groupStructureData.group_entities || [];
                const mappedItems = items.map(e => ({
                  "Subsidiary Name": formatValue(e.subsidiary_name),
                  "Country": formatValue(e.country),
                  "Ownership %": formatValue(e.ownership_percentage),
                  "Ownership Type": formatValue(e.ownership_type),
                  "Status": formatValue(e.status)
                }));
                return renderDynamicTable(mappedItems, "Group Entities");
              })()}
            </View>
          )}

          {/* Section 4: Overseas Direct Investment (ODI) */}
          {overseasInvestmentData && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.heading2, { backgroundColor: 'transparent', color: '#000000', paddingLeft: 0 }]}>Overseas Direct Investment</Text>
              {overseasInvestmentData.summary && renderDictTable({
                "Total Entities": overseasInvestmentData.summary.total_entities,
                "Total Countries": overseasInvestmentData.summary.total_countries,
                "Total Investment Amount": overseasInvestmentData.summary.total_investment_amount
              }, "ODI Summary")}

              {(() => {
                const items = overseasInvestmentData.overseas_direct_investments?.items || [];
                const mappedItems = items.map(o => ({
                  "Year": formatValue(o.year),
                  "Month": formatValue(o.month),
                  "Name of the JV/WOS": formatValue(o.name_of_the_jv_wos),
                  "JV/WOS Type": formatValue(o.joint_venture_wholly_owned_subsidiary),
                  "Major Activity": formatValue(o.major_activity),
                  "Equity": formatValue(o.equity),
                  "Loan": formatValue(o.loan),
                  "Guarantee Issued": formatValue(o.guarantee_issued),
                  "Total": formatValue(o.total)
                }));
                return renderDynamicTable(mappedItems, "ODI Records");
              })()}
            </View>
          )}

          {/* Phase 4: Financial Highlights */}
          {financialHighlights && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.title, { fontSize: 16, marginBottom: 0 }]}>Financial Highlights</Text>

              {/* Table 1: Primary Metrics */}
              {(() => {
                const fh = financialHighlights;
                const primaryMetrics = [
                  { label: "Revenue", data: fh.revenue },
                  { label: "Profit", data: fh.profit },
                  { label: "Cash & Bank Balance", data: fh.cash_and_bank_balance },
                  { label: "Net Worth", data: fh.net_worth },
                  { label: "Assets", data: fh.assets },
                  { label: "Outsiders' Liabilities", data: fh.outsiders_liabilities },
                ];

                const tableData = primaryMetrics.map(m => ({
                  "Metric": m.label,
                  "Change %": formatValue(m.data?.change_pct),
                  "Value": m.data?.value ? `${m.data?.value}${m.data?.unit || ""}` : "-"
                }));

                return renderDynamicTable(tableData, "Key Performance Indicators");
              })()}

              {/* Table 2: Ratios & Detailed Metrics */}
              {(() => {
                const fh = financialHighlights;
                const secondaryMetrics = [
                  { label: "EBITDA", data: fh.ebitda },
                  { label: "Net Prot Margin", data: fh.net_profit_margin },
                  { label: "Sales to Fixed Asset", data: fh.sales_to_fixed_asset },
                  { label: "Debt to EBITDA", data: fh.debt_to_ebitda },
                  { label: "Interest Coverage Ratio", data: fh.interest_coverage_ratio },
                  { label: "Net Worth Margin", data: fh.net_worth_margin },
                  { label: "Debt to Equity", data: fh.debt_to_equity },
                  { label: "Return on Equity", data: fh.return_on_equity },
                  { label: "Equity Multiplier", data: fh.equity_multiplier },
                  { label: "PE Ratio", data: fh.pe_ratio },
                  { label: "Book Value", data: fh.book_value },
                  { label: "Reserves", data: fh.reserves },
                ];

                const tableData = secondaryMetrics.map(m => ({
                  "Financial Ratio": m.label,
                  "Value": m.data?.value ? `${m.data?.value}${m.data?.unit || ""}` : "-",
                  "Change %": formatValue(m.data?.change_pct)
                }));

                return renderDynamicTable(tableData, "Financial Ratios & Ratios");
              })()}
              {/* Table 3: Revenue & Profit Trend */}
              {revenueProfitTrend && revenueProfitTrend.trend && (
                <View wrap={false}>
                  {(() => {
                    // Filter out TTM and reverse to show latest years first
                    const filteredTrend = [...revenueProfitTrend.trend]
                      .filter(t => t.year && t.year.toUpperCase() !== 'TTM')
                      .reverse();

                    const mappedTrend = filteredTrend.map(t => ({
                      "Year": formatValue(t.year),
                      "Revenue (Cr)": t.revenue_cr !== undefined ? t.revenue_cr.toLocaleString('en-IN') : "-",
                      "Profit (Cr)": t.profit_cr !== undefined ? t.profit_cr.toLocaleString('en-IN') : "-"
                    }));

                    return (
                      <>
                        {renderBarChart(filteredTrend)}
                        {renderDynamicTable(mappedTrend, "Annual Financial Performance")}
                      </>
                    );
                  })()}
                </View>
              )}
            </View>
          )}


          <View style={styles.watermarkContainer} fixed>
            <Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />
          </View>
        </Page>
      )}

      {/* Phase 5: Landscape Balance Sheets */}
      {(bsStandalone || bsConsolidated) && (
        <Page size="A4" orientation="landscape" style={styles.page}>
          {renderCompactHeader()}
          {bsStandalone && renderBalanceSheetTable(bsStandalone, "Standalone")}
          {bsConsolidated && (
            <View break>
              {renderBalanceSheetTable(bsConsolidated, "Consolidated")}
            </View>
          )}

          {/* Profit & Loss Tables */}
          {pnlStandalone && (
            <View break>
              {renderPnlTable(pnlStandalone, "Standalone")}
            </View>
          )}
          {pnlConsolidated && (
            <View break>
              {renderPnlTable(pnlConsolidated, "Consolidated")}
            </View>
          )}

          {/* Cash Flow Tables */}
          {cfStandalone && (
            <View break>
              {renderCashFlowTable(cfStandalone, "Standalone")}
            </View>
          )}
          {cfConsolidated && (
            <View break>
              {renderCashFlowTable(cfConsolidated, "Consolidated")}
            </View>
          )}

          {/* Ratios Tables */}
          {ratioStandalone && (
            <View break>
              {renderRatiosTable(ratioStandalone, "Standalone")}
            </View>
          )}
          {ratioConsolidated && (
            <View break>
              {renderRatiosTable(ratioConsolidated, "Consolidated")}
            </View>
          )}

          {/* Auditor Tables */}
          {audStandalone && audStandalone.length > 0 && (
            <View break>
              {renderAuditorsTable(audStandalone, "Standalone")}
            </View>
          )}
          {audConsolidated && audConsolidated.length > 0 && (
            <View break>
              {renderAuditorsTable(audConsolidated, "Consolidated")}
            </View>
          )}

          <View style={styles.watermarkContainer} fixed>
            <Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />
          </View>
        </Page>
      )}

      {/* Phase 6: Charges Information (Portrait) */}
      {chargesData && (
        <Page size="A4" orientation="portrait" style={styles.page}>
          {renderCompactHeader()}
          {renderChargesSection(chargesData)}

          <View style={styles.watermarkContainer} fixed>
            <Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />
          </View>
        </Page>
      )}

      {/* Phase 7: Peer Comparison & Business Activity (Portrait) */}
      {peerComparisonData && (
        <Page size="A4" orientation="portrait" style={styles.page}>
          {renderCompactHeader()}
          {renderPeerComparisonSection(peerComparisonData)}

          <View style={styles.watermarkContainer} fixed>
            <Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />
          </View>
        </Page>
      )}

      {/* Phase 8: Compliance Details (Portrait) */}
      <Page size="A4" orientation="portrait" style={styles.page}>
        {renderCompactHeader()}
        {renderComplianceSection(auditorRemarksData)}

        <View style={styles.watermarkContainer} fixed>
          <Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />
        </View>
      </Page>

      {/* Phase 9: Litigation (Portrait) */}
      {litigationData && (
        <Page size="A4" orientation="portrait" style={styles.page}>
          {renderCompactHeader()}
          {renderLitigationSection(litigationData)}

          <View style={styles.watermarkContainer} fixed>
            <Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />
          </View>
        </Page>
      )}

    </Document>
  );
};

export default ReportDocument;
