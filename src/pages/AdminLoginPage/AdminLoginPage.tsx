import { useEffect, useState } from "react";
import styles from "./AdminLoginPage.module.css"
import { TopBar } from "components/TopBar/TopBar";
import { useNavigate } from "react-router-dom";
import useAdminLogin from "api/hooks/useAdminLogin";
import { getToken, setToken } from "utils/TokenManager";
import { usePageTitle } from "hooks/usePageTitle";

export const AdminLoginPage = () => {
  usePageTitle("Novamera Upload Centre");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { adminLogin } = useAdminLogin();

  useEffect(() => {
    const token = getToken("uploadAdmin");
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Enter a valid email and password");
      return;
    } else {
      setError("");
      setIsLoading(true);
      try {
        console.log("log in to admin tool")
        const token = await adminLogin({ email: email, password });
        
        if (token.length > 0) {
          setToken("uploadAdmin", token);
          navigate(`/admin`, { replace: true });
        } else {
          setError("Error: unknown error");
        }

      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className={styles.pageContainer}>
      <TopBar />
      <div className={styles.pageContent}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleLogin();
          }}
          method="POST"
          autoComplete="on"
          className={styles.inputContainer}>
          <div>
            <div className={styles.title}>Email</div>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            <div className={styles.title}>Password</div>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            {
              error.length > 0 &&
              <div className={styles.error}>
                {error}
              </div>
            }

            <button
              type="submit"
              disabled={isLoading}
              className={styles.loginButton}>
              Login
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
