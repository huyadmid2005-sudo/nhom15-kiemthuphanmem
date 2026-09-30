import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axiosInstanceUserService from "../../utils/axiosInstanceUserService";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import ForgotPassword from "./ForgotPassword";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Loggin in");

    const userCredential = {
      email,
      password,
    };

    axiosInstanceUserService
      .post("/login", userCredential)
      .then(async (resp) => {
        const data = resp.data;
        const rawToken = data?.userLoginDetails?.token?.startsWith("Bearer ")
          ? data.userLoginDetails.token.slice("Bearer ".length)
          : data?.userLoginDetails?.token;
        console.log("Response from login ", data?.userLoginDetails);
        // Set the token to the local storage
        localStorage.setItem("token", rawToken);
        // Set the role to the local storage
        localStorage.setItem("role", data?.userLoginDetails?.role);

        toast.success(data?.message || "Login successful!");

        console.log("token ", rawToken);

        const role = data?.userLoginDetails?.role;

        // If user is a patient, get and store patientId
        if (role === "Patient") {
          try {
            const patientResponse = await axiosInstancePatientService.get(
              `/email/${email}`
            );
            const patientData = patientResponse.data;
            localStorage.setItem("patientId", patientData.patientId);
            localStorage.setItem("userId", patientData.userId);
            console.log("Patient ID saved:", patientData.patientId);
          } catch (error) {
            console.error("Error fetching patient data:", error);
            toast.error("Error fetching patient information");
          }
          navigate("/patient/home");
        } else if (role === "Doctor") {
          navigate("/doctor/home");
        } else {
          navigate("/admin/home");
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      });
  };

  // If showing forgot password form, render it instead
  if (showForgotPassword) {
    return (
      <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <>
      <div className="login-form-header">
        <p className="welcome-text">Welcome back</p>
        <h2>Sign in to your account</h2>
        <p className="subtitle">
          Enter your credentials to access the platform
        </p>
      </div>

      <form onSubmit={handleLogin} className="login-form">
        <div className="form-field">
          <label htmlFor="login-email">Email address</label>
          <div className="input-wrapper">
            <FaEnvelope className="field-icon" />
            <input
              type="email"
              id="login-email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="login-password">Password</label>
          <div className="input-wrapper">
            <FaLock className="field-icon" />
            <input
              type="password"
              id="login-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-options">
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="forgot-link"
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="login-submit-btn">
          Sign In
        </button>
      </form>
    </>
  );
};

export default LoginForm;
