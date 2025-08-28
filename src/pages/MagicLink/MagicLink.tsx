import { FullLoadingSpinner } from "components/FullLoadingSpinner/FullLoadingSpinner"
import { API_BASE_URL } from "config";
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { getToken as getExistingToken, setToken } from "utils/TokenManager";
import styles from "./MagicLink.module.css"
import { usePageTitle } from "hooks/usePageTitle";

export const MagicLink = () => {
  usePageTitle("Novamera");
  
  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);
  const code = query.get("code");

  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const getToken = async (code: string) => {
      try {
        const apiEndpoint = `${API_BASE_URL}/auth/magic-link`;

        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        })
        console.log(code)
        let responseText = await response.text();

        console.log(responseText)

        if (!response.ok) {
          //navigate("/upload/auth");
          setExpired(true)
          return;
        }

        const token = JSON.parse(responseText).token;

        if (!token) {
          navigate("/upload/auth");
          return;
        } else {
          setToken("uploadClient", token);
          setTimeout(() => {
            navigate("/upload/project");
          }, 100);
        }
      } catch {
        
      }
    }

    const tokenExists = getExistingToken("uploadClient");
    if (tokenExists) {
      navigate("/upload/project");
      return;
    }

    if (code && code !== "undefined" && code.length > 0) {
      getToken(code)
    }
  }, [navigate])

  return (
    <>
    {
      expired ? 
      <div className={styles.expiredContainer}>
        <h2>Upload Center</h2>
        <br />
        <div>For security reasons, your access link is only valid for a limited time.</div>
        <br />
        <div>To continue, please contact Novamera team and request a new link.</div>

      </div>
       :
    <FullLoadingSpinner />

    }
    </>
  )
}