import { ScenarioData } from "api/models/ScenarioData";
import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { set } from "react-datepicker/dist/date_utils";

const useGetScenarios = (token: string | null, orgId: string) => {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ScenarioData[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {

        const apiEndpoint = `${API_BASE_URL}/admin/scenario?organizationId=${orgId}`;
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
        const parsed = JSON.parse(responseText);
        setData([parsed.rows[0], parsed.rows[0], parsed.rows[0]]); // todo
        
      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, []);
  return { isLoading, data };
};

export default useGetScenarios;