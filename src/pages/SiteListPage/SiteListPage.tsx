import { TopBar } from "components/TopBar/TopBar";
import React, { useEffect, useState } from "react";
import styles from "./SiteListPage.module.css"
import { useLocation, useNavigate } from "react-router-dom";
import { ProjectBreadcrumbs } from "components/ProjectBreadcrumbs/ProjectBreadcrumbs";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import useListSites from "api/hooks/useListSites";
import { SiteTableRow } from "types/SiteTableRow";
import { ColumnConfig, NavigationTable } from "components/NavigationTable/NavigationTable";
import { getToken } from "utils/TokenManager";
import useGetOrganizationById from "api/hooks/useGetOrganizationById";
import { PaginationParams } from "utils/Pagination";
import { PaginationBar } from "components/PaginationBar/PaginationBar";
import { daysElapsed, formatDateMMDDYY } from "utils/DateFormatter";
import MenuDots from "images/MenuDots.svg";
import Edit from "images/Edit.svg";
import Delete from "images/Delete.svg";
import Add from "images/Dynamic/Add";
import { Info } from "images/Dynamic/Info";
import navTableStyles from "components/NavigationTable/NavigationTable.module.css";
import useDeleteSite from "api/hooks/useDeleteSite";
import { AttachFile } from "images/Dynamic/AttachFile";

