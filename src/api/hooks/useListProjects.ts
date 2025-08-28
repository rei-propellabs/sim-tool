import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { Project } from "api/models/Project";
import { ListProjectResponse } from "api/models/ListProjectResponse";
import { buildQueryParams, PaginationParams } from "utils/Pagination";

interface ListProjectsProps {
  orgId: string,
  siteId: string,
  refreshKey?: number
}

const useListProjects = (token: string | null, props: ListProjectsProps, pagination?: PaginationParams) => {
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [projects, setProjects] = useState<Project[]>([] as Project[]);

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (props.orgId.length === 0) {
          return;
        }
        if (!token) return;

        let apiCall = `${API_BASE_URL}/admin/projects?organizationId=${props.orgId}&siteId=${props.siteId}`;
        console.log("Fetching", apiCall);

        if (pagination) {
          const query = buildQueryParams(pagination);
          if (query) apiCall += `&${query}`;
        }
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

        const res: ListProjectResponse = JSON.parse(responseText);
        setProjects(res.rows)
        setTotal(res.total);
      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, [token, props.orgId, props.siteId, pagination, props.refreshKey]);
  return { isLoading, projects, total };
};

export default useListProjects;