import { TopBar } from "components/TopBar/TopBar";
import React, { useEffect, useState } from "react";
import styles from "./ProjectListPage.module.css"
import { useLocation, useNavigate } from "react-router-dom";
import { ProjectBreadcrumbs } from "components/ProjectBreadcrumbs/ProjectBreadcrumbs";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import { ProjectTableRow } from "types/ProjectTableRow";
import { ColumnConfig, NavigationTable } from "components/NavigationTable/NavigationTable";
import useListProjects from "api/hooks/useListProjects";
import { getToken } from "utils/TokenManager";
import useGetSiteById from "api/hooks/useGetSiteById";
import useGetOrganizationById from "api/hooks/useGetOrganizationById";
import { PaginationBar } from "components/PaginationBar/PaginationBar";
import { PaginationParams } from "utils/Pagination";
import { daysElapsed, formatDateMMDDYY } from "utils/DateFormatter";
import MenuDots from "images/MenuDots.svg";
import Edit from "images/Edit.svg";
import Delete from "images/Delete.svg";
import Add from "images/Dynamic/Add";
import navTableStyles from "components/NavigationTable/NavigationTable.module.css";
import useDeleteProject from "api/hooks/useDeleteProject";
import { StatusTag } from "components/StatusTag/StatusTag";
import { AttachFile } from "images/Dynamic/AttachFile";

export const ProjectListPage = () => {
  const NUM_ROWS = 10;
  const navigate = useNavigate();

  const [projectTableData, setProjectTableData] = useState<ProjectTableRow[]>([]);
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: NUM_ROWS,
    offset: 0,
    orderBy: "DESC",
    order: "createdAt",
  });

  const token = getToken("uploadAdmin")
  const [refreshKey, setRefreshKey] = useState(0);
  const paginationMemo = React.useMemo(() => ({ ...pagination }), [pagination, refreshKey]);
  const { deleteProject } = useDeleteProject(token);

  const query = new URLSearchParams(useLocation().search);
  const orgId = query.get("orgId") ?? "";
  const siteId = query.get("siteId") ?? "";

  const { isLoading, projects, total } = useListProjects(token, {
    orgId: orgId, siteId: siteId,
  }, paginationMemo);

  const { organization } = useGetOrganizationById(token, orgId ?? "")
  const { site } = useGetSiteById(token, { orgId: orgId ?? "", siteId: siteId ?? "" })
  const currentPage = Math.floor((pagination.offset ?? 0) / NUM_ROWS) + 1;

  const PROJECT_STATUS_META: Record<string, { label: string; color: string }> = {
    Created: { label: "Files Required", color: "var(--waiting)" },
    ReadyForCalculation: { label: "Calculation", color: "var(--actionRequired)" },
  };

  useEffect(() => {
    if (!isLoading) {
      setProjectTableData(
        projects.map((project) => {
          const statusKey = project.status || "Created";
          const meta = PROJECT_STATUS_META[statusKey] || { label: statusKey, color: "#C7DBC9" };
          return {
            name: project.name,
            id: project.id,
            updatedAt: formatDateMMDDYY(project.updatedAt),
            dataStatus: "Financial Simulation",
            lastUploadAt: project.lastUploadAt ? daysElapsed(project.lastUploadAt) : "N/A",
            projectStatus: meta.label,
            projectStatusColor: meta.color,
          };
        })
      );
    }
  }, [isLoading, projects])

  if (!orgId) {
    navigate("/admin");
    return null;
  }

  const header = () => {
    return (
      <NavigationHeader
        backText="BACK TO SITES"
        heading={site ? site.name : ""}
        subheading="Projects"
        subheadingSecondary={`${projects.length > 0 ? `(${projects.length})` : ""}`}
        actionButtons={
          // (projects.length > 0) &&
          <button className={styles.newProjectBtn}
            onClick={() => {
              navigate(`/admin/p/form?orgId=${orgId}&siteId=${siteId}`)
            }}
          >
            <Add fill="var(--primary-button-text)" />
            New Project
          </button>
        }
      />
    )
  }

  const columns: ColumnConfig<ProjectTableRow>[] = [
    { key: 'name', header: 'Projects' },
    { key: 'updatedAt', header: 'Last update' },
    { key: 'lastUploadAt', header: 'Last upload' },
    { key: 'projectStatus', header: 'Project status',
      render: (item) => (
        <StatusTag
          text={item.projectStatus}
          color={item.projectStatusColor} />
      )
     },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        item.lastUploadAt &&
        <button onClick={() => navigateToViewFiles(item.id)}>
          View files
        </button>
      ),
    },
    { key: 'menu', header: 'Menu' },

  ];

  const handlePageClick = (page: number) => {
    console.log("Page clicked", page);
    setPagination((prev) => ({
      ...prev,
      offset: (page - 1) * NUM_ROWS,
    }));
  };

  const onDeleteClick = async (projectId: string) => {
    await deleteProject(projectId, orgId ?? "")
      .then(() => {
        console.log("Delete project success");
        setRefreshKey((k) => k + 1);
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  }

  const navigateToViewFiles = (projectId: string) => {
    navigate(`/admin/c?t=1&orgId=${orgId}&projectId=${projectId}`);
  }


  return (
    <div className={styles.pageContainer}>
      <TopBar
        leftElements={
          <ProjectBreadcrumbs
            texts={["All Companies", organization ? organization.name : "", site ? site.name : ""]} />
        }
      />

      {header()}

      <NavigationTable
        columns={columns}
        data={projectTableData}
        onRowClick={(index) => {
          localStorage.setItem("company", JSON.stringify(projects[index]));
        }}
        renderMenuButton={(rowIndex, openMenu, ref) => (
          <button
            ref={ref}
            onClick={(e) => {
              e.stopPropagation();
              openMenu();
            }}
            className="buttonNoBg"
          >
            <img src={MenuDots} />
          </button>
        )}
        renderMenu={(rowIndex, closeMenu) => (
          <div>
            <button
              className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.editOption}`}
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                navigate(`/admin/p/form?orgId=${orgId}&siteId=${siteId}&projectId=${projects[rowIndex].id}`);
              }}
            >
              <img src={Edit} />
              Edit details
            </button>
              <button
                className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.editOption}`}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  navigateToViewFiles(projects[rowIndex].id);
                }}
              >
                <AttachFile size={20} color="var(--default-text)" />
                View files
              </button>
            <button
              className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.deleteOption}`}
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                onDeleteClick(projects[rowIndex].id);
              }}
            >
              <img src={Delete} />
              Delete project
            </button>
          </div>
        )}
      />
      {/* {ProjectTable(projectData)} */}
      {
        isLoading && <SmallLoadingSpinner />
      }
      {
        (!isLoading && projects.length === 0) &&
        <div className={styles.noProjectText}>
          <div className={styles.h1}>No Projects created yet</div>
          <div className={styles.b1}>Create a project to start imaging workflow</div>
          <button onClick={() => navigate(`/admin/p/form?orgId=${orgId}&siteId=${siteId}`)}>Create a Project</button>
        </div>
      }
      {!isLoading && (
        <PaginationBar
          total={total}
          pageSize={NUM_ROWS}
          currentPage={currentPage}
          onPageChange={handlePageClick}
          numRows={projectTableData.length}
        />
      )}
    </div>
  );
}