export const SiteListPage = () => {
  const NUM_ROWS = 10;
  const navigate = useNavigate();

  const [siteTableData, setSiteTableData] = useState<SiteTableRow[]>([]);
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: NUM_ROWS,
    offset: 0,
    orderBy: "DESC",
    order: "createdAt",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const query = new URLSearchParams(useLocation().search);
  const orgId = query.get("orgId");
  const token = getToken("uploadAdmin")

  const paginationMemo = React.useMemo(() => ({ ...pagination }), [pagination, refreshKey]);
  const { isLoading, sites, total } = useListSites(token, { orgId: orgId ?? "" }, paginationMemo);

  const { organization } = useGetOrganizationById(token, orgId ?? "")
  const { deleteSite } = useDeleteSite(token);

  const currentPage = Math.floor((pagination.offset ?? 0) / NUM_ROWS) + 1;

  useEffect(() => {
    if (!isLoading) {
      setSiteTableData(
        sites.map((site) => ({
          name: site.name,
          id: site.id,
          createdAt: formatDateMMDDYY(site.createdAt),
          updatedAt: formatDateMMDDYY(site.updatedAt),
          projects: site.projectCount,
          lastUploadedAt: site.lastUpload ? daysElapsed(site.lastUpload?.lastUploadAt ?? site.lastUpload.createdAt) : "N/A",
          projectStatus: site.statuses["ReadyForCalculation"] > 0 ? "Action Required" : "Files Required",
          numActionRequired: site.statuses["ReadyForCalculation"] ?? 0,
        }))
      );
    }
  }, [isLoading, sites]);

  if (!orgId) {
    navigate("/admin");
    return null;
  }

  const handlePageClick = (page: number) => {
    console.log("Page clicked", page);
    setPagination((prev) => ({
      ...prev,
      offset: (page - 1) * NUM_ROWS,
    }));
  };

  const header = () => {
    return (
      <NavigationHeader
        backText="BACK TO COMPANIES"
        heading={organization ? organization.name : ""}
        subheading="Sites"
        subheadingSecondary={`${sites.length > 0 ? `(${sites.length})` : ""}`}
        actionButtons={
          <button className={styles.newSiteBtn}
            onClick={() => {
              navigate(`/admin/s/form?orgId=${orgId}`)
            }}
          >
            <Add fill="var(--primary-button-text)" />
            New Site
          </button>
        }
      />
    )

    // if (currentPath.length === 0 && isAdmin) {
    //   return (
    //     <div className={styles.headerContainer}>
    //       <div className={styles.headerLeft}>
    //         <button className={styles.backBtn} onClick={() => navigate(-1)}>
    //           <Arrow color={"var(--darker-text)"} />
    //           BACK TO COMPANIES
    //         </button>
    //         <div className={styles.headerSub}>
    //           All Sites<span className={`${styles.headerSub} ${styles.darkText}`}>(5)</span>
    //         </div>
    //         <div className={styles.header}>
    //           New Company

    //           {/* <div className={styles.siteInfo}>
    //             <div className={styles.siteInfoSec}>
    //               <div className={styles.siteInfoTitle}>SITES</div>
    //               <div className={styles.siteInfoDetails}>3</div>
    //             </div>

    //             <div className={styles.siteInfoSec}>
    //               <div className={styles.siteInfoTitle}>LAST UPDATE</div>
    //               <div className={styles.siteInfoDetails}>4/4/18</div>
    //             </div>

    //             <div className={styles.siteInfoSec}>
    //               <div className={styles.siteInfoTitle}>DUE</div>
    //               <div className={styles.siteInfoDetails}>4/4/18</div>
    //             </div>

    //             <div className={styles.siteInfoSec}>
    //               <div className={styles.siteInfoTitle}>DATA STATUS</div>
    //               <div className={styles.siteInfoDetails}>Labelling</div>
    //             </div>

    //             <div className={styles.siteInfoSec}>
    //               <div className={styles.siteInfoTitle}>PROJECT STATUS</div>
    //               <div className={styles.siteInfoDetails}>Overdue</div>
    //             </div>
    //           </div> */}

    //           <button
    //             hidden
    //             className={styles.newCompanyBtn}>New Company</button>
    //         </div>
    //       </div>

    //     </div>
    //   )
    // }

    // return (
    //   <div className={styles.projectName}>
    //     {mockData.projectName}
    //   </div>
    // )
  }

  const columns: ColumnConfig<SiteTableRow>[] = [
    { key: 'name', header: 'Sites' },
    { key: 'projects', header: 'Projects' },
    { key: 'updatedAt', header: 'Last update' },
    { key: 'lastUploadedAt', header: 'Last upload' },
    {
      key: 'projectStatus', header: 'Project status',
      render: (site) => {
        if (site.numActionRequired > 0) {
          return (
            <span className={styles.actionRequiredText}>
              <Info color={"var(--warning200)"} size={16} />
              Action required ({site.numActionRequired})
            </span>
          );
        } else {
          return (
            <span className={styles.projectStatus}>
              No action required
            </span>
          );
        }
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (site) => (
        site.numActionRequired > 0 && (
          <button
            className={"border-button"}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/c?t=1&orgId=${orgId}`)
            }}>
            View files
          </button>
        )
      ),
    },
    { key: 'menu', header: 'Menu' },

  ];

  const onDeleteClick = async (siteId: string) => {
    await deleteSite(siteId, orgId ?? "")
      .then(() => {
        console.log("Delete site done");
        setRefreshKey((k) => k + 1);
      })
      .catch((error) => {
        console.error("Error deleting site:", error);
      });
  }

  return (
    <div className={styles.pageContainer}>
      <TopBar
        leftElements={
          <ProjectBreadcrumbs
            texts={["All Companies", organization ? organization.name : ""]} />
        }
      />

      {header()}

      {
        !isLoading &&
        <NavigationTable
          columns={columns}
          data={siteTableData}
          onRowClick={(index) => {
            localStorage.setItem("site", JSON.stringify(sites[index]));
            navigate(`/admin/p?orgId=${orgId}&siteId=${sites[index].id}`)
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
                  navigate(`/admin/s/form?orgId=${orgId}&siteId=${sites[rowIndex].id}`);
                }}
              >
                <img src={Edit} />
                Edit details
              </button>
              {
              sites[rowIndex].lastUpload &&
              <button
                className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.editOption}`}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  navigate(`/admin/c?t=1&orgId=${orgId}`);
                }}
              >
                <AttachFile size={20} color="var(--default-text)" />
                View files
              </button>
            }
              <button
                className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.editOption}`}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  navigate(`/admin/p/form?orgId=${orgId}&siteId=${sites[rowIndex].id}`);
                }}
              >
                <Add fill="var(--default-text)" />
                New Project
              </button>
              <button
                className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.deleteOption}`}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  onDeleteClick(sites[rowIndex].id);
                }}
              >
                <img src={Delete} />
                Delete site
              </button>
            </div>
          )}
        />
      }
      {
        isLoading && <SmallLoadingSpinner />
      }
      {
        (!isLoading && sites.length === 0) &&
        <div className={styles.noSiteText}>
          <div className={styles.h1}>No Sites created yet</div>
          <div className={styles.b1}>Create a Site to start Financial Simulation workflow</div>
          <button onClick={() => navigate(`/admin/s/form?orgId=${orgId}`)}>Create a Site</button>
        </div>
      }
      {!isLoading && (
        <PaginationBar
          total={total}
          pageSize={NUM_ROWS}
          currentPage={currentPage}
          onPageChange={handlePageClick}
          numRows={siteTableData.length}
        />
      )}
    </div>
  );
}