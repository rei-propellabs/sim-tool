import { scenarioDataStr_mock } from "api/mock/ScenarioDataMock";
import { ScenarioData } from "api/models/ScenarioData";
import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";

const useGetScenarios = (token: string | null, orgId: string) => {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ScenarioData[]>();
  const useMock = false

  useEffect(() => {
    const fetchData = async () => {
      if (useMock) {
        setData(Array.from({ length: 12 }, (_, i) => ({
          inventory: "N/A",
          hasAllFiles: true,
          createdAt: "2024-04-04T00:00:00Z",
          id: `scenario-id-${i + 1}`,
          name: `test ${i + 1}`
        })));
        setIsLoading(false)
        return;
      }
      try {
        let responseText;

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


        const parsed = JSON.parse(responseText);
        setData(parsed.rows as ScenarioData[]);
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