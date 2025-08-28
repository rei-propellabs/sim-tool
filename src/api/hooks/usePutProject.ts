import { API_BASE_URL } from "config";

interface PutProjectPayload {
  name: string,
  organizationId: string,
  siteId: string,
}


const usePutProject = (token: string | null) => {
  const putProject = async (projectId: string, payload: PutProjectPayload) => {
    try {
      if (payload.name.length === 0 || payload.organizationId.length === 0) {
        return;
      }
      if (!token) throw new Error("No valid token");
      
      const apiEndpoint = `${API_BASE_URL}/admin/projects/${projectId}`;
      console.log("Fetching", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const res = response.json()
      console.log(res)
      return res;

    } catch (e: any) {
      console.error("Error fetching", e)
      throw e;
    } finally {

    }
  };
  return { putProject };
};

export default usePutProject;