import Logo from "images/Logo.svg"
import styles from "./TopBar.module.css"

interface TopBarProps {
  leftElements?: React.ReactElement;
  rightElements?: React.ReactElement;
  centerElements?: React.ReactElement;
}

export const TopBar = (props: TopBarProps) => {

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbsContainer}>
        <img src={Logo} />
        {props.leftElements}
      </div>

      {/* <img className={styles.userIcon} /> */}

    </div>
  )
}