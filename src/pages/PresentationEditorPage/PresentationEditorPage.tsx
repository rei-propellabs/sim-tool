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
import { Play } from "images/Dynamic/Play";


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

  const [checked, setChecked] = useState<string[]>([]); // Now stores IDs instead of names

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

  const total = scenarioTableData.length;
  const currentPage = Math.floor((pagination.offset ?? 0) / NUM_ROWS) + 1;

  const handlePageClick = (page: number) => {
    // setPagination((prev) => ({
    //   ...prev,
    //   offset: (page - 1) * NUM_ROWS,
    // }));
  };

  const handleCheckboxChange = (id: string) => {
    console.log(id);
    setChecked((prev) => {
      if (prev.includes(id)) {
        // Remove if already selected
        return prev.filter((checkedId) => checkedId !== id);
      } else {
        // Add only if we haven't reached the 3-item limit
        if (prev.length < 3) {
          return [...prev, id];
        }
        return prev; // Don't add if already at 3 items
      }
    });
  };

  const renderNameCell = useCallback(
    (_row: PresentationEditorRow, rowIndex: number) => {
      const isChecked = checked.includes(_row.id);
      const isDisabled = _row.warning ;
      
      return (
        <div className={styles.checkboxCell}>
          <Checkbox
            onChange={(value) => {
              handleCheckboxChange(_row.id);
            }}
            disabled={isDisabled}
            checked={isChecked}
          />
          {_row.name}
        </div>
      );
    },
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
      checked.map((id, index) => {
        const scenario = scenarioTableData.find(s => s.id === id);
        const name = scenario ? scenario.name : id; // Fallback to ID if scenario not found
        
        return (
          <div key={id}
            className={styles.selectedScenarioButtonContainer}
            onClick={() => handleCheckboxChange(id)}
          >
            <span className={styles.number}>{index + 1}</span>
            <span className={styles.checkedName}>{name}</span>
            <CloseFilled size={12} />
          </div>
        );
      })
    );
  };

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
            highlightRows={checked.map(id => scenarioTableData.findIndex(s => s.id === id)).filter(index => index !== -1)}
            columns={orgColumns}
            data={scenarioTableData}
            onRowClick={(index) => {
              handleCheckboxChange(scenarioTableData[index].id);
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
                <span>
                  <Play color={"var(--dark-text)"} size={20} />
                </span>
                Preview Presentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}