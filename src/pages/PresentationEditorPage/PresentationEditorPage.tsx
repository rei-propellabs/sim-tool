import { TopBar } from "components/TopBar/TopBar";
import { useCallback, useEffect, useState } from "react";
import styles from "./PresentationEditorPage.module.css"
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
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
import useGetOrganizationById from "api/hooks/useGetOrganizationById";
import usePostPresentation from "api/hooks/usePostPresentation";
import useGetScenariosByProjectId from "api/hooks/useGetScenariosByProjectId";
import usePutPresentation from "api/hooks/usePutPresentation";

import WarningIcon from "images/Warning.svg";

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

  const token = getToken("uploadAdmin")
  const query = new URLSearchParams(useLocation().search);

  const orgId = query.get("orgId") || "";
  const projectId = query.get("projectId") || "";
  const { isLoading: isLoadingOrg, organization } = useGetOrganizationById(token, orgId || undefined);
  const { isLoading: isLoadingPreselectedScenarios, data: preselectedScenarios } = useGetScenariosByProjectId(token, orgId, projectId);
  const { isLoading, data: scenarioData } = useGetScenarios(token, orgId)
  const { postPresentation } = usePostPresentation(token);
  const { putPresentation } = usePutPresentation(token);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    let preselecetedIds: string[] = [];

    if (!isLoadingPreselectedScenarios && preselectedScenarios) {
      preselecetedIds = preselectedScenarios ? preselectedScenarios.map(scenario => scenario.id) : [];
      setSelectedIds(preselecetedIds);
      if (preselecetedIds.length > 0) {
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    }

    if (!isLoading && scenarioData !== undefined && scenarioData.length > 0) {

      setScenarioTableData(
        scenarioData?.map((scenario) => ({
          name: scenario.name,
          dateAdded: formatDateMMDDYY(scenario.createdAt),
          inventory: "N/A",
          fileChecker: scenario.hasAllFiles ? "Missing Files" : "Completed",
          warning: scenario.hasAllFiles === false,
          id: scenario.id,
          checked: preselecetedIds.includes(scenario.id),
        })) ||
        []
      );
    }
  }, [isLoading, scenarioData, isLoadingPreselectedScenarios, preselectedScenarios]);

  useEffect(() => {
    if (!isLoadingOrg && organization) {
      setTitle(`${organization.name} Presentation`);
    }
  }, [isLoadingOrg, organization]);

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
    setSelectedIds((prev) => {
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
      const isChecked = selectedIds.includes(_row.id);
      const isDisabled = _row.warning;

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
    [selectedIds, handleCheckboxChange]
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
          <div className="flex-row gap-8">
            <img src={WarningIcon} />
            <span style={{ color: "var(--warning200)" }}>
              Missing Files
            </span>
          </div>
          :
          <span style={{ color: "var(--success)" }}>Complete</span>
      )
    },
  ]

  const backToPresentationList = () => {
    navigate(`/admin/c?t=2&orgId=${orgId}`)
  }
  const cancelOnClick = () => { backToPresentationList() }

  const handlePresentationSave = (onSuccess?: (res: any) => void) => {
    if (selectedIds.length === 0) return;

    if (isEditing) {
      if (preselectedScenarios !== undefined && preselectedScenarios.length > 0) {
        const payload = {
          organizationId: orgId,
          id: preselectedScenarios![0].presentationId,
          scenarios: selectedIds
        }
        putPresentation(payload).then((res) => {
          console.log("Presentation updated:", res);
          if (onSuccess) onSuccess(res);
        })
      }

    } else {
      const payload = {
        organizationId: orgId,
        projectId: scenarioData![0].projectId,
        scenarios: selectedIds
      }
      postPresentation(payload).then((res) => {
        console.log("Presentation created:", res);
        if (onSuccess) onSuccess(res);
      });
    }

  };

  const saveOnClick = () => {
    handlePresentationSave(() => backToPresentationList());
  }

  const header = () => {
    return (
      <NavigationHeader
        heading={title}
        backText="BACK"
        onBackClick={cancelOnClick}
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
    setSelectedIds([]);
  };

  const previewPresentationOnClick = () => {
    handlePresentationSave(() => navigate(`/admin/scenarios?orgId=${orgId}&projectId=${projectId}`));
  };

  const selectedScenarioButtons = () => {
    return (
      selectedIds.map((id, index) => {
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
            highlightRows={selectedIds.map(id => scenarioTableData.findIndex(s => s.id === id)).filter(index => index !== -1)}
            columns={orgColumns}
            data={scenarioTableData}
            onRowClick={(index) => {
              if (scenarioTableData[index].warning) return;
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
                  selectedIds.length > 0 ? selectedScenarioButtons() :
                    "No scenarios selected"
                }
              </div>
            </div>

            <div className={styles.footerButtons}>
              <button
                className="border-button"
                onClick={deselectAllOnClick}
                disabled={selectedIds.length === 0}
              >
                Deselect All
              </button>
              <button
                className="primary-button"
                onClick={previewPresentationOnClick}
                disabled={selectedIds.length === 0}
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