import { useEffect, useRef, useState } from "react";
import styles from './FileInput.module.css';
import AttachFile from 'images/AttachFile.svg';
import { FileInfo } from "models/FileInfo";
import Delete from 'images/Delete.svg';
import { Box, CircularProgress } from "@mui/material";
import { FileStatus } from "components/types/FileStatus";
import { UploadStatus } from "api/hooks/useFileUpload";
import { Download } from "images/Dynamic/Download";
import MenuDots from "images/MenuDots.svg";
import { PopupMenu } from "components/ProjectTable/PopupMenu";
import React from "react";
import { setTime } from "react-datepicker/dist/date_utils";

interface FileInputProps {
  id: string;
  fileInfo: FileInfo;
  setFileInfo?: (file: FileInfo) => void;
  deleteFile?: (fileId: string) => void;
  onUpload?: (id: string, file: File, intension: string) => void;
  uploadStatus?: UploadStatus;
  onStatusChange?: (status: FileStatus) => void;
  onDownloadClick?: () => void;
  required?: boolean;
  download?: boolean;
  maxSizeMB?: number;
  allowedExtensions?: string[];
}

export const FileInput = (props: FileInputProps) => {
  const { id, fileInfo, setFileInfo, uploadStatus, onUpload, deleteFile, download, onDownloadClick, maxSizeMB = 10, allowedExtensions = [] } = props;
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userStr = localStorage.getItem("user");
  const user = (!userStr || userStr === "undefined" ) ?  null : JSON.parse(userStr);
  const readOnlyStatuses = ["readOnly", "download"];
  const editable = !readOnlyStatuses.includes(fileInfo.status);
  const menuButtonRef = React.useRef<HTMLImageElement>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    console.log("upload status", uploadStatus);
    if (setFileInfo) {
      if (!uploadStatus?.uploading && uploadStatus?.progress === 100 && !uploadStatus?.error) {
        setFileInfo({ ...fileInfo, status: "uploaded" });
      } else if (!uploadStatus?.uploading && uploadStatus?.error) {
        setFileInfo({ ...fileInfo, status: "error" });
      }
    }

  }, [uploadStatus])


  const handleUploadFile = (file: File) => {
    // Check file size

    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`File size exceeds ${formatFileSize(maxSizeMB * 1024 * 1024)} limit.`);
      if (setFileInfo) setFileInfo({ ...fileInfo, status: "error" });
      return;
    }
    // Check extension
    if (allowedExtensions.length > 0) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !allowedExtensions.includes(ext)) {
        setErrorMsg(`File type not allowed. Allowed: ${allowedExtensions.join(", ")}`);
        if (setFileInfo) setFileInfo({ ...fileInfo, status: "error" });
        return;
      }
    }
    setErrorMsg("");
    if (file && setFileInfo && onUpload) {
      const uploaded: FileInfo = {
        name: file.name,
        size: file.size,
        status: "uploading",
        uploader: user.email,
        uploadDate: new Date(),
        type: id
      }
      if (props.onStatusChange) {
        props.onStatusChange("uploading");
      }
      setFileInfo(uploaded);
      onUpload(id, file, JSON.stringify(uploaded));

    }
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    } else {
      event.target.value = "";
    }
  }


  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!editable) return;
    setErrorMsg("");
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    if (!editable) return;

    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!editable) return;
    event.preventDefault();
    setIsDragging(false);
    setErrorMsg("");
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const remainingTimeText = (timeInSec: number) => {
    if (timeInSec < 60) return `${Math.ceil(timeInSec)} second${Math.ceil(timeInSec) !== 1 && "s"}`;
    if (timeInSec < 60 * 60) return `${Math.ceil(timeInSec / 60)} min${Math.ceil(timeInSec / 60) !== 1 && "s"}`;
    return `${Math.ceil(timeInSec / (60 * 60))} hour${Math.ceil(timeInSec / (60 * 60)) !== 1 && "s"}`;

  }

  const formatFileSize = (size: number) => {
    if (size < 1000) return `${size} B`;
    if (size < 1000 * 1000) return `${(size / 1000).toFixed(2)} KB`;
    if (size < 1000 * 1000 * 1000) return `${(size / (1000 * 1000)).toFixed(2)} MB`;
    return `${(size / (1000 * 1000 * 1000)).toFixed(2)} GB`;
  };

  const fileDetails = () => {
    if (!fileInfo || !fileInfo.size) {
      return null;
    }

    return (
      <div className={styles.fileDetails}>
        <div className={styles.fileName}>{fileInfo.name}</div>
        <div className={styles.fileSize}>{formatFileSize(fileInfo.size)}</div>
      </div>
    )
  }
  const progressCircle = () => {
    return (
      <Box sx={{ position: 'relative', width: 18, height: 18 }}>
        <CircularProgress
          variant="determinate"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: "var(--focused-border)",
          }}
          size={18}
          thickness={6}
          value={100}
        />
        <CircularProgress
          size={18}
          thickness={6}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: "var(--default-text)"
          }}
          variant="determinate"
          value={uploadStatus?.progress}
        />
      </Box>
    )
  }

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!deleteFile) return;
    e.preventDefault();
    deleteFile(fileInfo.id ?? "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const DeleteMenu = () => {
    return (
      <PopupMenu
        open={deleteMenuOpen}
        anchorRef={menuButtonRef ?? { current: null }}
        onClose={() => {
          setDeleteMenuOpen(false);
        }}
        style={{
          top: menuButtonRef?.current ? menuButtonRef?.current.getBoundingClientRect().top - 8 : 0,
          left: menuButtonRef?.current ? menuButtonRef.current.getBoundingClientRect().right + 18 : 0,
        }}
      >
        <button className={`buttonNoBg ${styles.option} ${styles.deleteOption}`}
          onClick={(e) => {
            onDeleteClick(e)
            setDeleteMenuOpen(false);
          }}>
          <img src={Delete} />
          Remove upload
        </button>
      </PopupMenu>
    )
  }


  const handleDownloadClick = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      if (onDownloadClick) {
        const result = onDownloadClick();
        if (typeof (result as any)?.then === "function") {
          await result;
          console.log("Download completed");
        }
      }
    } finally {
      setDownloading(false);
    }
  };

  const content = () => {
    if (fileInfo.status === "uploading") {
      return (
        <>
          {fileDetails()}
          {progressCircle()}
        </>
      );
    } else if (fileInfo.status === "error" || errorMsg) {
      return <div className={styles.errorText}>{errorMsg || "Error uploading file"}</div>;
    } else if (fileInfo.status === "uploaded" || !editable) {
      return (
        <>
          {fileDetails()}
          {
            fileInfo.status === "download" ?
              <div
                className={"align-vertical cursor-pointer"}
                onClick={handleDownloadClick}
                style={downloading ? { pointerEvents: "none", opacity: 0.6 } : {}}
              >
                {downloading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 24, width: 24 }}>
                    <CircularProgress size={24} thickness={5} sx={{ color: "var(--accent)" }} />
                  </Box>
                ) : (
                  <Download size={24} color={"var(--accent)"} />
                )}
              </div>
              :
              fileInfo.status === "uploaded" &&
              <img
                ref={menuButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteMenuOpen(!deleteMenuOpen);
                }}
                src={MenuDots}
              />
          }
        </>
      )
    } else {
      return <div className={styles.dropHere}>Drop here or <u>browse</u></div>;
    }
  }

  return (
    <div
      className={styles.container}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div>
        <label
          htmlFor={editable ? id : undefined}
          style={{ cursor: editable ? "pointer" : "default" }}
          className={[
            styles.fileInputContainer,
            isDragging ? styles.dragging : "",
            (fileInfo.status === "uploading" || fileInfo.status === "uploaded" || !editable) ? styles.uploaded : ""
          ].filter(Boolean).join(" ")}
        >
          <img src={AttachFile} alt="Attach File" />
          {content()}

        </label>
        {
          (fileInfo.status === "uploaded" || !editable) &&
          <div className={styles.uploadDataField}>
            <div>
              <div className={styles.title}>UPLOADED BY</div>
              <div className={styles.data}>{editable ? user.email : fileInfo.uploader}</div>
            </div>
            <div>
              <div className={styles.title}>UPLOADED ON</div>
              <div className={styles.data}>
                {!editable && fileInfo.uploadDate ? new Date(fileInfo.uploadDate).toLocaleDateString() : new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        }
        {
          fileInfo.status === "uploading" &&
          <div className={styles.uploading}>
            <div className={styles.title}>
              UPLOADING
            </div>
            <div className={styles.description}>
              {
                typeof uploadStatus?.remaining === "number"
                  ? uploadStatus.remaining > 0
                    ? `${remainingTimeText(uploadStatus.remaining)} remaining. Do not close this window.`
                    : "Loading..."
                  : "Calculating..."
              }
            </div>
          </div>
        }

      </div>

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        className={styles.fileInput}
        onChange={handleFileChange}
        accept={allowedExtensions.length > 0 ? allowedExtensions.map(ext => `.${ext}`).join(",") : undefined}
      />
      <DeleteMenu />
    </div>
  );
};