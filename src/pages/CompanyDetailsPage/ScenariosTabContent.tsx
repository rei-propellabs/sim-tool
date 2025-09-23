import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ScenariosTabContent.module.css"
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import { useEffect, useState } from "react";
import { NoItemsText } from "components/NoItemsText/NoItemsText";
import { ColumnConfig, NavigationTable } from "components/NavigationTable/NavigationTable";
import { Presentation } from "images/Dynamic/Presentation";
import { Edit } from "images/Dynamic/Edit";
import navTableStyles from "components/NavigationTable/NavigationTable.module.css";

export const ScenariosTabContent = () => {

  interface PresentationTableRow {
    name: string;
    dateCreated: string;
    lastUpdated: string;
    action: string;
  }
  const NUM_ROWS = 10;
  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [numRows, setNumRows] = useState<number>(0);
  const [orgTableData, setOrgTableData] = useState<PresentationTableRow[]>([]);

  useEffect(() => {
    if (!isLoading) {
      setOrgTableData(
        [
          {
            name: "Presentation 1",
            dateCreated: "04/04/2024",
            lastUpdated: "04/04/2024",
            action: ""
          },
        ]
      );
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
      key: 'name', header: 'Company',
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
        data={orgTableData}
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
            onActionButtonClick={() => { navigate(`/admin/presentation`) }}
          />
        ) :
          table()
      }

    </div >
  )
}