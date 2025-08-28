import { API_BASE_URL } from "config";

interface PutSitePayload {
  name: string
  organizationId: string
}
const usePutSite = (token: string |null) => {
  const putSite = async (siteId: string, payload: PutSitePayload) => {
    try {
      if (payload.name.length === 0 || payload.organizationId.length === 0 || !siteId) {
        return;
      }
      if (!token) return;
      const apiEndpoint = `${API_BASE_URL}/admin/site/${siteId}`;
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
      return response.json();

    } catch (e: any) {
      console.error("Error fetching", e)
      throw e;
    } finally {

    }
  };
  return { putSite };
};

export default usePutSite;