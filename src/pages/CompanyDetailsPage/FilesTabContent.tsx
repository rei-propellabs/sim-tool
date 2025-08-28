import { ColumnConfig, NavigationTable } from "components/NavigationTable/NavigationTable";
import useListAdminUpload from "api/hooks/useListAdminUploads";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./FilesTabContent.module.css"
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import { UploadTableRow } from "types/UploadTableRow";
import { PopupMenu } from "components/ProjectTable/PopupMenu";
import { Chevron } from "images/Dynamic/Chevron";
import useListAdminProjects from "api/hooks/useListAdminProjects";
import { getToken } from "utils/TokenManager";
import navTableStyles from "components/NavigationTable/NavigationTable.module.css";
import MenuDots from "images/MenuDots.svg";

import Delete from "images/Delete.svg";
import { PaginationParams } from "utils/Pagination";
import React from "react";
import { PaginationBar } from "components/PaginationBar/PaginationBar";
import { formatDateMMDDYY } from "utils/DateFormatter";
import usePutAdminUpload from "api/hooks/usePutAdminUpload";
import { setRef } from "@mui/material";
import useDeleteAdminUpload from "api/hooks/useDeleteAdminUpload";
import { StatusTag } from "components/StatusTag/StatusTag";

export const FilesTabContent = () => {
  const NUM_ROWS = 10;

  const query = new URLSearchParams(useLocation().search);
  const orgId = query.get("orgId");
  const projectId = query.get("projectId");

  const navigate = useNavigate();
  const token = getToken("uploadAdmin")

  const [projectTableData, setProjectTableData] = useState<UploadTableRow[]>([]);
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: NUM_ROWS,
    offset: 0,
    orderBy: "DESC",
    order: "createdAt",
  });
  const [showMenu, setShowMenu] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const paginationMemo = useMemo(() => ({ ...pagination }), [pagination, refreshKey]);
  const { isLoading: isLoadingUploads, clientUploads, total } = useListAdminUpload(token, { organizationId: orgId ?? "", projectId: projectId ?? "",pagination: paginationMemo, refreshKey });

  const menuButtonRefs = useRef<Array<React.RefObject<HTMLButtonElement>>>([]);

  const [menuButtonRef, setMenuButtonRef] = useState<React.RefObject<HTMLButtonElement> | null>(null);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null);
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null);
  const [top, setTop] = useState<number>(0);

  const { isLoading: isLoadingProjects, projects } = useListAdminProjects(token, { organizationId: orgId ?? "" });
  const { deleteUpload } = useDeleteAdminUpload(token);

  const { putAdminUpload } = usePutAdminUpload(token);
  const currentPage = Math.floor((pagination.offset ?? 0) / NUM_ROWS) + 1;
  const ignoreNextRowClick = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const UPLOAD_STATUS_META: Record<string, { label: string; color: string }> = {
    Created: { label: "Files Required", color: "var(--waiting)" },
    Completed: { label: "Calculation", color: "var(--actionRequired)" },
  };

  useEffect(() => {
    if (showMenu && menuRef.current) {
      const rect = menuButtonRef?.current?.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight; // Estimate or measure after render
      console.log("menuHeight", menuHeight);
      let top = rect ? rect.bottom : 0;
      const margin = 8;

      if (top + menuHeight + margin > window.innerHeight) {
        top = rect ? rect.top - menuHeight - margin : window.innerHeight - menuHeight - margin;
        if (top < 0) top = margin; // Prevent negative top
      }

      setTop(top);
    }
  }, [showMenu]);

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
            createdAt: formatDateMMDDYY(upload.createdAt),
            updatedAt: formatDateMMDDYY(upload.updatedAt),
            uploadedTo: upload.project?.name ?? "No particular project",
            projectStatus: meta.label,
            projectStatusColor: meta.color,
          }
        })
      );
    }
  }, [isLoadingUploads, clientUploads])

  const columns: ColumnConfig<UploadTableRow>[] = [
    { key: 'name', header: 'Names' },
    { key: 'updatedAt', header: 'Last update' },
    {
      key: 'projectStatus', header: 'Project Status',
      render: (item) => (
        <StatusTag
          text={item.projectStatus ?? ""}
          color={item.projectStatusColor} />
      ),
    },
    // Hide assigning project for now
    // {
    //   key: 'uploadedTo',
    //   header: 'Uploaded to',
    //   render: (upload, rowIndex) => {
    //     if (!menuButtonRefs.current[rowIndex]) {
    //       menuButtonRefs.current[rowIndex] = createRef<HTMLButtonElement>();
    //     }
    //     const thisButtonRef = menuButtonRefs.current[rowIndex];

    //     return (
    //       <button
    //         ref={thisButtonRef}
    //         className={styles.uploadedToButton}
    //         onClick={(e) => {
    //           if (showMenu && ignoreNextRowClick.current) {
    //             setShowMenu(false);
    //             return;
    //           }
    //           e.stopPropagation();
    //           setMenuButtonRef(thisButtonRef);
    //           setSelectedMenuIndex(rowIndex);
    //           setSelectedUploadId(upload.id);
    //           setShowMenu(true);
    //           ignoreNextRowClick.current = true
    //         }}>
    //         <span className={styles.uploadedToText}>
    //           {upload.uploadedTo}
    //         </span>

    //         <span className={styles.chevronContainer}>
    //           <Chevron
    //             rotate={90}
    //             color={"var(--accent)"} />
    //         </span>
    //       </button>
    //     );
    //   },
    // },
    { key: "menu", header: "" },
  ];

  const noUploadText = () => {
    if (clientUploads.length === 0) {
      return (
        <div className={styles.noUploadText}>
          <div className={styles.h1}>No uploads yet</div>
        </div>
      )
    } else {
      return null;
    }

  }

  const assignProjectId = async (projectId: string) => {
    console.log(selectedUploadId)
    if (selectedUploadId && selectedUploadId.length > 0) {
      try {
        const result = await putAdminUpload(selectedUploadId, {
          organizationId: orgId ?? "",
          projectId: projectId,
        });
        console.log(result);
        setRefreshKey((k) => k + 1);

      } catch (e) {
        // todo handle error
        console.log("Error: assignProjectId failed");
      } finally {
        setShowMenu(false);
        ignoreNextRowClick.current = false;
      }

    }

  }

  const handlePageClick = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      offset: (page - 1) * NUM_ROWS,
    }));
  };


  return (
    <div className={styles.pageContainer}>
      
      <NavigationTable
        columns={columns}
        data={projectTableData}
        onRowClick={(index) => {
          if (ignoreNextRowClick.current === true) {
            ignoreNextRowClick.current = false;
            setShowMenu(false);
            return;
          }
          localStorage.setItem("company", JSON.stringify(projects[index]));
          navigate(`/admin/upload?id=${projectTableData[index].id}&orgId=${orgId}`);
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
              className={`buttonNoBg ${navTableStyles.option} ${navTableStyles.deleteOption}`}
              onClick={(e) => {
                e.preventDefault();
                deleteUpload(orgId ?? "", projectTableData[rowIndex].id).then(() => {
                  setRefreshKey((k) => k + 1);
                }).catch((error) => {
                  console.error("Error deleting upload:", error);
                });
                closeMenu();
              }}
            >
              <img src={Delete} />
              Delete upload
            </button>
          </div>
        )}
        expandIndexes={[0, 1, 2]}
      />
      {(!isLoadingUploads && !isLoadingUploads) && noUploadText()}
      {
        (isLoadingUploads || isLoadingUploads) && <SmallLoadingSpinner />
      }

      {!isLoadingUploads && (
        <PaginationBar
          total={total}
          pageSize={NUM_ROWS}
          currentPage={currentPage}
          onPageChange={handlePageClick}
          numRows={clientUploads.length}
        />
      )}

        <PopupMenu
          menuRef={menuRef}
          open={showMenu}
          anchorRef={menuButtonRef ?? { current: null }}
          onClose={() => {
            setShowMenu(false)
            ignoreNextRowClick.current = true;
          }}
          style={{
            top,
            right: menuButtonRef?.current ? window.innerWidth - menuButtonRef.current.getBoundingClientRect().right - 8 : 0,
            marginTop: 2,
          }}
        >
          {
            projects.map((project) => (
              <button
                key={`upload-${project.name}`}
                className={`buttonNoBg ${styles.option}`}
                onClick={(e) => {
                  assignProjectId(project.id);
                  console.log(menuButtonRef?.current?.getBoundingClientRect())

                  e.preventDefault();
                }}
              >
                {project.name}
              </button>
            ))
          }
        
        </PopupMenu>
    </div>
  )
}