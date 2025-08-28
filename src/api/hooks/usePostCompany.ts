import { API_BASE_URL } from "config";
import { Company } from "api/models/Company";

interface PostCompanyPayload {
  name: string,
  hash?: string,
  settings?: any,
  isActive?: boolean,
  isAdmin?: boolean,
  schema?: string
  organizationId?: string,
  dueDate?: Date,
  engagementStartDate?: Date,
  region?: string,
  dataStatus?: string
}

const usePostCompany = (token: string | null) => {
  const postCompany = async (payload: PostCompanyPayload): Promise<Company | string> => {
    try {
      if (payload.name.length === 0 || payload.organizationId?.length === 0) {
        return "error";
      }
      const response = await fetch(`${API_BASE_URL}/auth/organization/organization`, {
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
      const data: Company = await response.json();
      console.log(data);

      return data;

    } catch (e: any) {
      console.error("Error fetching", e)
      throw e;
    } finally {

    }
  };
  return { postCompany };
};

export default usePostCompany;