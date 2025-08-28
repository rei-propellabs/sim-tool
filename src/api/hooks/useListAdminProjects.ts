import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { Project } from "api/models/Project";
import { buildQueryString } from "utils/Query";

interface ListAdminProjectsProps  {
  organizationId: string;
}
const useListAdminProjects = (token: string | null, payload: ListAdminProjectsProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    console.log(payload)
  
    const fetchData = async () => {
      try {
        if (!token) return;

        const query = buildQueryString(payload as Record<string, any>);

        const apiEndpoint = `${API_BASE_URL}/admin/projects?${query}`;
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
        const res: Project[] = JSON.parse(responseText).rows; 
        
        setProjects(res)        

      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, []);
  return { isLoading, projects };
};

export default useListAdminProjects;