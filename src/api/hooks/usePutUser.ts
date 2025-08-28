import { API_BASE_URL } from "config";

interface PutUserPayload {
  organizationId?: string
  id: string
  isActive: boolean
}
const usePutUser = (token: string | null) => {
  const putUser = async (userId: string | null, payload: PutUserPayload): Promise<any> => {
    try {
      if (payload.id.length === 0) {
        return Promise.reject(new Error("No user id provided"));
      }
      if (!token) return Promise.reject(new Error("No token provided"));
      const apiEndpoint = `${API_BASE_URL}/auth/user/id/${userId}`;
      console.log("Fetching", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const responseJson = await response.json();
        return Promise.reject(new Error(responseJson.message || "Error updating user"));
      }
      return response.json();

    } catch (e: any) {
      console.error("Error fetching", e)
      throw e;
    }
  };
  return { putUser };
};

export default usePutUser;