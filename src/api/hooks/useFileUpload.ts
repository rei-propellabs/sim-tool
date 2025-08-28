// useMultiFileUpload.ts
import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "config";

export interface UploadStatus {
  progress: number; // in percent
  uploading: boolean;
  uploadSuccess: boolean;
  remaining: number | undefined; // in seconds
  error?: string;
}

export interface UploadFilePayload {
  id: string;
  file: File;
  uploadId: string;
  intension: string
}

export function useMultiFileUpload(token: string | null) {
  const [uploads, setUploads] = useState<Record<string, UploadStatus>>({});

  const uploadFile = useCallback(async (props: UploadFilePayload) => {
    if (!token) return;

    const { id, file, uploadId, intension } = props
    setUploads((prev) => ({
      ...prev,
      [id]: { progress: 0, uploading: true, uploadSuccess: false, remaining: undefined, error: undefined },
    }));

    const apiEndpoint = `${API_BASE_URL}/client/file/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadId', uploadId);
    if (intension) {
      formData.append('intension', intension);
    }

    console.log(intension)
    try {
      const res = await axios.post(apiEndpoint, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        onUploadProgress: (event) => {
          console.log("onProgress", event)
          if (event.lengthComputable) {
            const percent = Math.floor(event.loaded / event.total! * 100);
            setUploads((prev) => ({
              ...prev,
              [id]: { ...prev[id], uploading: percent < 100, uploadSuccess: percent === 100, progress: percent, remaining: event.estimated },
            }));
          }
        },
      });
      console.log("Finished uploading")
      const fileId = res.data.id;

      return { fileId, success: true };

    } catch (error: any) {
      setUploads((prev) => ({
        ...prev,
        [id]: { ...prev[id], uploading: false, error: error.message || 'Upload failed', remaining: undefined },
      }));
    }
  }, []);

  return { uploads, setUploads, uploadFile };
}