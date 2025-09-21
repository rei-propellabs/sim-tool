import React from 'react';
import { UploadProjectType } from 'components/types/UploadProjectType';
import styles from './ProjectTable.module.css';
import { ProjectStatus } from "components/types/ProjectStatus";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@mui/material";
import { boxStyle } from "styles/MuiSx";
import MenuDots from "images/MenuDots.svg";
import Edit from "images/Edit.svg";
import Delete from "images/Delete.svg";

import { PopupMenu } from "./PopupMenu";

export const ProjectTable = (projectData: UploadProjectType[]) => {
  const navigate = useNavigate();

  const isAdmin = true;

  const [currentPath, setCurrentPath] = React.useState<string[]>([]);
  const [showMenu, setShowMenu] = React.useState(false);
  const [menuButtonRef, setMenuButtonRef] = React.useState<React.RefObject<HTMLButtonElement> | null>(null);
  // Store refs for each menu button in an array
  const menuButtonRefs = React.useRef<Array<React.RefObject<HTMLButtonElement>>>([]);

  const clientRow = (project: UploadProjectType, index: number) => {
    return (
      <tr className={styles.tr} key={index}>
        <td className={styles.td}>{project.project}</td>
        <td className={styles.td}>{project.boreholes ?? "N/A"}</td>
        <td className={styles.td}>{project.lastUpdate}</td>
        <td className={styles.td}>{project.due ?? "N/A"}</td>
        <td className={styles.td}>{project.dataStatus}</td>
        <td className={styles.td}>
          <div className={styles.status}
            style={{ background: ProjectStatus[project.projectStatus].color }}>
            {ProjectStatus[project.projectStatus].text}
          </div>
        </td>
        <td className={styles.td}>
          <button onClick={() => navigate(`/admin/s`)}>Upload files</button></td>
      </tr>
    )
  }

  const adminCompanyRow = (project: UploadProjectType, index: number) => {
    // Ensure a ref exists for this index
    if (!menuButtonRefs.current[index]) {
      menuButtonRefs.current[index] = React.createRef<HTMLButtonElement>();
    }
    const thisButtonRef = menuButtonRefs.current[index];

    const headers = adminCompaniesHeaders.map((h) => h.id)

    return (
      <tr className={styles.tr} key={index}
        onClick={() => {
          // todo: get the id 
          navigate(`/admin/s?id=${"55358c85-7fb6-46ca-a865-28fa45fa8e0a"}`);
        }}>
          
        <td className={styles.td}>{project.project}</td>
        <td className={styles.td}>{project.boreholes ?? "N/A"}</td>
        <td className={styles.td}>{project.lastUpdate}</td>
        <td className={styles.td}>{project.due ?? "N/A"}</td>
        <td className={styles.td}>{project.dataStatus}</td>
        <td className={styles.td}>
          <div className={styles.status}
            style={{ background: ProjectStatus[project.projectStatus].color }}>
            {ProjectStatus[project.projectStatus].text}
          </div>
        </td>
        <td className={styles.td} style={{ position: "relative" }}>
          <button
            ref={thisButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setMenuButtonRef(thisButtonRef);
              setShowMenu(!showMenu);
            }}
            className={"buttonNoBg"}>
            <img src={MenuDots} />
          </button>
        </td>
      </tr>
    )
  }

  type HeaderType = {
    id: string;
    name: string;
  }

  const clientBoreholeHeaders: HeaderType[] = [
    { id: "project", name: "Project" },
    { id: "boreholes", name: "Boreholes" },
    { id: "lastUpdated", name: "Last Updated" },
    { id: "die", name: "Due" },
    { id: "dataStatus", name: "Data Status" },
    { id: "projectStatus", name: "Project Status" },
    { id: "actions", name: "Actions" },
  ];

  const adminCompaniesHeaders: HeaderType[] = [
    { id: "company", name: "Company" },
    { id: "sites", name: "Sites" },
    { id: "lastUpdate", name: "Last Update" },
    { id: "due", name: "Due" },
    { id: "dataStatus", name: "Data Status" },
    { id: "projectStatus", name: "Project Status" },
    { id: "menu", name: "" },
  ];

  const header = () => {
    let headerTexts: HeaderType[] = [];
    // comapnies should be shown only if the user is admin
    // the root path for client should be sites
    if (isAdmin && currentPath.length === 0) {
      headerTexts = adminCompaniesHeaders;
    }

    return (
      headerTexts.map(({ id, name }) => (
        <th key={`header-${id}`} className={styles.th}>{name}</th>
      ))
    )
  }

  return (
    <div>
      <table
        className={styles.table}
        style={{ width: "100%", textAlign: "left" }}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            {header()}

          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {
            projectData.map((project, index) => (
              isAdmin ? adminCompanyRow(project, index) : clientRow(project, index)
            ))}
        </tbody>
      </table>
      <PopupMenu
        open={showMenu}
        anchorRef={menuButtonRef ?? { current: null }}
        onClose={() => setShowMenu(false)}
        style={{
          top: menuButtonRef ? menuButtonRef.current?.getBoundingClientRect().bottom : 0,
          marginTop: 0,
          right: 20
        }}
      >

        <button className={`buttonNoBg ${styles.option} ${styles.editOption}`}
          onClick={() => {
            navigate("/admin/c/form")
          }}>
          <img src={Edit} />
          Edit details
        </button>


        <button className={`buttonNoBg ${styles.option}  ${styles.deleteOption}`}
          onClick={() => { }}>
          <img src={Delete} />
          Delete client
        </button>
      </PopupMenu>
    </div>

  );
}