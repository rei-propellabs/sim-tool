import { scenarioDataStr_mock } from "api/mock/ScenarioDataMock";
import { ScenarioData } from "api/models/ScenarioData";
import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";

const useGetScenarios = (token: string | null, orgId: string) => {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ScenarioData[]>();
  const useMock = true

  useEffect(() => {
    const fetchData = async () => {
      try {
        let responseText;
        if (!useMock) {
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
          responseText = await response.text();
        } else {
          responseText = scenarioDataStr_mock
        }

        const parsed = JSON.parse(responseText);
        setData([parsed.rows[4], parsed.rows[6], parsed.rows[7]]);

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