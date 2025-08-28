import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { Project } from "api/models/Project";
import { ListProjectResponse } from "api/models/ListProjectResponse";

const useListClientProjects = (token: string | null) => {
  const [isLoading, setIsLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>([] as Project[]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        const apiEndpoint = `${API_BASE_URL}/client/project`;
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
        console.log(responseText);

        const res: ListProjectResponse = JSON.parse(responseText);
        setProjects(res.rows)    

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

export default useListClientProjects;