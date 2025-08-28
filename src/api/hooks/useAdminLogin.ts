import { API_BASE_URL } from "config";

interface AdminLoginPayload {
  email: string,
  password: string,
}

const useAdminLogin = () => {
  const adminLogin = async (payload: AdminLoginPayload) => {
    try {
      const apiEndpoint = `${API_BASE_URL}/auth/login`;
      console.log("Fetching", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
  return { adminLogin };
};

export default useAdminLogin;