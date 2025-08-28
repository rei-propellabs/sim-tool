import { ClientUpload } from "api/models/ClientUpload";
import { API_BASE_URL } from "config";

interface PostClientUploadPayload {
  name: string,
  projectId?: string,
}


const usePostClientUpload = (token: string | null) => {
  const postClientUpload = async (payload: PostClientUploadPayload): Promise<ClientUpload | string> => {
    try {
      if (!token) throw new Error("No valid token");

      const response = await fetch(`${API_BASE_URL}/client/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data.message);
        return data;
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
  return { postClientUpload };
};

export default usePostClientUpload;