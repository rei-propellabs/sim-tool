import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { ListFilesResponse } from "api/models/ListFilesResponse";
import { FileUpload } from "api/models/FileUpload";

const useGetClientUploads = (token: string | null, uploadId: string) => {
  const [isLoading, setIsLoading] = useState(true);

  const [files, setFiles] = useState<FileUpload[]>([] as FileUpload[]);

  const [listFilesResponse, setListFilesResponse] = useState<ListFilesResponse>();

  useEffect(() => {
    const fetchData = async () => {
      if (!uploadId || !token) {
        return;
      }
      try {
        const endpoint = `${API_BASE_URL}/client/upload/${uploadId}`
        console.log("Fetching", endpoint);

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          const data = await response.json();
          console.log(data.message);
          return data;
        }
          
        let responseText = await response.text()
        console.log(responseText);
        const res: ListFilesResponse = JSON.parse(responseText);

        setFiles(res.files);
        setListFilesResponse(res)

      } catch (e: any) {
        console.error("Error fetching", e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, []);
  return { isLoading, files, listFilesResponse };
};

export default useGetClientUploads;