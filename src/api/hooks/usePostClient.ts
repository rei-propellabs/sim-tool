import { API_BASE_URL } from "config";

interface PostClientPayload {
  email: string,
  id: string,
  expiresIn: string
}

const usePostClient = (token: string | null) => {
  const postClient = async (payload: PostClientPayload) => {
    try {
    
      const apiEndpoint = `${API_BASE_URL}/auth/organization/user`;
      console.log("Fetching", apiEndpoint);

      if (!token) return;
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log(response)

      const data = await response.json();

      return data.token;

    } catch (e: any) {
      console.error("Error fetching", e)
      throw e;
    } finally {

    }
  };
  return { postClient };
};

export default usePostClient;