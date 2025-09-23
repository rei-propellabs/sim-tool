import { TopBar } from "components/TopBar/TopBar";
import styles from "./CompanyListPage.module.css"
import React, { useEffect, useState } from "react";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { useNavigate } from "react-router-dom";
import { ProjectBreadcrumbs } from "components/ProjectBreadcrumbs/ProjectBreadcrumbs";
import { ColumnConfig, NavigationTable } from "components/NavigationTable/NavigationTable";
import useListOrganizations from "api/hooks/useListOrganizations";
import { OrganizationTableRow } from "types/OrganizationTableRow";
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import { getToken } from "utils/TokenManager";
import { PaginationParams } from "utils/Pagination";
import { PaginationBar } from "components/PaginationBar/PaginationBar";
import { daysElapsed, formatDateMMDDYY } from "utils/DateFormatter";
import Edit from "images/Edit.svg";
import Delete from "images/Delete.svg";
import Add from "images/Dynamic/Add";
import navTableStyles from "components/NavigationTable/NavigationTable.module.css";
import { AttachFile } from "images/Dynamic/AttachFile";
import useDeleteOrganization from "api/hooks/useDeleteOrganization";
import Company from "images/Company.svg";

export const CompanyListPage = () => {

  const NUM_ROWS = 10;
  const [orgTableData, setOrgTableData] = useState<OrganizationTableRow[]>([]);
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: NUM_ROWS,
    offset: 0,
    orderBy: "DESC",
    order: "createdAt",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const paginationMemo = React.useMemo(() => ({ ...pagination }), [pagination, refreshKey]);

  const token = getToken("uploadAdmin")
  const { isLoading, organizations, total } = useListOrganizations(token, paginationMemo, refreshKey);

  const { deleteOrganization } = useDeleteOrganization(token);

  const navigate = useNavigate();
  const currentPage = Math.floor((pagination.offset ?? 0) / NUM_ROWS) + 1;

  useEffect(() => {
    if (!isLoading) {
      setOrgTableData(
        organizations.map((org) => ({
          name: org.name,
          id: org.id,
          siteCount: org.siteCount,
          uploadCount: org.uploadCount,
          createdAt: formatDateMMDDYY(org.createdAt),
          updatedAt: formatDateMMDDYY(org.updatedAt),
          lastUploadAt: org.lastUpload ? daysElapsed(org.lastUpload?.lastUploadAt ?? org.createdAt) : "N/A",
          projectStatus: org.statuses["ReadyForCalculation"] > 0 ? "Action Required" : "Files Required",
          numActionRequired: org.statuses["ReadyForCalculation"] ?? 0,
        }))
      );
    }
  }, [isLoading, organizations]);

  const header = () => {
    return (
      <NavigationHeader
        heading="All Companies"
        headingSecondary={organizations.length > 0 ? `(${organizations.length})` : ""}
        actionButtons={
          <button className={styles.newCompanyBtn}
            onClick={() => {
              navigate("/admin/c/form")
            }}
          >
            <Add fill="var(--primary-button-text)" />
            New Company</button>
        }
      />
    )
  }
  const orgColumns: ColumnConfig<OrganizationTableRow>[] = [
    {
      key: 'name', header: 'Company',
      headerIcon: () => <img src={Company} />,
      render: (company) => {
        return (
          <span className={styles.cell}>
            <img src={Company} />
            {company.name}
          </span>
        )
      }
    },
    // { key: 'lastUploadAt', header: 'Last upload' },
    {
      key: 'projectStatus', header: 'Project status',
      render: (company) => {
        if (company.uploadCount > 0) {
          return (
            <span className={styles.projectStatus}>
              Uploads ({company.uploadCount})
            </span>
            // <span className={styles.actionRequiredText}>
            //   <Info color={"var(--warning200)"} size={16} />
            //   Action required ({company.numActionRequired})
            // </span>
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
    { key: 'updatedAt', header: 'Last Activity (DD/MM/YY)' },
    {
      key: 'actions',
      header: 'Actions',
      render: (org) => {
        if (org.uploadCount === 0) return null;
        return (
          <button
            className={"primary-button"}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/c?t=1&orgId=${org.id}`)
            }}>
            <AttachFile size={16}
              color="var(--primary-button-text)"
            />
            View files
          </button>
        );
      },
    },
    { key: 'menu', header: 'Menu' },

  ];

  const handlePageClick = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      offset: (page - 1) * NUM_ROWS,
    }));
  };


  const onDeleteClick = async (orgId: string) => {
    await deleteOrganization(orgId ?? "")
      .then(() => {
        console.log("Delete organization success");
        setRefreshKey((k) => k + 1);
      })
      .catch((error) => {
        console.error("Error deleting organization:", error);
      });
  }

  return (
    <div className={styles.pageContainer}>
      <TopBar
        leftElements={
          <ProjectBreadcrumbs
            texts={["All Companies"]} />
        }
      />

      {header()}

      <NavigationTable
        expandIndexes={[0, 1, 2, 3]}
        columns={orgColumns}
        data={orgTableData}
        onRowClick={(index) => {
          localStorage.setItem("company", JSON.stringify(organizations[index]));

          navigate(`/admin/c?t=${organizations[index].uploadCount === 0 ? 0 : 1}&orgId=${organizations[index].id}`);
        }}
        renderMenu={(rowIndex, closeMenu) => (
          <div>
            <button
              className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.editOption}`}
              onClick={(e) => {
                e.preventDefault();
                // closeMenu();
                navigate(`/admin/c?orgId=${organizations[rowIndex].id}`);
              }}
            >
              <img src={Edit} />
              Edit details
            </button>
            {
              organizations[rowIndex].uploadCount > 0 &&
              <button
                className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.editOption}`}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  navigate(`/admin/c?t=1&orgId=${organizations[rowIndex].id}`);
                }}
              >
                <AttachFile size={20} color="var(--default-text)" />
                View files
              </button>
            }
            {/* <button
              className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.editOption}`}
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                navigate(`/admin/s/form?orgId=${organizations[rowIndex].id}`);
              }}
            >
              <Add fill="var(--default-text)" />
              New Site
            </button> */}
            {
              // This is a company for admin, do not allow deletion
              organizations[rowIndex].id !== "33264945-70c1-4725-8b01-17503d578783" &&
              <button
                className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.deleteOption}`}
                onClick={(e) => {
                  e.preventDefault();
                  closeMenu();
                  onDeleteClick(organizations[rowIndex].id);
                }}
              >
                <img src={Delete} />
                Delete company
              </button>
            }

          </div>
        )}
      />
      {isLoading && <SmallLoadingSpinner />}

      {!isLoading && (
        <PaginationBar
          total={total}
          pageSize={NUM_ROWS}
          currentPage={currentPage}
          onPageChange={handlePageClick}
          numRows={orgTableData.length}
        />
      )}
    </div>
  );
}