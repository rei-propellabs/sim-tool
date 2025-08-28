import { API_BASE_URL } from "config";

interface MarkCompletePayload {
  id: string,
}

const useMarkComplete = (token: string | null) => {
  const markComplete = async (payload: MarkCompletePayload) => {
    try {
    
      const apiEndpoint = `${API_BASE_URL}/client/upload/mark-as-complete/${payload.id}`;
      console.log("Fetching", apiEndpoint);
      if (!token) return;
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)

      return data;

    } catch (e: any) {
      console.error("Error fetching", e)
      throw e;
    } finally {

    }
  };
  return { markComplete };
};

export default useMarkComplete;