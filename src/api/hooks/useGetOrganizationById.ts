import { Organization } from "api/models/Organization";
import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";

const useGetOrganizationById = (token: string | null, orgId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);

  const [organization, setOrganization] = useState<Organization>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!orgId || !token) {
          return;
        }

        const apiEndpoint = `${API_BASE_URL}/auth/organization/id/${orgId}`;
        console.log("Fetching", apiEndpoint);
        
        const response = await fetch(apiEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        
        let responseText = await response.text();
        const res: Organization = JSON.parse(responseText); 
        setOrganization(res)        

      } catch (e: any) {
        console.error("Error fetching organization", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, []);
  return { isLoading, organization };
};

export default useGetOrganizationById;