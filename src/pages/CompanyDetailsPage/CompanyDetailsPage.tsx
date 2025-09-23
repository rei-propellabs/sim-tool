

import React, { useEffect, useState } from 'react';
import styles from './CompanyDetailsPage.module.css';
import { TopBar } from "components/TopBar/TopBar";

import { useLocation, useNavigate } from "react-router-dom";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { Edit } from "images/Dynamic/Edit";
import { AttachFile } from "images/Dynamic/AttachFile";
import { FilesTabContent } from "./FilesTabContent";
import { EditCompanyPage } from "pages/EditCompanyPage/EditCompanyPage";
import useGetOrganizationById from "api/hooks/useGetOrganizationById";
import { getToken } from "utils/TokenManager";
import { Presentation } from "images/Dynamic/Presentation";
import { ScenariosTabContent } from "./ScenariosTabContent";
import { Company } from "images/Dynamic/Company";

export const CompanyDetailsPage = () => {

  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);
  const orgId = query.get("orgId");
  const defaultTab = query.get("t");
  const projectId = query.get("projectId");
  const token = getToken("uploadAdmin")

  const [orgName, setOrgName] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(defaultTab ? parseInt(defaultTab) : 0);

  const { isLoading: isLoadingOrg, organization } = useGetOrganizationById(token, orgId || undefined);

  useEffect(() => {
    if (orgId == null) {
      navigate("/admin");
    }
  }, [])

  useEffect(() => {
    if (!isLoadingOrg && organization) {
      setOrgName(organization.name || "");
    }
  }, [isLoadingOrg])

  const header = () => {
    const tabDefs = [
      { label: "Details", icon: Edit },
      { label: "Client Files", icon: AttachFile },
      { label: "Scenarios", icon: Presentation }
    ];
    return (
      <NavigationHeader
        backText={`BACK TO ${projectId ? "PROJECTS" : "COMPANIES"}`}
        onBackClick={() => { 
          navigate("/admin") }}
        heading={orgName}
        tabs={tabDefs.map((tab, index) => ({
          label: tab.label,
          icon: <tab.icon color={tabIndex === index ? "var(--default-text)" : "var(--darker-text)"} size={16} />
        }))}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        headerIcon={<Company color={"var(--default-text)"} size={28} />}
      />
    )
  }

  const tabContents = [<EditCompanyPage />, <FilesTabContent />, <ScenariosTabContent />];

  return (
    <div className={styles.pageContainer}>
      <TopBar />
      {header()}

      <div className={styles.tabContent}>
        {tabContents[tabIndex]}
      </div>

    </div>
  )
}