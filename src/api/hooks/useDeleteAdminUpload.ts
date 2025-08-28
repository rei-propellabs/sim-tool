import { API_BASE_URL } from "config";

const useDeleteAdminUpload = (token: string |null) => {
  const deleteUpload = async (organizationId: string, uploadId: string) => {
    try {
      if (!uploadId || !organizationId) {
        return;
      }
      if (!token) return;
      const apiEndpoint = `${API_BASE_URL}/admin/uploads/delete/${organizationId}/${uploadId}`;
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
  return { deleteUpload };
};

export default useDeleteAdminUpload;