import React, { useState } from 'react';
import styles from './UploadFile.module.css';
import { CloudUpload } from "images/Dynamic/CloudUpload";
import { Check } from "images/Dynamic/Check";
import Spinner from "components/Spinner/Spinner";
import { usePageTitle } from "hooks/usePageTitle";

interface UploadFileProps {
  onUploadComplete: (file: File) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onUploadComplete }) => {
  
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      setUploadComplete(false);
      // TODO: Upload images
      setTimeout(() => {
        setUploading(false);
        setUploadComplete(true);
        onUploadComplete(file)
      }, 2000);
    }
  };

  return (
    <div className={`${styles.container} ${uploading || uploadComplete ? styles.accentBorder : ''}`}>
      <input
        className={styles.inputContainer}
        type="file" onChange={handleFileChange}
      />
      
        {!uploading && !uploadComplete &&
          <div className={styles.overlayText}>
            <div><CloudUpload size={40} /></div>
            <div>
              Drag-and-drop file, or <span className={styles.accentText}>browse computer</span>
            </div>
          </div>
        }

        {uploading && 
          <div className={styles.overlayText}>
            <Spinner />
            <div>Uploading file... </div>
          </div>
      }
        {uploadComplete && 
          <div className={styles.overlayText}>
            <Check size={30}/>
            <div>File upload complete!</div>

          </div>
        }

    </div>
  );
};

export default UploadFile;