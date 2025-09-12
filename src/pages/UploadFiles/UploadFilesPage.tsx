import { TopBar } from "components/TopBar/TopBar";
import styles from "./UploadFilesPage.module.css"
import Attention from 'images/Attention.svg'
import { FileInput } from "components/FileInput/FileInput";
import { useEffect, useRef, useState } from "react";
import { Info } from "images/Dynamic/Info";
import { FileStatus } from "components/types/FileStatus";
import { FileInfo } from "models/FileInfo";
import { CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { NavigationHeader } from "components/NavigationHeader/NavigationHeader";
import { Close } from "images/Dynamic/Close";
import { Check } from "images/Dynamic/Check";
import { useNavigate } from "react-router-dom";
import { PopupMenu } from "components/ProjectTable/PopupMenu";
import useListClientProjects from "api/hooks/useGetClientProjects";
import usePostClientUpload from "api/hooks/usePostClientUpload";
import { Chevron } from "images/Dynamic/Chevron";
import { useMultiFileUpload } from "api/hooks/useFileUpload";
import usePutClientUpload from "api/hooks/usePutClientUpload";
import useMarkComplete from "api/hooks/useMarkComplete";
import { FileType } from "./types/FileType";
import { SupplementaryInfo } from "./types/SupplementaryInof";
import { getToken } from "utils/TokenManager";
import useGetClientUpload from "api/hooks/useGetClientUpload";
import useDeleteClientFile from "api/hooks/useDeleteClientFile";

export const UploadFilesPage = () => {
  // Read orgName and totalUploads from URL params
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const uploadId = searchParams.get("id");

  useEffect(() => {
    if (!uploadId) {
      navigate("/upload/project");
    }
  }, [uploadId, navigate]);

  const [blockModel, setBlockModel] = useState<FileInfo>({ status: "required", type: FileType.BLOCK_MODEL });
  const [readme, setReadme] = useState<FileInfo>({ status: "recommended", type: FileType.README });
  const [topographicModel, setTopographicModel] = useState<FileInfo>({ status: "required", type: FileType.TOPOGRAPHIC });
  const [technicalReport, setTechnicalReport] = useState<FileInfo>({ status: "recommended", type: FileType.REPORT });
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);
  const [showSubmitPrompt, setShowSubmitPrompt] = useState<boolean>(false);
  const [pendingUploads, setPendingUploads] = useState<Array<{ id: string, file: File, intension: string }>>([]);
  const [metadataOptionTabIndex, setMetadataOptionTabIndex] = useState<number>(0)
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  const [supplementaryInfo, setSupplementaryInfo] = useState<SupplementaryInfo>({
    unit: "",
    subBlockScheme: "",
    categoricalField: "",
    preTransformation: "",
    softwareUsed: "",
    metallurgicalData: "",
    constraints: ""
  });

  const [assignToProjectId, setAssignToProjectId] = useState<string | undefined>(undefined);
  const [allowNavigation, setAllowNavigation] = useState<boolean>(true);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const token = getToken("uploadClient")

  const { isLoading: isLoadingProjects, projects } = useListClientProjects(token);
  const { isLoading: isLoadingFiles, files, listFilesResponse } = useGetClientUpload(token, uploadId ?? "");

  const { uploadFile, uploads, setUploads } = useMultiFileUpload(token);
  const { putClientUpload } = usePutClientUpload(token);
  const { markComplete } = useMarkComplete(token);
  const { deleteFile } = useDeleteClientFile(token);

  useEffect(() => {
    checkReadyToSubmit();
    const uploading = blockModel.status === "uploading" ||
      readme.status === "uploading" ||
      topographicModel.status === "uploading" ||
      technicalReport.status === "uploading"
    setAllowNavigation(!uploading);
  }, [blockModel, readme, topographicModel, supplementaryInfo, metadataOptionTabIndex]);

  // warning before refresh or quit
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log("isReadOnly", isReadOnly)
      if (!isReadOnly && !allowNavigation) {
        const message = "Changes that you made may not be saved.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      };
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isReadOnly, allowNavigation]);

  // Warning before back button and navigation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (!isReadOnly && !allowNavigation && !isNavigating) {
        // Prevent the navigation
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);

        const userConfirmed = window.confirm("Leave site?\n\nChanges that you made may not be saved.");
        if (userConfirmed) {
          // Allow navigation by setting the flag and going back
          setIsNavigating(true);
          window.history.back();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isReadOnly, allowNavigation, isNavigating]);


  useEffect(() => {
    if (!isLoadingFiles && listFilesResponse) {
      const completed = listFilesResponse.status === "Completed";
      setIsReadOnly(completed);

      listFilesResponse.files.forEach(file => {
        const fileInfo = JSON.parse(file.intension) as FileInfo
        if (fileInfo) {
          fileInfo.status = completed ? "readOnly" : "uploaded"
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

  const checkReadyToSubmit = () => {
    const modelUploaded = blockModel.status === "uploaded" &&
      topographicModel.status === "uploaded";

    let blockModelMetadataUploaded = false;
    if (metadataOptionTabIndex === 0) {
      blockModelMetadataUploaded = readme.status === "uploaded";
    } else {
      blockModelMetadataUploaded = supplementaryInfo.unit.length > 0 &&
        supplementaryInfo.subBlockScheme.length > 0 &&
        supplementaryInfo.categoricalField.length > 0 &&
        supplementaryInfo.preTransformation.length > 0 &&
        supplementaryInfo.softwareUsed.length > 0
    }
    const isReady = modelUploaded && blockModelMetadataUploaded
    setReadyToSubmit(isReady);
  }

  const handleMarkComplete = async () => {
    if (uploadId) {
      await markComplete({ id: uploadId });
      navigate("/upload/project");
    }
  }

  const handleUploadFile = async (id: string, file: File, intension: string) => {
    if (uploadId) {
      const res = await uploadFile({ id, file, uploadId, intension })
      if (res?.success && res.fileId) {
        const fileId = res.fileId;
        // Set fileId to the correct fileInfo state
        switch (id) {
          case FileType.BLOCK_MODEL:
            setBlockModel(prev => ({ ...prev, id: fileId }));
            break;
          case FileType.README:
            setReadme(prev => ({ ...prev, id: fileId }));
            break;
          case FileType.REPORT:
            setTechnicalReport(prev => ({ ...prev, id: fileId }));
            break;
          case FileType.TOPOGRAPHIC:
            setTopographicModel(prev => ({ ...prev, id: fileId }));
            break;
          default:
            break;
        }
      }
    }
  }

  const FileStatusTag: React.FC<{ status?: FileStatus }> = ({ status }) => {
    switch (status) {
      case "required":
        return <div className={styles.fileStatusText}
          style={{ backgroundColor: "#E5F3EBDE" }}>
          <img src={Attention} className={styles.attentionIcon} />
          Required</div>;
      case "uploading":
        return <div className={styles.fileStatusText}
          style={{ backgroundColor: "#F7C368" }}>
          <CircularProgress size={10} sx={{ color: "var(--black)" }} />
          Uploading</div>;
      case "uploaded":
        return <div className={styles.fileStatusText}
          style={{ backgroundColor: "#37BA74" }}>Uploaded</div>;
      case "error":
        return <div className={styles.fileStatusText}
          style={{ backgroundColor: "#FF6E45" }}>Error</div>;
      case "recommended":
        return <div className={styles.fileStatusText}
          style={{ backgroundColor: "#E5F3EBDE" }}>Recommended</div>;
      default:
        return null
    }
  }

  const saveSupplementaryInfo = async () => {
    if (!uploadId) return;
    const supplementaryInfoObj = JSON.stringify(supplementaryInfo)
    try {
      const result = await putClientUpload({
        id: uploadId,
        supplementaryInfo: supplementaryInfoObj
      });
      console.log(result);
    } catch (e) {
      console.log("Error: save supplementaryInfo failed");
    }
  }

  const assignProjectId = async (projectId: string) => {
    if (uploadId) {
      try {
        const result = await putClientUpload({
          projectId: projectId,
          id: uploadId
        });
        console.log(result);
        await handleMarkComplete();

      } catch (e) {
        console.log("Error: assignProjectId failed");
      }
    }
  }

  const allInfoProvided = () => {
    return blockModel.status === "uploaded" &&
      topographicModel.status === "uploaded" &&
      (metadataOptionTabIndex === 0 ? readme.status === "uploaded" : supplementaryInfo.unit.length > 0 &&
        supplementaryInfo.subBlockScheme.length > 0 &&
        supplementaryInfo.categoricalField.length > 0 &&
        supplementaryInfo.preTransformation.length > 0 &&
        supplementaryInfo.softwareUsed.length > 0) &&
      technicalReport.status === "uploaded" &&
      supplementaryInfo.metallurgicalData.length > 0 &&
      supplementaryInfo.constraints.length > 0;
  }
  const CompressRequired = (props: { modelType: string }) => (
    <div className={styles.compressRequiredContainer}>
      <Info color={"var(--warning200)"} size={16} />
      <span>{props.modelType} must be compressed down to max 1GB (Ex.: .zip file)</span>
    </div>
  )

  const handleSupplementaryInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSupplementaryInfo((prev) => ({ ...prev, [name]: value }));
  };

  const onBackClick = () => {
    if (!isReadOnly && !allowNavigation) {
      const userConfirmed = window.confirm("Leave site?\n\nChanges that you made may not be saved.");
      if (!userConfirmed) {
        return; // Don't navigate if user cancels
      }
    }
    navigate("/upload/project");
  }

  const radio =
    <Radio
      sx={{
        color: "var(--darker-text)",
        '&.Mui-checked': { color: "var(--accent)" },
        '&.Mui-disabled': { color: "var(--darker-text)" }
      }}
    />

  return (
    <>
      <div className={styles.pageContainer} style={showSubmitPrompt ? { filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
        <TopBar />
        <NavigationHeader
          heading="Upload Center"
          onBackClick={onBackClick}
          backText="BACK"
          actionButtons={
            <button
              ref={menuButtonRef}
              disabled={!readyToSubmit || isReadOnly}
              className={styles.submitButton}
              onClick={() => {
                // setShowUploadMenu(true)
                if (!allInfoProvided()) {
                  setAssignToProjectId(undefined);
                  setShowSubmitPrompt(true);
                } else {
                  handleMarkComplete();
                }
              }}
            >
              <span className={styles.uploadToText}>Submit</span>
              {/* <span className={styles.uploadToText}>Upload to</span>
              <span className={styles.chevronRight}>
                <Chevron rotate={90}
                  height="0.7rem"
                  width="0.7rem"
                  color={"var(--primary-button-text)"} />
              </span> */}
            </button>
          }
        />
        <div className={styles.container}>
          <div className={styles.title}>List of required files</div>

          {/* Block Model */}
          <div className={styles.requiredContainer}>
            <div className={styles.titleRow}>
              <div className={styles.fieldTitle}>Block Model
                <div className={styles.requirements}>
                  <span className={styles.requirement}>.dm</span>
                  <span className={styles.requirement}>.csv</span>
                </div>

              </div>
              <FileStatusTag status={blockModel?.status} />

            </div>

            <div className={styles.fieldDetails}>
              Must contain:<br />
              ・XYZ coordinates<br />
              ・Grade for metal(s) to be evaluated<br />
              ・Percentage field, if it exists<br />
              ・Densities (or a single bulk density for the whole deposit)<br />
              ・Block size (if constant, may be provided in metadata below)<br />
              ・Whether minded-out (if any)<br />
            </div>
            <CompressRequired modelType="Block Model" />
            <FileInput
              id={FileType.BLOCK_MODEL}
              fileInfo={blockModel}
              setFileInfo={(v) => {
                setBlockModel(v);
              }}
              uploadStatus={uploads[FileType.BLOCK_MODEL]}
              onUpload={(id, file, intension) => {
                handleUploadFile(id, file, intension)
              }}
              deleteFile={(fileId) => {
                deleteFile(fileId)
                setBlockModel({ status: "required", type: FileType.BLOCK_MODEL })
              }}
              allowedExtensions={["zip", "rar", "dm", "csv"]}
              maxSizeMB={1000}
              required
            />

            <div className={styles.fieldTitle}>Block Model Metadata</div>

            <FormControl>
              <RadioGroup
                name="metadata-option-group"
                value={`${metadataOptionTabIndex}`}
                onChange={(e) => {
                  const index = Number(e.target.value)
                  if (!Number.isNaN(index)) {
                    setMetadataOptionTabIndex(index)
                  }
                }}
              >
                <FormControlLabel
                  value="0"
                  control={radio}
                  label={isReadOnly ? "Readme.txt metadata (view only)" : "Our metadata is already in a readme.txt file"}

                />
                <FormControlLabel
                  value="1"
                  control={radio}
                  label={isReadOnly ? "Manual metadata (view only)" : "We need to provide metadata manually"}

                />
              </RadioGroup>
            </FormControl>

            {
              metadataOptionTabIndex === 0 ?
                <>
                  <div className={styles.fieldTitle}>
                    readme.txt
                    <div className={styles.requirements}>
                      <span className={styles.requirement}>Max 50MB</span>
                      <span className={styles.requirement}>.txt</span>
                    </div>

                  </div>

                  <FileInput
                    id={FileType.README}
                    fileInfo={readme}
                    setFileInfo={(v) => {
                      setReadme(v);
                      // checkStatus();
                    }}
                    onUpload={(id, file, intension) => handleUploadFile(id, file, intension)}
                    uploadStatus={uploads[FileType.README]}
                    deleteFile={() => {
                      deleteFile(readme.id ?? "")
                      setReadme({ status: "required", type: FileType.README })
                    }}
                    required
                    allowedExtensions={["txt"]}
                    maxSizeMB={50}
                  />
                </>
                :
                <>
                  <div className={styles.fieldDetails}>
                    Grade units if not obvious in colum header
                    <input type="text"
                      className={styles.inputField}
                      placeholder="Grade units"
                      name="unit"
                      value={supplementaryInfo.unit}
                      onChange={handleSupplementaryInfoChange}
                      disabled={isReadOnly}
                      onBlur={saveSupplementaryInfo}
                    />

                  </div>
                  <div className={styles.fieldDetails}>
                    <span style={{ color: "var(--darker-text)" }}>(If sub-blocked)</span> Sub-block scheme (e.g. octree) & number of sub-blocks per parent in each dimension (if fixed)
                    <input type="text"
                      className={styles.inputField} placeholder="Sub-block scheme and amount"
                      name="subBlockScheme"
                      value={supplementaryInfo.subBlockScheme}
                      onChange={handleSupplementaryInfoChange}
                      disabled={isReadOnly}
                      onBlur={saveSupplementaryInfo}
                    />
                  </div>
                  <div className={styles.fieldDetails}>
                    Explanation of relevant categorical fields
                    <input type="text" className={styles.inputField} placeholder="E.g. ”MINED” or ”ZONE”"
                      name="categoricalField"
                      value={supplementaryInfo.categoricalField}
                      onChange={handleSupplementaryInfoChange}
                      disabled={isReadOnly}
                      onBlur={saveSupplementaryInfo}

                    />
                  </div>
                  <div className={styles.fieldDetails}>
                    Any pre-transformation required from XYZ to block model coordinate system
                    <input type="text" className={styles.inputField}
                      placeholder="E.g. Pre-rotation"
                      name="preTransformation"
                      value={supplementaryInfo.preTransformation}
                      onChange={handleSupplementaryInfoChange}
                      disabled={isReadOnly}
                      onBlur={saveSupplementaryInfo}
                    />
                  </div>
                  <div className={styles.fieldDetails}>
                    Software that was used to create the block model
                    <input type="text" className={styles.inputField}
                      placeholder="E.g. Datamine"
                      name="softwareUsed"
                      value={supplementaryInfo.softwareUsed}
                      onChange={handleSupplementaryInfoChange}
                      disabled={isReadOnly}
                      onBlur={saveSupplementaryInfo}
                    />

                  </div>
                </>
            }
          </div>

          {/* End Block Model */}

          {/* Surface Topographic Model */}
          <div className={styles.requiredContainer}>
            <div className={styles.titleRow}>
              <div className={styles.fieldTitle}>Surface Topographic Model
              </div>
              <div className={styles.requirements}>
                {/* <span className={styles.requirement}>Max 5GB</span> */}
                <span className={styles.requirement}>.dxf</span>
                <span className={styles.requirement}>.csv</span>
                <span className={styles.requirement}>.stl</span>
                <span className={styles.requirement}>.dwg</span>
              </div>
              <FileStatusTag status={topographicModel?.status} />

            </div>

            <div className={styles.fieldDetails}>
              Consisting of either<br />
              ・XYZ points in .csv format, or<br />
              ・Triangulated wireframe of surface in .dxf, .stl or .dwg format<br />
            </div>
            <CompressRequired modelType="Topographic Model" />
            <FileInput
              id={FileType.TOPOGRAPHIC}
              fileInfo={topographicModel}
              setFileInfo={(v) => {
                setTopographicModel(v);
                // checkStatus();
              }}
              onUpload={(id, file, intension) => handleUploadFile(id, file, intension)}
              uploadStatus={uploads[FileType.TOPOGRAPHIC]}
              deleteFile={() => {
                deleteFile(topographicModel.id ?? "")
                setTopographicModel({ status: "required", type: FileType.TOPOGRAPHIC })
              }}
              required
              allowedExtensions={["zip", "rar", "dxf", "stl", "dwg", "csv"]}
              maxSizeMB={1000}
            />
            <div className="row">
              <div >
                <Info color={"#E5F3EB99"} size={15} />

              </div>
              <div className={styles.fieldDetails}>
                If no Surface Topographic Model exists, we can usually create one from drillhole collar data. XYZ coordinates (whether of Topographic or Collar data) should be in the same coordinate system as the Block Model, or the difference (translation, rotation) should be identified.
              </div>
            </div>

          </div>
          {/* End Surface Topographic Model */}

          {/* Technical Report */}
          <div className={styles.optionalContainer}>
            {
              (!isReadOnly || technicalReport.status === "readOnly") &&
              <>
                <div className={styles.titleRow}>
                  <div className={styles.fieldTitle}>Technical Report
                    <div className={styles.requirements}>
                      <span className={styles.requirement}>Max 50MB</span>
                      <span className={styles.requirement}>.pdf</span>
                    </div>

                  </div>
                  <FileStatusTag status={technicalReport?.status} />

                </div>
                <FileInput
                  id={FileType.REPORT}
                  fileInfo={technicalReport}
                  setFileInfo={setTechnicalReport}
                  onUpload={(id, file, intension) => handleUploadFile(id, file, intension)}
                  uploadStatus={uploads[FileType.REPORT]}
                  deleteFile={() => {
                    deleteFile(technicalReport.id ?? "")
                    setTechnicalReport({ status: "recommended", type: FileType.REPORT })
                  }}
                  allowedExtensions={["pdf"]}
                  maxSizeMB={50}
                />
              </>
            }

            <div className={styles.fieldDescription}>
              Any existing metallurgical data assumptions
              <textarea
                className={styles.textarea}
                placeholder="E.g. Process plant recovery per element"
                name="metallurgicalData"
                value={supplementaryInfo.metallurgicalData}
                onChange={handleSupplementaryInfoChange}
                readOnly={isReadOnly}
                onBlur={saveSupplementaryInfo}
              />

            </div>

            <div className={styles.fieldDescription}>
              Any constraints
              <textarea
                className={styles.textarea}
                placeholder="E.g. Zone or domain to be targeted or avoided"
                name="constraints"
                value={supplementaryInfo.constraints}
                onChange={handleSupplementaryInfoChange}
                readOnly={isReadOnly}
                onBlur={saveSupplementaryInfo}
              />
            </div>

            <div className={styles.fieldDescription}>
              Note
            </div>
            <div className={styles.fieldDetails}>
              As performance models improve, we will be able to make use of geotech and geomet data fields in block models, e.g. UCS and Q.
            </div>
          </div>

        </div>

        <PopupMenu
          open={showUploadMenu}
          anchorRef={menuButtonRef ?? { current: null }}
          onClose={() => {

            setShowUploadMenu(false)
          }}
          style={{
            top: menuButtonRef ? menuButtonRef.current?.getBoundingClientRect().bottom : 0,
            marginTop: 0,
            right: 20
          }}
        >
          {
            projects.map((project) => (
              <button
                key={`upload-${project.name}`}
                className={`buttonNoBg ${styles.option}`}
                onClick={(e) => {
                  if (!allInfoProvided()) {
                    setAssignToProjectId(project.id);
                    setShowSubmitPrompt(true);
                  } else {
                    assignProjectId(project.id);
                  }
                  e.preventDefault();
                }}
              >
                {project.name}
              </button>
            ))
          }
          <button
            key={`upload-no-project`}
            className={`buttonNoBg ${styles.option}`}
            onClick={(e) => {
              e.preventDefault();
              if (!allInfoProvided()) {
                setAssignToProjectId(undefined);
                setShowSubmitPrompt(true);
              } else {
                handleMarkComplete();
              }
            }}
          >
            No particular project
          </button>
        </PopupMenu>
      </div>
      {showSubmitPrompt && (
        <div className={styles.prompt}>
          <div className={styles.promptContainer}>
            <div className={styles.promptTitleRow}>
              <div className={styles.checkIconContainer}>
                <Check />

              </div>
              <div className={styles.promptTitle}>Required files uploaded</div>
              <button
                className={"buttonNoBg"}
                onClick={() => setShowSubmitPrompt(false)}
              >
                <Close width={16} height={16} color={"var(--darker-text)"} />
              </button>

            </div>
            <div className={styles.promptMessage}>
              You have completed all required uploads.<br /><br />
              Do you wish to provide more details or submit only the required files?
            </div>
            <div className={`${styles.promptButtons}`}>
              <button
                className={`borderButton ${styles.promptButtonText}`}
                onClick={() => {
                  setShowSubmitPrompt(false);
                  if (assignToProjectId) {
                    assignProjectId(assignToProjectId);
                  } else {
                    handleMarkComplete();
                  }
                }}
              >
                Submit only required files
              </button>
              <button
                className={styles.promptButtonText}
                onClick={() => setShowSubmitPrompt(false)}
              >
                Provide more details
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}