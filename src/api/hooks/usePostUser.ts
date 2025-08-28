import { API_BASE_URL } from "config";

export interface PostUserPayload {
  email: string,
  organizationId: string,
  name?: string,
  sendInvite?: boolean,
  isActive?: true
}

const usePostUser = (token: string | null) => {
  const postUser = async (payload: PostUserPayload) => {
    try {
      if (!token) return;

      const apiEndpoint = `${API_BASE_URL}/auth/user`;
      console.log("Fetching", apiEndpoint);
      console.log(payload)

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

      const data = await response.json();
      console.log(data)

      return data;

    } catch (e: any) {
      console.error("Error fetching", e)
      throw e;
    } finally {

    }
  };
  return { postUser };
};

export default usePostUser;