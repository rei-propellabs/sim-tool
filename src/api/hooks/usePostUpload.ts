import { API_BASE_URL } from "config";

interface PostUploadPayload {
  name: string,
  projectId: string,
}
const usePostSite = (token: string | null) => {
  const postSite = async (payload: PostUploadPayload) => {
    try {
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