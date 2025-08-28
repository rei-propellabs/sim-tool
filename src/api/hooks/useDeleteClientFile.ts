import { API_BASE_URL } from "config";

const useDeleteClientFile = (token: string | null) => {
  const deleteFile = async (fileId: string) => {
    try {
      if (!fileId) {
        return;
      }
      if (!token) return;
      const endpoint = `${API_BASE_URL}/client/file/id/${fileId}`
      console.log("Fetching", endpoint);

      const response = await fetch(endpoint, {
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
  return { deleteFile };
};

export default useDeleteClientFile;