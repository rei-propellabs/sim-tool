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
import useGetScenarios from "api/hooks/useGetScenarios";
import { PaginationBar } from "components/PaginationBar/PaginationBar";
import { Close } from "images/Dynamic/Close";
import { CloseFilled } from "images/Dynamic/CloseFilled";


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

  const [title, setTitle] = useState<string>("Presentation");
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: NUM_ROWS,
    offset: 0,
    orderBy: "DESC",
    order: "createdAt",
  });

  const [scenarioTableData, setScenarioTableData] = useState<PresentationEditorRow[]>([]);

  const token = getToken("uploadAdmin")
  const query = new URLSearchParams(useLocation().search);

  const orgId = query.get("orgId") || "";

  const { isLoading, data: scenarioData } = useGetScenarios(token, orgId)

  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && scenarioData !== undefined && scenarioData.length > 0) {
      console.log(scenarioData?.length);
      setScenarioTableData(
        scenarioData?.map((scenario) => ({
          name: scenario.name,
          dateAdded: formatDateMMDDYY(scenario.createdAt),
          inventory: "N/A",
          fileChecker: scenario.hasAllFiles ? "Missing Files" : "Completed",
          warning: scenario.hasAllFiles === false,
          id: scenario.id,
          checked: false,
        })) ||
        []
      );
    }
  }, [isLoading, scenarioData, checked]);

  // placeholder data for pagination
  // const paginationMemo = React.useMemo(() => ({ ...pagination }), [pagination, refreshKey]);

  const total = 12
  const currentPage = Math.floor((pagination.offset ?? 0) / NUM_ROWS) + 1;

  const handlePageClick = (page: number) => {
    // setPagination((prev) => ({
    //   ...prev,
    //   offset: (page - 1) * NUM_ROWS,
    // }));
  };

  const handleCheckboxChange = (name: string) => {
    console.log(name);
    setChecked((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const renderNameCell = useCallback(
    (_row: PresentationEditorRow, rowIndex: number) => (
      <div className={styles.checkboxCell}>
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
        {_row.name}
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
        backText="BACK"
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

  const deselectAllOnClick = () => {
    setChecked([]);
  };

  const previewPresentationOnClick = () => {
    // Handle preview presentation logic
    console.log("Preview presentation with:", checked);
  };

  const selectedScenarioButtons = () => {
    return (
      checked.map((name, index) => (
        <div key={index}
          className={styles.selectedScenarioButtonContainer}
          onClick={() => handleCheckboxChange(name)}
        >
          <span className={styles.number}>{index + 1}</span>

          <span className={styles.checkedName}>{name}</span>
          <CloseFilled size={12} />
        </div>
      ))

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

      <div className={styles.contentArea}>
        <div className={styles.scrollableTableContainer}>
          <NavigationTable
            expandIndexes={[0, 1, 2, 3]}
            columns={orgColumns}
            data={scenarioTableData}
            onRowClick={(index) => {
              handleCheckboxChange(scenarioTableData[index].name);
            }}
          />
          {!isLoading && (
            <PaginationBar
              total={total}
              pageSize={NUM_ROWS}
              currentPage={currentPage}
              onPageChange={handlePageClick}
              numRows={scenarioTableData.length}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className={styles.stickyFooter}>
          <div className={styles.footerContent}>
            <div className={styles.footerContentLeft}>
              <div className={styles.footerText}>
                Select up to 3 scenarios
              </div>


              <div className={styles.selectedScenariosContainer}>
                {
                checked.length > 0 ? selectedScenarioButtons() :
                  "No scenarios selected"
                }
              </div>
            </div>

            <div className={styles.footerButtons}>
              <button
                className="border-button"
                onClick={deselectAllOnClick}
                disabled={checked.length === 0}
              >
                Deselect All
              </button>
              <button
                className="primary-button"
                onClick={previewPresentationOnClick}
                disabled={checked.length === 0}
              >
                Preview Presentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}