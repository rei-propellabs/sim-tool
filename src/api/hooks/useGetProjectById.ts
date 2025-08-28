import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { Project } from "api/models/Project";
import { buildQueryString } from "utils/Query";

interface GetProjectByIdProps  {
  id: string; // projectID
  organizationId: string;
  // siteId?: string;
  // projectId?: string;
}
const useGetProjectById = (token: string | null, payload: GetProjectByIdProps) => {
  const { id } = payload;
  const [isLoading, setIsLoading] = useState(true);

  const [project, setProject] = useState<Project>();

  useEffect(() => {
    console.log(payload)
  
    const fetchData = async () => {
      try {
        if (!token) return;

        const query = buildQueryString(payload as Record<string, any>);

        const apiEndpoint = `${API_BASE_URL}/admin/projects/${id}?${query}`;
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
        const res: Project = JSON.parse(responseText); 
        
        setProject(res)        

      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, []);
  return { isLoading, project };
};

export default useGetProjectById;