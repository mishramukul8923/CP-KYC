# API Integration Report: Company Details (`page.js`)

This document outlines all the API endpoints called within the `src/app/company/[name]/page.js` component to populate the company dashboard. All requests use the `GET` method unless otherwise noted, and include an Authorization header.

## Global Request Headers

All API calls in this component utilize the following headers:

```json
{
  "Authorization": "Bearer <user_token>"
}
```

---

## 1. Company Profile Details

**Endpoint:** `/api/company-details/{companyName}`

- **Method:** `GET`
- **Payload/Params:** `companyName` (Path Variable)
- **Response Shape:** Returns core company information, about description, header info, and contact details used by `CompanyHeader`.

## 2. Financial Highlights

**Endpoint:** `/api/financials/{companyName}/highlights`

- **Method:** `GET`
- **Payload/Params:** `companyName` (Path Variable)
- **Response Shape:** Returns a summary of financial metrics and highlights.

## 3. Revenue & Profit Trend

**Endpoint:** `/api/financials/{companyName}/revenue-profit-trend`

- **Method:** `GET`
- **Payload/Params:** `companyName` (Path Variable)
- **Response Shape:** Returns chart data mapping revenue and profit over recent years.

## 4. Profit & Loss Statement

**Endpoint:** `/api/financials/{companyName}/profit-loss`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `type` (Query Param): `Standalone` or `Consolidated`
- **Response Shape:** Returns tabular financial data for the P&L statement.

## 5. Balance Sheet

**Endpoint:** `/api/financials/{companyName}/balance-sheet`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `type` (Query Param): `Standalone` or `Consolidated`
- **Response Shape:** Returns assets, liabilities, and equity data.

## 6. Cash Flow

**Endpoint:** `/api/financials/{companyName}/cash-flow`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `type` (Query Param): `Standalone` or `Consolidated`
- **Response Shape:** Returns operating, investing, and financing cash flows.

## 7. Financial Ratios

**Endpoint:** `/api/financials/{companyName}/ratios`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `type` (Query Param): `Standalone` or `Consolidated`
- **Response Shape:** Returns key financial ratios (liquidity, solvency, profitability).

## 8. Peer Comparison

**Endpoint:** `/api/financials/{companyName}/peer-comparison`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `page=1` & `per_page=100` (Query Params)
- **Response Shape:** Returns a list of competitor companies with their market cap and key metrics.

## 9. Auditors

**Endpoint:** `/api/financials/{companyName}/auditors`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `type` (Query Param): `Standalone` or `Consolidated`
  - `limit=1000` (Query Param)
- **Response Shape:** Returns a list of statutory auditors.

## 10. Auditors Remark / Compliance Details

**Endpoint:** `/api/company/{companyName}/compliance-details/auditors-remark`

- **Method:** `GET`
- **Payload/Params:** `companyName` (Path Variable)
- **Response Shape:** Returns remarks and compliance notes made by auditors.

## 11. Directors Detailed

**Endpoint:** `/api/company/{companyName}/directors-detailed`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `limit=1000` (Query Param)
- **Response Shape:** Returns current directors, KMPs, and their DINs.

## 12. Common Directorship

**Endpoint:** `/api/company/{companyName}/common-directorship`

- **Method:** `GET`
- **Payload/Params:** `companyName` (Path Variable)
- **Response Shape:** Returns relationships between directors and other corporate entities.

## 13. Shareholding Pattern

**Endpoint:** `/api/company/{companyName}/control-ownership/shareholding`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `limit=1000` (Query Param)
- **Response Shape:** Returns promoter and public shareholding percentages.

## 14. Security Allotment

**Endpoint:** `/api/company/{companyName}/control-ownership/security-allotment`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `page=1` & `per_page=1000` (Query Params)
- **Response Shape:** Returns records of securities and shares allotted.

## 15. Group Structure

**Endpoint:** `/api/company/{companyName}/control-ownership/group-structure`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `page=1` & `per_page=1000` (Query Params)
- **Response Shape:** Returns subsidiaries, holding companies, and associates.

