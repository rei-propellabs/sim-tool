import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { FileUpload } from "api/models/FileUpload";
import { buildQueryString } from "utils/Query";

interface GetClientFilePayload {
  uploadId: string;
}
const useGetClientFile = (payload: GetClientFilePayload, token: string | null) => {
  const { uploadId } = payload;
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<FileUpload[]>();
  
  useEffect(() => {
    console.log(payload)
  
    const fetchData = async () => {
      try {
        if (!token || uploadId.length === 0) {
          return;
        }

        const query = buildQueryString(payload as Record<string, any>);
        
        const apiEndpoint = `${API_BASE_URL}/client/file?${query}`
        console.log("Fetching", apiEndpoint);
        
        const response = await fetch(apiEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        
        let responseText = await response.text();
        const res: FileUpload[] = JSON.parse(responseText).rows; 
        console.log(res)
        setFiles(res)        

      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, []);
  return { isLoading, files };
};

export default useGetClientFile;