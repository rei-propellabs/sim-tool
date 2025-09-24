import { TopBar } from "components/TopBar/TopBar";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./PresentationEditorPage.module.css"
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { ProjectTableRow } from "types/ProjectTableRow";
import { getToken } from "utils/TokenManager";
import { PaginationParams } from "utils/Pagination";
import { formatDateMMDDYY } from "utils/DateFormatter";
import { Presentation } from "images/Dynamic/Presentation";
import { ProjectBreadcrumbs } from "components/ProjectBreadcrumbs/ProjectBreadcrumbs";
import { ColumnConfig, NavigationTable } from "components/NavigationTable/NavigationTable";
import { Checkbox } from "components/Checkbox/Checkbox";


interface PresentationEditorRow {
  name: string;
  inventory: string;
  dateAdded: string;
  fileChecker: string;
  warning: boolean;
  id: string;
  checked: boolean;
}

export const PresentationEditorPage = () => {
  const NUM_ROWS = 10;
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: NUM_ROWS,
    offset: 0,
    orderBy: "DESC",
    order: "createdAt",
  });

  const [scenarioTableData, setScenarioTableData] = useState<PresentationEditorRow[]>([]);

  const token = getToken("uploadClient")
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading) {
      setScenarioTableData(
        [
          {
            name: "Presentation 1",
            dateAdded: "04/04/2024",
            inventory: "Ron Carter",
            fileChecker: "No Issues",
            warning: false,
            id: "0",
            checked: false,
          },
          {
            name: "Presentation 2",
            dateAdded: "04/04/2024",
            inventory: "Ron Carter",
            fileChecker: "Missing files",
            warning: true,
            id: "1",
            checked: false,
          },
        ]
      );
    }
  }, [isLoading, checked]);

  const handleCheckboxChange = (name: string) => {
    console.log(name);
    setChecked((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const renderNameCell = useCallback(
    (_row: PresentationEditorRow, rowIndex: number) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Checkbox
          onChange={(value) => {
            if (value) {
              setChecked((prev) => [...prev, _row.name]);
            } else {
              setChecked((prev) => prev.filter((n) => n !== _row.name));
            }
          }}
          disabled={_row.warning}
          checked={checked.includes(_row.name)}
        />

        <span onClick={() => handleCheckboxChange(_row.name)} style={{ cursor: 'pointer' }}>
          {_row.name}
        </span>
      </div>

    ),
    [checked, handleCheckboxChange]
  );

  const orgColumns: ColumnConfig<PresentationEditorRow>[] = [
    {
      key: "name", header: "Scenarios",
      render: renderNameCell
    },
    {
      key: "inventory", header: "Inventory",
    },
    {
      key: "dateAdded", header: "Date Added",
    },
    {
      key: "fileChecker", header: "File Checker",
      render: (row) => (
        row.warning ?
          <span style={{ color: "var(--error)" }}>
            Issues Found
          </span>
          :
          <span style={{ color: "var(--success)" }}>No Issues</span>
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
        data={scenarioTableData}
        onRowClick={(index) => {
          handleCheckboxChange(scenarioTableData[index].name);
        }}
      />
    </div>
  );
}