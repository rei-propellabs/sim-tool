import { API_BASE_URL } from "config";

const useDeleteSite = (token: string |null) => {
  const deleteSite = async (siteId: string, organizationId: string) => {
    try {
      if (!siteId || !organizationId) {
        return;
      }
      if (!token) return;
      const apiEndpoint = `${API_BASE_URL}/admin/site/delete/${organizationId}/${siteId}`;
      console.log("Fetching", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
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
  return { deleteSite };
};

export default useDeleteSite;