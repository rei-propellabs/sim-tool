import { API_BASE_URL } from "config";

interface PostProjectPayload {
  name: string,
  organizationId: string,
  siteId: string,
  code?: string,
}


const usePostProject = (token: string | null) => {
  const postProject = async (payload: PostProjectPayload) => {
    try {
      if (payload.name.length === 0 || payload.organizationId.length === 0) {
        return;
      }
      if (!token) return;

      const apiEndpoint = `${API_BASE_URL}/admin/projects`;
      console.log("Fetching", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "POST",
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
  return { postProject };
};

export default usePostProject;