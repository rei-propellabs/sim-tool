import { ClientUpload } from "api/models/ClientUpload";
import { API_BASE_URL } from "config";

interface PutAdminUploadPayload {
  organizationId: string,
  projectId?: string,
}

const usePutAdminUpload = (token: string | null) => {
  const putAdminUpload = async (uploadId: string, payload: PutAdminUploadPayload): Promise<ClientUpload | string> => {
    try {
      if (!token) throw new Error("No valid token");
      if (!uploadId || !payload.organizationId) {
        throw new Error("Required fields are missing");
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/uploads/${uploadId}`, {
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
  return { putAdminUpload };
};

export default usePutAdminUpload;