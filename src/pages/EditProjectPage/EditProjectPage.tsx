import React, { useEffect, useState } from 'react';
import styles from './EditProjectPage.module.css';
import { TopBar } from "components/TopBar/TopBar";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import usePostProject from "api/hooks/usePostProject";
import useGetProjectById from "api/hooks/useGetProjectById";
import { getToken } from "utils/TokenManager";
import usePutProject from "api/hooks/usePutProject";

export const EditProjectPage = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);

  const orgId = query.get("orgId") ?? ""
  const siteId = query.get("siteId") ?? ""
  const projectId = query.get("projectId") ?? ""
  const token = getToken("uploadAdmin")

  const { postProject } = usePostProject(token);
  const { putProject } = usePutProject(token);
  const { isLoading, project } = useGetProjectById(token, { organizationId: orgId ?? "",  id: projectId ?? "" });


  useEffect(() => {
    if (!isLoading && project) {
      setProjectName(project.name || "");
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
        heading={projectId ? `Edit Project` : "New Project"}
      />
    )
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    try {
      let response;
      if (projectId) {
        response = await putProject(projectId, {
          name: projectName,
          organizationId: orgId,
          siteId: siteId
        });
      } else {
        response = await postProject({
          name: projectName,
          organizationId: orgId,
          siteId: siteId
        });
      }
      // todo: error handling
      if (response) {
        navigate(-1);
      }
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
              Project name
              <input type="text"
                // readOnly={projectId != null && projectId.length > 0}
                className={styles.inputField}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="" />
            </div>
            <div className={styles.fieldDetails}>{error}</div>
            <button
              type="submit"
              className={styles.submitBtn}
              onClick={handleSubmit}>
              {projectId != null ? "Save" : "Create"}
            </button>

          </div>
      }

    </div>
  )
}