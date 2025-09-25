import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ScenariosTabContent.module.css"
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import { useEffect, useMemo, useState } from "react";
import { NoItemsText } from "components/NoItemsText/NoItemsText";
import { ColumnConfig, NavigationTable } from "components/NavigationTable/NavigationTable";
import { Presentation } from "images/Dynamic/Presentation";
import { Edit } from "images/Dynamic/Edit";
import navTableStyles from "components/NavigationTable/NavigationTable.module.css";
import { PaginationBar } from "components/PaginationBar/PaginationBar";
import useListPresentation from "api/hooks/useListPresentation";
import { getToken } from "utils/TokenManager";
import { PaginationParams } from "utils/Pagination";

interface ScenariosTabContentProps {
  companyName: string;
}
export const ScenariosTabContent = ({ companyName }: ScenariosTabContentProps) => {

  interface PresentationTableRow {
    name: string;
    dateCreated: string;
    lastUpdated: string;
    action: string;
  }
  const NUM_ROWS = 10;
  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);
  const [numRows, setNumRows] = useState<number>(0);
  const [presentationTableData, setPresentationTableData] = useState<PresentationTableRow[]>([]);
  const orgId = query.get("orgId") ?? "";

  const [pagination, setPagination] = useState<PaginationParams>({
    limit: NUM_ROWS,
    offset: 0,
    orderBy: "DESC",
    order: "createdAt",
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const paginationMemo = useMemo(() => ({ ...pagination }), [pagination, refreshKey]);

  const token = getToken("uploadAdmin")
  const { isLoading, presentations, total } = useListPresentation(token, orgId, paginationMemo, refreshKey);

  // placeholder data
  const currentPage = Math.floor((pagination.offset ?? 0) / NUM_ROWS) + 1;

  const handlePageClick = (page: number) => {
    // setPagination((prev) => ({
    //   ...prev,
    //   offset: (page - 1) * NUM_ROWS,
    // }));
  };


  useEffect(() => {
    if (!isLoading) {
      setPresentationTableData(
        presentations.map((presentation) => ({
          name:`${companyName ?? ""} Presentation`,
          dateCreated: new Date(presentation.createdAt).toLocaleDateString(),
          lastUpdated: new Date(presentation.updatedAt).toLocaleDateString(),
          action: ""
        }))
      );
      setNumRows(presentations.length);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div>
          Loading scenario folders from server
          <SmallLoadingSpinner />
        </div>

      </div>
    )
  }

  const orgColumns: ColumnConfig<PresentationTableRow>[] = [
    {
      key: 'name', header: 'Presentations',
    },
    // { key: 'lastUploadAt', header: 'Last upload' },
    {
      key: 'dateCreated', header: 'Date Created',
    },
    { key: 'lastUpdated', header: 'Last Updated' },
    {
      key: 'actions',
      header: 'Actions',
      render: (scenario) => {
        // if (scenario.uploadCount === 0) return null;
        return (
          <button
            className={"primary-button"}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/scenarios?orgId=${query.get("orgId")}`);
            }}>
            <Presentation size={16} />
            Launch Presentation
          </button>
        );
      },
    },
    { key: 'menu', header: 'Menu' },

  ];


  const table = () => {
    return (
      <NavigationTable
        expandIndexes={[0, 1, 2, 3]}
        columns={orgColumns}
        data={presentationTableData}
        onRowClick={(index) => {
          // localStorage.setItem("company", JSON.stringify(organizations[index]));

          // navigate(`/admin/c?t=${organizations[index].uploadCount === 0 ? 0 : 1}&orgId=${organizations[index].id}`);
        }}
        renderMenu={(rowIndex, closeMenu) => (
          <div>
            <button
              className={`buttonNoBg 
              ${navTableStyles.option} ${navTableStyles.editOption}`
              }
              onClick={(e) => {
                e.preventDefault();
                // navigate(`/admin/c?orgId=${organizations[rowIndex].id}`);
              }}
            >
              <Edit size={16} />
              Edit
            </button>
          </div>
        )}
      />
    )
  }


  return (
    <div className={styles.pageContainer}>
      {
        numRows === 0 ? (
          <NoItemsText
            title="No Presentations yet"
            subtitle="Create a Presentation to select the desired scenarios"
            actionButtonText="Create a Presentation"
            onActionButtonClick={() => { navigate(`/admin/presentation?orgId=${orgId}`) }}
          />
        ) :
          table()
      }
      {!isLoading && (
        <PaginationBar
          total={total}
          pageSize={NUM_ROWS}
          currentPage={currentPage}
          onPageChange={handlePageClick}
          numRows={presentationTableData.length}
        />
      )}
    </div >
  )
}