"use client";

import { useState } from "react";

import AlertsTabs from "./AlertsTabs";

import AlertsOverview from "./overview/AlertsOverview";
import Observation from "./observation/Observation";
import DefaultsViolations from "./defaults-violations/DefaultsViolations";
import FormerDirectors from "./former-directors/FormerDirectors";
import AlertsNews from "./news/AlertsNews";

export default function AlertsContainer({ companyName, alertsData, alertsLoading, alertsError }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <AlertsTabs activeTab={activeTab} setActiveTab={setActiveTab} alertsData={alertsData} />

      {activeTab === "overview" && <AlertsOverview alertsData={alertsData} alertsLoading={alertsLoading} alertsError={alertsError} />}
      {activeTab === "observation" && <Observation alertsData={alertsData} alertsLoading={alertsLoading} alertsError={alertsError} />}
      {activeTab === "defaults" && <DefaultsViolations alertsData={alertsData} alertsLoading={alertsLoading} alertsError={alertsError} />}
      {activeTab === "formerDirectors" && <FormerDirectors alertsData={alertsData} alertsLoading={alertsLoading} alertsError={alertsError} />}
      {activeTab === "news" && <AlertsNews companyName={companyName} alertsData={alertsData} alertsLoading={alertsLoading} alertsError={alertsError} />}
    </>
  );
}
