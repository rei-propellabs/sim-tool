import { ClientUpload } from "api/models/ClientUpload";
import { API_BASE_URL } from "config";

interface PutClientUploadPayload {
  name?: string,
  projectId?: string,
  supplementaryInfo?: string,
  id: string,
}


const usePutClientUpload = (token: string | null) => {
  const putClientUpload = async (payload: PutClientUploadPayload): Promise<ClientUpload | string> => {
    
    try {
      if (!token) throw new Error("No valid token");
      
      const response = await fetch(`${API_BASE_URL}/client/upload/${payload.id}`, {
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
      const data: ClientUpload = await response.json();
      console.log(data);

      return data;

    } catch (e: any) {
      console.error("Error fetching", e)
      throw e;
    } finally {

    }
  };
  return { putClientUpload };
};

export default usePutClientUpload;