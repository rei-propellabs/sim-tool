
import { useEffect, useState } from "react";
import styles from "./ClientLoginPage.module.css"
import { TopBar } from "components/TopBar/TopBar";
import { useNavigate } from "react-router-dom";
import usePostClient from "api/hooks/usePostClient";
import { getToken } from "utils/TokenManager";

function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken("uploadClient");
    if (token) {
      navigate("/upload/project", { replace: true });
    }
  }, [navigate]);

  const handleSend = async () => {
    // const token = await postClient({email: email, id: "55358c85-7fb6-46ca-a865-28fa45fa8e0a", expiresIn: "10y"})
    // console.log(token)

    // navigate(`/upload/project`);
    // console.log("Sending access link to", email, "for project", projectNumber);

    if (!email || !projectNumber) {
      setError("Enter a valid email and password")
      return;
    }

    // todo: Send email and project number to server

    // navigate(`/upload/project`);
  }

  return (
    <div className={styles.pageContainer}>
      <TopBar />
      <div className={styles.pageContent}>
        <div className={styles.inputContainer}>
          <div>
            <div className={styles.title}>Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            <div className={styles.title}>Project Number</div>
            <input
              type="password"
              value={projectNumber}
              onChange={(e) => setProjectNumber(e.target.value)}
              className={styles.input}
            />
            <div className={styles.description}>6-digit ID shared by your Novamera contact</div>

          </div>

          <div>
            {
              error.length > 0 &&
              <div className={styles.error}>
                {error}
              </div>
            }

            <button onClick={(e) => {
              e.preventDefault();
              handleSend();
            }}
              disabled={email.length === 0 || projectNumber.length === 0}
              className={styles.loginButton}>
              Send Access Link
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ClientLoginPage;
