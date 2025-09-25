import { API_BASE_URL } from "config";

interface PostPresentationPayload {
  organizationId: string
  projectId?: string,
  scenarios: string[]
}
const usePostPresentation = (token: string | null) => {
  const postPresentation = async (payload: PostPresentationPayload) => {
    try {
      if (payload.organizationId.length === 0 ||
        payload.scenarios.length === 0) {
        return;
      }
      if (!token) return;
      const apiEndpoint = `${API_BASE_URL}/admin/presentation`;
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
  return { postPresentation };
};

export default usePostPresentation;