import { TopBar } from "components/TopBar/TopBar";
import styles from "./UploadFilesPage.module.css"
import { FileInput } from "components/FileInput/FileInput";
import { useEffect, useRef, useState } from "react";
import { FileInfo } from "models/FileInfo";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { FileType } from "./types/FileType";
import useListAdminFiles from "api/hooks/useListAdminFiles";
import useDownloadFile from "api/hooks/useDownloadFile";
import { getToken } from "utils/TokenManager";
import useDownloadAllFiles from "api/hooks/useDownloadAllFiles";
import { Box, CircularProgress } from "@mui/material";
import { Download } from "images/Dynamic/Download";

interface SupplementaryInfo {
  unit: string;
  subBlockScheme: string;
  categoricalField: string;
  preTransformation: string;
  softwareUsed: string;
  metallurgicalData: string;
  constraints: string;
}

export const UploadFilesAdminPage = () => {
  const [blockModel, setBlockModel] = useState<FileInfo | undefined>();
  const [readme, setReadme] = useState<FileInfo | undefined>();
  const [topographicModel, setTopographicModel] = useState<FileInfo | undefined>();
  const [technicalReport, setTechnicalReport] = useState<FileInfo | undefined>();
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [numFiles, setNumFiles] = useState(0);

  const [showSubmitPrompt, setShowSubmitPrompt] = useState<boolean>(false);

  const [supplementaryInfo, setSupplementaryInfo] = useState<SupplementaryInfo>({
    unit: "",
    subBlockScheme: "",
    categoricalField: "",
    preTransformation: "",
    softwareUsed: "",
    metallurgicalData: "",
    constraints: ""
  });

  const navigate = useNavigate()
  const query = new URLSearchParams(useLocation().search);
  const uploadId = query.get("id") ?? "";
  const orgId = query.get("orgId") ?? "";
  const token = getToken("uploadAdmin");

  const { isLoading: isLoadingFiles, files, listFilesResponse } = useListAdminFiles(token, { organizationId: orgId, uploadId: uploadId });
  const { downloadFile } = useDownloadFile(token)
  const { downloadAllFiles } = useDownloadAllFiles(token)

  useEffect(() => {
    if (uploadId.length === 0 || orgId.length === 0) {
      navigate("/admin");
    }
  }, [])

  useEffect(() => {
    if (!isLoadingFiles && listFilesResponse) {
      setNumFiles(files.length);
      listFilesResponse.files.forEach(file => {

        const fileInfo = JSON.parse(file.intension) as FileInfo
        if (fileInfo) {

          fileInfo.status = "download"
          fileInfo.id = file.id;
          if (fileInfo?.type) {
            switch (fileInfo.type) {
              case FileType.BLOCK_MODEL:
                setBlockModel(fileInfo);
                break;
              case FileType.README:
                setReadme(fileInfo);
                break;
              case FileType.REPORT:
                setTechnicalReport(fileInfo);
                break;
              case FileType.TOPOGRAPHIC:
                setTopographicModel(fileInfo);
                break;
              default:
                break;
            }
          }
        }

      });

      if (listFilesResponse.supplementaryInfo) {
        const parsedInfo = JSON.parse(listFilesResponse.supplementaryInfo);
        console.log("Parsed supplementary info", parsedInfo);
        setSupplementaryInfo({
          unit: parsedInfo.unit || "",
          subBlockScheme: parsedInfo.subBlockScheme || "",
          categoricalField: parsedInfo.categoricalField || "",
          preTransformation: parsedInfo.preTransformation || "",
          softwareUsed: parsedInfo.softwareUsed || "",
          metallurgicalData: parsedInfo.metallurgicalData || "",
          constraints: parsedInfo.constraints || ""
        });
      }
    }
  }, [isLoadingFiles])

  const handleDownloadFile = async (fileId: string) => {
    return downloadFile({ fileId, organizationId: orgId });
  }

  const handleDownloadAllFiles = async () => {
    setIsDownloadingAll(true);
    try {
      await downloadAllFiles({ uploadId, organizationId: orgId });
    } catch (error) {
      console.error("Error downloading all files:", error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <div className={styles.pageContainer} style={showSubmitPrompt ? { filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
      <TopBar />
      <NavigationHeader
        heading={"Upload Center"}
        backText="BACK TO PROJECT"
        onBackClick={() => { navigate(`/admin/c?t=1&orgId=${orgId}`) }}
        actionButtons={
          numFiles > 0 &&
          <button
            ref={menuButtonRef}
            className={styles.downloadAllButton}
            onClick={() => {
              handleDownloadAllFiles()
            }}
            disabled={isDownloadingAll}
          >
            <Download size={22} color={"var(--primary-button-text)"} />
            <span className={styles.downloadAllText}>Download all available files ({numFiles})</span>
            {
              isDownloadingAll &&
              <CircularProgress size={16} thickness={5} sx={{ color: "var(--primary-button-text)" }} />
            }
          </button>
        }
      />
      <div className={styles.container}>

        {/* Block Model */}
        <div className={styles.title}>Block Model</div>
        <div className={styles.requiredContainer}>
          {
            blockModel &&
            <FileInput
              id={FileType.BLOCK_MODEL}
              fileInfo={blockModel}
              onDownloadClick={() => {
                console.log("Downloading Block Model", blockModel)
                if (blockModel.id) {
                  return handleDownloadFile(blockModel.id)
                }
              }}
              download
            />
          }

          <div className={styles.fieldTitle}>
          </div>
          {
            readme &&
            <FileInput
              id={FileType.README}
              fileInfo={readme}
              onDownloadClick={() => {
                console.log("Downloading Readme", readme)
                if (readme.id) {
                  return handleDownloadFile(readme.id);
                }
              }}
              download
            />
          }

          {
            supplementaryInfo.unit &&
            <div className={styles.fieldDetails}>
              Grade units if not obvious in colum header
              <input type="text"
                className={styles.inputField}
                placeholder="Grade units"
                name="unit"
                value={supplementaryInfo.unit}
                onChange={() => { }}
                readOnly
                tabIndex={-1}
              />

            </div>
          }

          {
            supplementaryInfo.subBlockScheme &&
            <div className={styles.fieldDetails}>
              <span style={{ color: "var(--darker-text)" }}>(If sub-blocked)</span> Sub-block scheme (e.g. octree) & number of sub-blocks per parent in each dimension (if fixed)
              <input type="text"
                className={styles.inputField} placeholder="Sub-block scheme and amount"
                name="subBlockScheme"
                value={supplementaryInfo.subBlockScheme}
                onChange={() => { }}
                readOnly
                tabIndex={-1}
              />
            </div>
          }

          {
            supplementaryInfo.categoricalField &&
            <div className={styles.fieldDetails}>
              Explanation of relevant categorical fields
              <input type="text" className={styles.inputField} placeholder="E.g. ”MINED” or ”ZONE”"
                name="categoricalField"
                value={supplementaryInfo.categoricalField}
                onChange={() => { }}
                readOnly
                tabIndex={-1}
              />
            </div>
          }
          {
            supplementaryInfo.preTransformation &&
            <div className={styles.fieldDetails}>
              Any pre-transformation required from XYZ to block model coordinate system
              <input type="text" className={styles.inputField} placeholder="E.g. Pre-rotation"
                name="preTransformation"
                value={supplementaryInfo.preTransformation}
                onChange={() => { }}
                readOnly
                tabIndex={-1}
              />
            </div>
          }

          {
            supplementaryInfo.softwareUsed &&
            <div className={styles.fieldDetails}>
              Software that was used to create the block model
              <input type="text" className={styles.inputField} placeholder="E.g. Datamine"
                name="softwareUsed"
                value={supplementaryInfo.softwareUsed}
                onChange={() => { }}
                readOnly
                tabIndex={-1}
              />

            </div>
          }

        </div>


        {/* End Block Model */}

        {/* Surface Topographic Model */}
        <div className={styles.title}>Surface Topographic Model</div>

        <div className={styles.requiredContainer}>
          {
            topographicModel &&
            <FileInput
              id={FileType.TOPOGRAPHIC}
              fileInfo={topographicModel}
              onDownloadClick={() => {
                if (topographicModel.id) {
                  return handleDownloadFile(topographicModel.id)
                }
              }}
              download
            />
          }
        </div>
        {/* End Surface Topographic Model */}

        {/* Technical Report */}
        <div className={styles.title}>Technical Report</div>

        <div className={styles.optionalContainer}>
          <div className={styles.requiredContainer}>
            {
              technicalReport ?
                <FileInput
                  id={FileType.REPORT}
                  fileInfo={technicalReport}
                  onDownloadClick={() => {
                    if (technicalReport.id) {
                      return handleDownloadFile(technicalReport.id)
                    }
                  }}
                  download
                />
                :
                <div>N/A</div>
            }

          </div>
          <div className={styles.title}>Other</div>

          <div className={styles.fieldDescription}>
            Any existing metallurgical data assumptions
            <textarea
              className={styles.textarea}
              placeholder="E.g. Process plant recovery per element"
              name="metallurgicalData"
              value={supplementaryInfo.metallurgicalData}
              onChange={() => { }}
              readOnly
              tabIndex={-1}
            />

          </div>

          <div className={styles.fieldDescription}>
            Any constraints
            <textarea
              className={styles.textarea}
              placeholder="E.g. Zone or domain to be targeted or avoided"
              name="constraints"
              value={supplementaryInfo.constraints}
              onChange={() => { }}
              readOnly
              tabIndex={-1}
            />
          </div>

        </div>

      </div>

    </div>
  );
}