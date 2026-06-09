import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login({ setIsLoggedIn }) {
  const [authMode, setAuthMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = authMode === "signup";

  const clearFormMessage = () => {
    if (message) {
      setMessage("");
    }
  };

  const loginUser = async () => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    setIsLoggedIn(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (isSignup && !emailPattern.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isSignup) {
        await axios.post(`${API_BASE_URL}/auth/register`, {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          username: username.trim(),
          password,
          role
        });
      }

      await loginUser();
    } catch (error) {
      console.log(error);

      if (!error.response) {
        setMessage("Signup failed because the backend server is not running on port 5000.");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          (isSignup ? "Signup failed. Please try again." : "Login failed. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchAuthMode = () => {
    setAuthMode(isSignup ? "login" : "signup");
    setMessage("");
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-label={isSignup ? "Create account" : "Login"}>
        <div className="auth-copy">
          <p className="eyebrow">Rural Health AI</p>
          <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p>
            {isSignup
              ? "Enter your email, name, username, and role to create your health workspace account."
              : "Login to continue managing patient records, risk levels, and care notes."}
          </p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="segmented-control" aria-label="Authentication mode">
            <button
              type="button"
              className={!isSignup ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={isSignup ? "active" : ""}
              onClick={() => setAuthMode("signup")}
            >
              Sign up
            </button>
          </div>

          {isSignup && (
            <>
              <label>
                Email address
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFormMessage();
                  }}
                  required
                />
              </label>

              <label>
                Full name
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearFormMessage();
                  }}
                  required
                />
              </label>
            </>
          )}

          <label>
            Username
            <input
              type="text"
              placeholder={isSignup ? "Choose a username" : "Enter username"}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearFormMessage();
              }}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFormMessage();
              }}
              required
              minLength={4}
            />
          </label>

          {isSignup && (
            <label>
              Role
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  clearFormMessage();
                }}
              >
                <option value="worker">Health worker</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}

          {message && <p className="form-message error">{message}</p>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isSignup
                ? "Creating account..."
                : "Logging in..."
              : isSignup
                ? "Create account"
                : "Login"}
          </button>

          <button className="text-button" type="button" onClick={switchAuthMode}>
            {isSignup ? "Already have an account? Login" : "New user? Create an account"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
