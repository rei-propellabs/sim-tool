import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { ListSiteResponse } from "api/models/ListSiteResponse";
import { Site } from "api/models/Site";
import { buildQueryParams, PaginationParams } from "utils/Pagination";

interface ListSitesProps {
  orgId: string
  refreshKey?: number
}

const useListSites = (token: string | null, props: ListSitesProps, pagination?: PaginationParams) => {
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [sites, setSites] = useState<Site[]>([] as Site[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (props.orgId.length === 0) {
          return;
        }
        if (!token) return;

        let apiCall = `${API_BASE_URL}/admin/site?organizationId=${props.orgId}`;
        if (pagination) {
          const query = buildQueryParams(pagination);
          if (query) apiCall += `&${query}`;
        }
        console.log("Fetching", apiCall);

        const response = await fetch(apiCall, {
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
        console.log(responseText)

        const res: ListSiteResponse = JSON.parse(responseText);
        console.log(res)
        setSites(res.rows)
        setTotal(res.total);

      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, [token, pagination, props.refreshKey]);
  return { isLoading, sites, total };
};

export default useListSites;