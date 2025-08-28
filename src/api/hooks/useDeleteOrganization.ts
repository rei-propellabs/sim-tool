import { API_BASE_URL } from "config";

const useDeleteOrganization = (token: string |null) => {
  const deleteOrganization = async (organizationId: string) => {
    try {
      if (!organizationId) {
        return;
      }
      if (!token) return;
      const apiEndpoint = `${API_BASE_URL}/auth/organization/organization/${organizationId}`;
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
  return { deleteOrganization };
};

export default useDeleteOrganization;