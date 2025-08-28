import { API_BASE_URL } from "config";

const useDeleteUser = (token: string |null) => {
  const deleteUser = async (organizationId: string, userId: string) => {
    try {
      if (!userId || !organizationId) {
        return;
      }
      if (!token) return;
      const apiEndpoint = `${API_BASE_URL}/auth/user/id/${organizationId}/${userId}`;
      console.log("Deleting", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();

    } catch (e: any) {
      console.error("Error deleting user", e)
      throw e;
    } finally {

    }
  };
  return { deleteUser };
};

export default useDeleteUser;