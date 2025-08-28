import { ListOrganizationResponse } from "api/models/ListOrganizationResponse";
import { Organization } from "api/models/Organization";
import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { buildQueryParams, PaginationParams } from "utils/Pagination";

const useListOrganizations = (token: string | null,
  pagination?: PaginationParams,
  refreshKey?: number
) => {
  const [isLoading, setIsLoading] = useState(true);

  const [organizations, setOrganizations] = useState<Organization[]>([] as Organization[]);
  const [total, setTotal] = useState(0);

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (!token) return;

        let endpoint = `${API_BASE_URL}/auth/organization/organization`;
        if (pagination) {
          const query = buildQueryParams(pagination);
          if (query) endpoint += `?${query}`;
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
        const res: ListOrganizationResponse = JSON.parse(responseText);

        setOrganizations(res.rows);
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
  return { isLoading, organizations, total };
};

export default useListOrganizations;