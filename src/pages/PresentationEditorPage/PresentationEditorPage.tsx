import { TopBar } from "components/TopBar/TopBar";
import React, { useEffect, useState } from "react";
import styles from "./PresentationEditorPage.module.css"
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { ProjectTableRow } from "types/ProjectTableRow";
import useAuthCheck from "api/hooks/useAuthCheck";
import useListClientUpload from "api/hooks/useListClientUpload";
import { getToken } from "utils/TokenManager";
import { PaginationParams } from "utils/Pagination";
import { formatDateMMDDYY } from "utils/DateFormatter";
import Add from "images/Dynamic/Add";
import usePostClientUpload from "api/hooks/usePostClientUpload";
import { Presentation } from "images/Dynamic/Presentation";
import { ProjectBreadcrumbs } from "components/ProjectBreadcrumbs/ProjectBreadcrumbs";
import { ColumnConfig, NavigationTable } from "components/NavigationTable/NavigationTable";


interface PresentationEditorRow {
  name: string;
  inventory: string;
  dateAdded: string;
  fileChecker: string;
  warning: boolean;
}

export const PresentationEditorPage = () => {
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

  const [orgTableData, setOrgTableData] = useState<PresentationEditorRow[]>([]);

  const token = getToken("uploadClient")
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      setOrgTableData(
        [
          {
            name: "Presentation 1",
            dateAdded: "04/04/2024",
            inventory: "Ron Carter",
            fileChecker: "No Issues",
            warning: false
          },
          {
            name: "Presentation 2",
            dateAdded: "04/04/2024",
            inventory: "Ron Carter",
            fileChecker: "Missing files",
            warning: true
          },
        ]
      );
    }
  }, [isLoading]);

  const orgColumns: ColumnConfig<PresentationEditorRow>[] = [
    {
      key: 'name', header: 'Scenarios',
    },
    {
      key: 'inventory', header: 'Inventory',
    },
    {
      key: 'dateAdded', header: 'Date Added',
    },
    {
      key: 'fileChecker', header: 'File Checker',
      render: (row) => (
        row.warning ?
          <span style={{ color: 'var(--error)' }}>
            Issues Found
          </span>
          :
          <span style={{ color: 'var(--success)' }}>No Issues</span>
      )
    },
  ]

  const cancelOnClick = () => { }
  const saveOnClick = () => { }

  const header = () => {
    return (
      <NavigationHeader
        heading={title}
        headerIcon={<Presentation color={"var(--default-text)"} size={28} />}
        actionButtons={
          <div className="flex-row gap-8">
            <button
              className={"border-button"}
              onClick={cancelOnClick}
            >
              Cancel
            </button>
            <button className={"primary-button"}
              onClick={saveOnClick}
            >
              Save & Exit
            </button>
          </div>
        }
      />
    )
  }

  return (
    <div className={styles.pageContainer}>
      <TopBar
        leftElements={
          <ProjectBreadcrumbs
            texts={["All Projects"]} />
        }
      />

      {header()}

      <NavigationTable
        expandIndexes={[0, 1, 2, 3]}
        columns={orgColumns}
        data={orgTableData}
        onRowClick={(index) => {
          // localStorage.setItem("company", JSON.stringify(organizations[index]));

          // navigate(`/admin/c?t=${organizations[index].uploadCount === 0 ? 0 : 1}&orgId=${organizations[index].id}`);
        }}
      />
    </div>
  );
}