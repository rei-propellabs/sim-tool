import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ScenariosTabContent.module.css"
import { SmallLoadingSpinner } from "components/SmallLoadingSpinner/SmallLoadingSpinner";
import { useState } from "react";
import { NoItemsText } from "components/NoItemsText/NoItemsText";

export const ScenariosTabContent = () => {
  const NUM_ROWS = 10;

  const query = new URLSearchParams(useLocation().search);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [numRows, setNumRows] = useState<number>(0);

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

  return (
    <div className={styles.pageContainer}>
      {
        numRows === 0 ? (
          <NoItemsText
            title="No Presentations yet"
            subtitle="Create a Presentation to select the desired scenarios"
            actionButtonText="Create a Presentation"
            onActionButtonClick={() => { }}
          />
        ) :
          (
            <>

              <SmallLoadingSpinner />
            </>
          )
      }

    </div >
  )
}