import { API_BASE_URL } from "config";

const useDeleteProject = (token: string |null) => {
  const deleteProject = async (projectId: string, organizationId: string) => {
    try {
      if (!projectId || !organizationId) {
        return;
      }
      if (!token) return;
      const apiEndpoint = `${API_BASE_URL}/admin/projects/delete/${organizationId}/${projectId}`;
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
  return { deleteProject };
};

export default useDeleteProject;