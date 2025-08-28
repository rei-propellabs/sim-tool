import React, { useEffect, useState } from 'react';
import styles from './EditSitePage.module.css';
import { TopBar } from "components/TopBar/TopBar";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import usePostSite from "api/hooks/usePostSite";
import useGetSiteById from "api/hooks/useGetSiteById";
import { getToken } from "utils/TokenManager";
import usePutSite from "api/hooks/usePutSite";

export const EditSitePage = () => {
  const [siteName, setSiteName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);

  const orgId = query.get("orgId")
  const siteId = query.get("siteId")
  const token = getToken("uploadAdmin")

  const { postSite } = usePostSite(token);
  const { putSite } = usePutSite(token);
  
  const { isLoading, site } = useGetSiteById(token, {orgId: orgId ?? "", siteId: siteId ?? ""});

  useEffect(() => {
    if (!isLoading && site) {
      setSiteName(site.name || "");
    }

  }, [isLoading])

  if (!orgId) {
    navigate("/admin")
    return null;
  }
  
  const header = () => {
    return (
      <NavigationHeader
        backText="BACK"
        heading={siteId ? `Edit Site` : "New Site"}
      />
    )
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (siteId) {
        await putSite(siteId, { name: siteName, organizationId: orgId });
      } else {
        await postSite({ name: siteName, organizationId: orgId });
      }
      navigate(-1)
    } catch (err: any) {
      console.log("catch ERROR", err)
      setError(err.message || "An error occurred");
    }
  }

  return (
    <div className={styles.pageContainer}>
      <TopBar />
      {header()}

      {
        false ?
          <SmallLoadingSpinner />
          :
          <div className={styles.formContainer}>
            <div className={styles.title}>General</div>

            <div className={styles.fieldDetails}>
              Site name
              <input type="text"
                className={styles.inputField}
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="" />
            </div>
            <div className={styles.fieldDetails}>{error}</div>
            <button
              type="submit"
              className={styles.submitBtn}
              onClick={handleSubmit}>
              {siteId ? "Save" : "Create"}
            </button>

          </div>
      }

    </div>
  )
}