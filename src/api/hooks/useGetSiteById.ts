import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { Site } from "api/models/Site";

interface GetSiteByIdPayload {
  orgId: string;
  siteId: string;
}
const useGetSiteById = (token: string | null, payload: GetSiteByIdPayload) => {
  const {orgId, siteId} = payload;

  const [isLoading, setIsLoading] = useState(true);
  const [site, setSite] = useState<Site>();
  
  useEffect(() => {
    console.log(payload)
  
    const fetchData = async () => {
      try {
        if (!orgId || !siteId || !token) {
          return;
        }

        const apiEndpoint = `${API_BASE_URL}/admin/site/${siteId}?organizationId=${orgId}&siteId=${siteId}`;
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
        const res: Site = JSON.parse(responseText); 
        console.log("Fetched site data", res);
        
        setSite(res)        

      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, []);
  return { isLoading, site };
};

export default useGetSiteById;