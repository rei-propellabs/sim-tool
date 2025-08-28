import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { AuthCheckData } from "api/models/AuthCheckData";

const useAuthCheck = (token: string | null) => {
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<AuthCheckData>();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        const apiEndpoint = `${API_BASE_URL}/auth/check`;
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
        console.log(responseText);

        const res: AuthCheckData = JSON.parse(responseText);
        setUser(res)    

      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, [token]);
  return { isLoading, user };
};

export default useAuthCheck;