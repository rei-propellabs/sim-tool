import { API_BASE_URL } from "config";

interface InviteUserPayload {
  id: string,
  organizationId: string,
}

const useInviteUser = (token: string | null) => {
  const inviteUser = async (payload: InviteUserPayload) => {
    try {
      if (!token) return;

      const apiEndpoint = `${API_BASE_URL}/auth/user/invite`;
      console.log("Fetching", apiEndpoint);

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
  return { inviteUser };
};

export default useInviteUser;