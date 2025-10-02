import { scenarioDataStr_mock } from "api/mock/ScenarioDataMock";
import { ScenarioData } from "api/models/ScenarioData";
import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";

const useGetScenariosByProjectId = (token: string | null, orgId: string, projectId: string) => {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ScenarioData[]>();
  const useMock = false

  useEffect(() => {
    const fetchData = async () => {
      try {
        let responseText;
        if (!useMock) {
          if (!token || orgId.length === 0 || projectId.length === 0) return;

          let apiEndpoint = `${API_BASE_URL}/admin/presentation/project?organizationId=${orgId}`;
          if (projectId) {
            apiEndpoint += `&projectId=${projectId}`;
          }
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
        console.log("getScenariosByProjectId", parsed)
        setData(parsed.scenarios as ScenarioData[]);
        // setData(Array.from({ length: 12 }, (_, i) => ({
        //   ...parsed.rows[0],
        //   id: `${parsed.rows[0].id} ${i + 1}`
        // })));
        //  setData(Array.from({ length: 12 }, (_, i) => ({
        //   inventory: "N/A",
        //   hasAllFiles: true,
        //   createdAt: "2024-04-04T00:00:00Z",
        //   id: `scenario-id-${i + 1}`,
        //   name: `test ${i + 1}`
        // })));
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

export default useGetScenariosByProjectId;