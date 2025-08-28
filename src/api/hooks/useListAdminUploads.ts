import { ClientUpload } from "api/models/ClientUpload";
import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { ListClientProjectResponse } from "api/models/ListClientUploadResponse";
import { buildQueryParams, PaginationParams } from "utils/Pagination";

interface ListAdminUploadProps {
  organizationId: string,
  uploadId?: string,
  projectId?: string,
  pagination?: PaginationParams,
  refreshKey?: number
}

const useListAdminUploads = (token: string | null, props: ListAdminUploadProps) => {
  const { organizationId, uploadId, projectId, pagination, refreshKey } = props;
  const [isLoading, setIsLoading] = useState(true);

  const [clientUploads, setClientUploads] = useState<ClientUpload[]>([] as ClientUpload[]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (props.organizationId.length === 0) {
        return;
      }
      try {
        if (!token) return;

        let endpoint = `${API_BASE_URL}/admin/uploads${uploadId ? `/${uploadId}` : ""}?organizationId=${organizationId}${projectId ? `&projectId=${projectId}` : ""}`;
        console.log("Fetching", endpoint);
        
        if (pagination) {
          const query = buildQueryParams(pagination);
          if (query) endpoint += `&${query}`;
        }

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

  }, [token, JSON.stringify(pagination), refreshKey]);
  return { isLoading, clientUploads, total };
};

export default useListAdminUploads;