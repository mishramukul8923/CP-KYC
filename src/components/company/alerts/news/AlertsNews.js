"use client";
import CompanyNews from "../../news/CompanyNews";

export default function AlertsNews({ companyName }) {
  return (
    <div style={{ padding: '0px' }}>
      <CompanyNews companyName={companyName} />
    </div>
  );
}
