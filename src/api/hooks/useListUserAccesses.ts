import { API_BASE_URL } from "config";
import { useEffect, useState } from "react";
import { User } from "api/models/User";
import { ListUserAccessResponse } from "api/models/ListUserAccessResponse";

const useListUserAccess = (token: string | null, orgId: string | undefined, isActive: boolean) => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!orgId) {
          return;
        }
        if (!token) return;

        const apiEndpoint = `${API_BASE_URL}/auth/user/users?id=${orgId}&isActive=${isActive}`;
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
        const res: ListUserAccessResponse = JSON.parse(responseText); 
        console.log(res)
        setUsers(res.rows)        

      } catch (e: any) {
        console.error("Error fetching manifest", e)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();

  }, []);
  return { isLoading, users };
};

export default useListUserAccess;