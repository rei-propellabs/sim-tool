import { API_BASE_URL } from "config";

interface PutPresentationPayload {
  organizationId?: string,
  id: string,
  scenarios?: string[],
}

const usePutPresentation = (token: string | null) => {
  const putPresentation = async (payload: PutPresentationPayload) => {
    
    try {
      if (!token) throw new Error("No valid token");
      
      const response = await fetch(`${API_BASE_URL}/admin/presentation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data.message);
        throw data;
      }

    } catch (e: any) {
      console.error("Error fetching", e)
      throw e;
    } finally {

    }
  };
  return { putPresentation };
};

export default usePutPresentation;