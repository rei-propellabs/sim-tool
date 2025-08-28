import { API_BASE_URL } from "config";

interface PostSitePayload {
  name: string,
  organizationId: string
}
const usePostSite = (token: string |null) => {
  const postSite = async (payload: PostSitePayload) => {
    try {
      if (payload.name.length === 0 || payload.organizationId.length === 0) {
        return;
      }
      if (!token) return;
      const apiEndpoint = `${API_BASE_URL}/admin/site`;
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
      return response.json();

    } catch (e: any) {
      console.error("Error fetching", e)
      throw e;
    } finally {

    }
  };
  return { postSite };
};

export default usePostSite;