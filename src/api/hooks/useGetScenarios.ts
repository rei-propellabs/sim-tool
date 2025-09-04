import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";

const useGetScenarios = (token: string | null) => {

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiEndpoint = `${API_BASE_URL}/admin/scenario`;
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
        console.log("Fetched scenario", responseText);
        
      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, []);
  return { isLoading };
};

export default useGetScenarios;