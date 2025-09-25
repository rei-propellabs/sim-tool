import { ListOrganizationResponse } from "api/models/ListOrganizationResponse";
import { ListPresentationResponse } from "api/models/ListPresentationResponse";
import { Presentation } from "api/models/Presentation";
import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { buildQueryParams, PaginationParams } from "utils/Pagination";

const useListPresentation = (token: string | null,
  organizationId: string,
  pagination?: PaginationParams,
  refreshKey?: number
) => {
  const [isLoading, setIsLoading] = useState(true);

  const [presentations, setPresentations] = useState<Presentation[]>([] as Presentation[]);
  const [total, setTotal] = useState(0);

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (!token || organizationId.length === 0) return;

        let endpoint = `${API_BASE_URL}/admin/presentation`;
        if (organizationId) {
          endpoint += `?${buildQueryParams({organizationId})}`;
        }
        if (pagination) {
          const query = buildQueryParams(pagination);
          if (query) endpoint += `&${query}`;
        }
        console.log("Fetching", endpoint);

        const response = await fetch(endpoint, {
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
        const res: ListPresentationResponse = JSON.parse(responseText);

        setPresentations(res.rows);
        console.log(res.rows);

        setTotal(res.total);
      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, [token, JSON.stringify(pagination), refreshKey]);
  return { isLoading, presentations, total };
};

export default useListPresentation;