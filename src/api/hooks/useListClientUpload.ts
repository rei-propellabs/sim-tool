import { ClientUpload } from "api/models/ClientUpload";
import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { ListClientProjectResponse } from "api/models/ListClientUploadResponse";
import { buildQueryParams, PaginationParams } from "utils/Pagination";


const useListClientUpload = (token: string | null, pagination?: PaginationParams) => {
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [clientUploads, setClientUploads] = useState<ClientUpload[]>([] as ClientUpload[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        let apiUrl = `${API_BASE_URL}/client/upload`;

        if (pagination) {
          const query = buildQueryParams(pagination);
          if (query) apiUrl += `?${query}`;
        }
        const response = await fetch(apiUrl, {
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
          
        let responseText = await response.text();
        console.log(responseText)
        const res: ListClientProjectResponse = JSON.parse(responseText); 
        
        setClientUploads(res.rows);
        setTotal(res.total);

      } catch (e: any) {
        console.error("Error fetching", e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [token, JSON.stringify(pagination)]);
  return { isLoading, clientUploads, total };
};

export default useListClientUpload;