## 16. Overseas Direct Investment (ODI)

**Endpoint:** `/api/company/{companyName}/control-ownership/overseas-direct-investment`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `limit=1000` (Query Param)
- **Response Shape:** Returns foreign investments made by the company.

## 17. Charges (Debt & Mortgages)

**Endpoint:** `/api/company/{companyName}/charges`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `open_page=1`, `closed_page=1` & `limit={limit}` (Query Params)
- **Response Shape:** Returns open and closed financial charges against assets.

## 18. Alerts

**Endpoint:** `/api/company/{companyName}/alerts`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - `page=1` & `size=1000` (Query Params)
- **Response Shape:** Returns operational or compliance alerts (e.g., EPF defaults).

## 19. Litigation

**Endpoint:** `/api/company/{companyName}/litigation`

- **Method:** `GET`
- **Payload/Params:**
  - `companyName` (Path Variable)
  - Contains extensive pagination params: `pending_against_page=1`, `pending_against_size=200`, `pending_by_page=1`, `pending_by_size=200`, `disposed_against_page=1`, `disposed_against_size=200`, `disposed_by_page=1`, `disposed_by_size=200`
- **Response Shape:** Returns court cases categorized by pending/disposed and against/by.

General / Layout Validations

Suggestion search (validation): GET /api/search/suggestions
Version History (header modal): GET /api/version-history/{companyName}
Company Details Section

Overview, Details, Name History, & Addresses: GET /api/company-details/{companyName}
Company News: GET /api/company/{companyName}/news
Corporate Announcements: GET /api/company/{companyName}/announcements
Alerts Section

Active Compliance & Litigation Alerts: GET /api/company/{companyName}/alerts
Company Highlights Section

Timeline Milestone Highlights: GET /api/company/{companyName}/highlights
Active Product Catalog: GET /api/company/{companyName}/products
Directors & KMP Section

Director Detailed Profiles: GET /api/company/{companyName}/directors-detailed
Specific KMP News Tab search: GET /api/company/{companyName}/news?search={directorName}
Control & Ownership Section

Shareholding Pattern: GET /api/company/{companyName}/control-ownership/shareholding
Securities Allotment: GET /api/company/{companyName}/control-ownership/security-allotment
Group Structure (Subsidiaries/Holdings): GET /api/company/{companyName}/control-ownership/group-structure
Overseas Direct Investment (ODI): GET /api/company/{companyName}/control-ownership/overseas-direct-investment
Financials Section (supports Standalone / Consolidated toggle query parameters)

General Financial Highlights: GET /api/financials/{companyName}/highlights
Standalone/Consolidated Profit & Loss: GET /api/financials/{companyName}/profit-loss
Standalone/Consolidated Balance Sheet: GET /api/financials/{companyName}/balance-sheet
Standalone/Consolidated Cash Flow: GET /api/financials/{companyName}/cash-flow
Standalone/Consolidated Ratios: GET /api/financials/{companyName}/ratios
Auditors list: GET /api/financials/{companyName}/auditors
Revenue/Profit Trend line values: GET /api/financials/{companyName}/revenue-profit-trend
Charges Section

Open & Closed Asset Charges: GET /api/company/{companyName}/charges
Peer Comparison Section

Peer Benchmark Benchmarking data: GET /api/financials/{companyName}/peer-comparison
Related Companies Section

Common Directorship Connection Map: GET /api/company/{companyName}/common-directorship
Compliance Details Section

Auditors' Adverse Remarks & CARO Annexures: GET /api/company/{companyName}/compliance-details/auditors-remark
Note: GST, EPFO, and CSR Credit Rating APIs are commented out in code (reserved for Phase 2).
Litigation Section

Pending/Disposed Court Records (by or against company): GET /api/company/{companyName}/litigation
Documents Section

File Categories list: GET /api/mca-document-agent/categories
MCA Filings List: GET /api/mca-document-agent/documents
Scraper trigger & status checks: POST /api/mca-document-agent/start & GET /api/mca-document-agent/status/{jobId}
PDF stream downloads: GET /api/mca-document-agent/download/{docId}
