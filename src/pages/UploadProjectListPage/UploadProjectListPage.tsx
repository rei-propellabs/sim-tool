import { TopBar } from "components/TopBar/TopBar";
import React, { useEffect, useState } from "react";
import styles from "./UploadProjectListPage.module.css"
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import { ProjectTableRow } from "types/ProjectTableRow";
import { ColumnConfig, NavigationTable } from "components/NavigationTable/NavigationTable";
import useAuthCheck from "api/hooks/useAuthCheck";
import useListClientUpload from "api/hooks/useListClientUpload";
import { getToken } from "utils/TokenManager";
import { PaginationParams } from "utils/Pagination";
import { PaginationBar } from "components/PaginationBar/PaginationBar";
import { formatDateMMDDYY } from "utils/DateFormatter";
import MenuDots from "images/MenuDots.svg";
import navTableStyles from "components/NavigationTable/NavigationTable.module.css";
import Add from "images/Dynamic/Add";
import usePostClientUpload from "api/hooks/usePostClientUpload";
import { StatusTag } from "components/StatusTag/StatusTag";
import { NoItemsText } from "components/NoItemsText/NoItemsText";

export const UploadProjectListPage = () => {
  const NUM_ROWS = 10;
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [projectTableData, setProjectTableData] = useState<ProjectTableRow[]>([]);
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: NUM_ROWS,
    offset: 0,
    orderBy: "DESC",
    order: "createdAt",
  });


  const token = getToken("uploadClient")

  const { isLoading: isLoadingUser, user } = useAuthCheck(token);
  const { isLoading: isLoadingUploads, clientUploads, total } = useListClientUpload(token, pagination);
  const { postClientUpload } = usePostClientUpload(token);

  const currentPage = Math.floor((pagination.offset ?? 0) / NUM_ROWS) + 1;

  const UPLOAD_STATUS_META: Record<string, { label: string; color: string }> = {
    Created: { label: "Files Required", color: "var(--actionRequired)" },
    Completed: { label: "Calculation", color: "var(--waiting)" },
  };

  useEffect(() => {
    if (!isLoadingUploads) {
      console.log(clientUploads)
      setProjectTableData(
        clientUploads.map((upload) => {
          const statusKey = upload.status || "Created";
          const meta = UPLOAD_STATUS_META[statusKey] || { label: statusKey, color: "#C7DBC9" };
          return {
            name: upload.name,
            id: upload.id,
            updatedAt: formatDateMMDDYY(upload.updatedAt),
            uploadedTo: upload.project?.name ?? "No particular project",
            projectStatus: meta.label,
            lastUploadAt: "",
            dataStatus: "Financial Simulation",
            projectStatusColor: meta.color,
          };
        })
      )
    }
  }, [isLoadingUploads, clientUploads])

  useEffect(() => {
    if (!isLoadingUser) {
      localStorage.setItem("user", JSON.stringify(user))
      setTitle(user?.organization.name ?? "Uploads")
    }
  }, [isLoadingUser, user])

  const header = () => {
    return (
      <NavigationHeader
        heading={title}
        actionButtons={
          <button className={styles.newUploadBtn}
            onClick={newUploadOnClick}
          >
            <Add fill="var(--primary-button-text)" />
            New Upload
          </button>
        }
      />
    )
  }

  const newUploadOnClick = async () => {
    const orgName = user?.organization?.name ?? "";
    const totalUploads = total ?? 0;

    const res = await postClientUpload({
      name: `${orgName} Upload${totalUploads ? ` ${totalUploads + 1}` : ""}`
    })
    if (typeof res !== "string") {
      const uploadId = res.id;
      navigate(`/upload/files?id=${uploadId}`)
    }
  }

  const columns: ColumnConfig<ProjectTableRow>[] = [
    { key: 'name', header: 'Uploads' },
    { key: 'updatedAt', header: 'Last update' },
    {
      key: 'projectStatus', header: 'Project Status',
      render: (item) => (
        <StatusTag
          text={item.projectStatus}
          color={item.projectStatusColor} />
      ),
    },
    // { key: 'uploadedTo', header: 'Uploaded to' }
  ];


  const noUploadText = () => {
    if (clientUploads.length === 0) {
      return (
        <NoItemsText
          title="No uploads yet"
          subtitle="Start a new upload to"
          actionButtonText="Start an Upload"
          onActionButtonClick={newUploadOnClick}
        />
      )
    } else {
      return null;
    }

  }

  const handlePageClick = (page: number) => {
    console.log("Page clicked", page);
    setPagination((prev) => ({
      ...prev,
      offset: (page - 1) * NUM_ROWS,
    }));
  };

  return (
    <div className={styles.pageContainer}>
      <TopBar
      // leftElements={
      //   <ProjectBreadcrumbs
      //     texts={["All Companies", "GoldRock Resources"]} />
      // }
      />

      {header()}

      <NavigationTable
        columns={columns}
        data={projectTableData}
        onRowClick={(index) => {
          navigate(`/upload/files?id=${clientUploads[index].id}`)
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
          // No menu actions for uploads, but placeholder for future
          <></>
        )}
      />
      {(!isLoadingUploads && !isLoadingUser) && noUploadText()}
      {
        (isLoadingUploads || isLoadingUser) && (
          <div className={styles.loadingContainer}>
            Loading {user?.organization?.name ?? ""} details
            <SmallLoadingSpinner />
          </div>
        )
      }

      {!isLoadingUploads && (
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