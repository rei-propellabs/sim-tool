
import { Breadcrumbs } from "@mui/material"
import RightChevron from "images/RightChevron.svg"

import styles from "./ProjectBreadcrumbs.module.css"

export interface ProjectBreadcrumbsProps {
  texts: string[];
}
export const ProjectBreadcrumbs = (props: ProjectBreadcrumbsProps) => {

  return (
    <Breadcrumbs aria-label="breadcrumb"
      style={{ color: "var(--focused-border)" }}
      separator={<img src={RightChevron} />}>
      {
        props.texts.map((text, index) => (
          <div 
            className={`${styles.breadcrumbsText} ${index === props.texts.length - 1 && styles.currentLevel}`}
            key={`breadcrumbs-${index}`}>{text}</div>
        ))
      }
    </Breadcrumbs>
  )
}