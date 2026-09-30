import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHeartbeat, FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaTint } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstanceUserService from "../../utils/axiosInstanceUserService";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import {
  PHONE_NUMBER_HELPER_TEXT,
  PASSWORD_HELPER_TEXT,
  normalizePatientRegistration,
  validatePatientRegistration,
} from "../../utils/patientRegistrationValidation";
import ForgotPassword from "../../components/loginform/ForgotPassword";
import "./login.scss";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPath = location.pathname.includes("register");
  const [activeTab, setActiveTab] = useState(isRegisterPath ? "register" : "login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [regForm, setRegForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phoneNumber: "",
    address: "",
  });

  // Sync tab with URL
  useEffect(() => {
    if (location.pathname.includes("register")) {
      setActiveTab("register");
    } else if (location.pathname.includes("login")) {
      setActiveTab("login");
    }
  }, [location.pathname]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setShowForgotPassword(false);
    if (tab === "login") {
      navigate("/login", { replace: true });
    } else {
      navigate("/patient/register", { replace: true });
    }
  };

  // ─── LOGIN LOGIC ───
  const handleLogin = (e) => {
    e.preventDefault();

    axiosInstanceUserService
      .post("/login", { email, password })
      .then(async (resp) => {
        const data = resp.data;
        localStorage.setItem("token", data?.userLoginDetails?.token);
        localStorage.setItem("role", data?.userLoginDetails?.role);
        toast.success(data?.message || "Login successful!");

        const role = data?.userLoginDetails?.role;

        if (role === "Patient") {
          try {
            const patientResponse = await axiosInstancePatientService.get(
              `/email/${email}`
            );
            const patientData = patientResponse.data;
            localStorage.setItem("patientId", patientData.patientId);
            localStorage.setItem("userId", patientData.userId);
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

  // ─── REGISTER LOGIC ───
  const handleRegChange = (e) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const validationMessage = validatePatientRegistration(regForm);
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    axiosInstancePatientService
      .post("/register", normalizePatientRegistration(regForm))
      .then((response) => {
        toast.success(
          response?.data?.message || "Registered successfully!"
        );
        // Auto-switch to login tab after registration
        setRegForm({
          email: "", password: "", firstName: "", lastName: "",
          dateOfBirth: "", gender: "", bloodGroup: "",
          phoneNumber: "", address: "",
        });
        switchTab("login");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      });
  };

  // ─── FORGOT PASSWORD VIEW ───
  if (showForgotPassword) {
    return (
      <div className="auth-page">
        <div className="auth-hero">
          <div className="hero-content">
            <div className="hero-logo">
              <FaHeartbeat className="logo-icon" />
              <span className="logo-text">HMS</span>
            </div>
            <h1 className="hero-title">Healthcare Management System</h1>
            <p className="hero-description">
              Streamline your healthcare journey with our comprehensive management
              platform.
            </p>
          </div>
        </div>
        <div className="auth-form-panel">
          <nav className="auth-nav">
            <Link to="/">Home</Link>
          </nav>
          <div className="auth-form-wrapper">
            <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* ─── LEFT HERO PANEL ─── */}
      <div className="auth-hero">
        <div className="hero-content">
          <div className="hero-logo">
            <FaHeartbeat className="logo-icon" />
            <span className="logo-text">HMS</span>
          </div>
          <h1 className="hero-title">Healthcare Management System</h1>
          <p className="hero-description">
            Streamline your healthcare journey with our comprehensive management
            platform. Access medical records, book appointments, and connect
            with healthcare professionals — all in one place.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">50K+</div>
              <div className="stat-label">Patients</div>
            </div>
            <div className="stat">
              <div className="stat-value">200+</div>
              <div className="stat-label">Doctors</div>
            </div>
            <div className="stat">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT FORM PANEL ─── */}
      <div className="auth-form-panel">
        <nav className="auth-nav">
          <Link to="/">Home</Link>
        </nav>

        <div className="auth-form-wrapper">
          {/* Tab Switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
              onClick={() => switchTab("register")}
            >
              Register
            </button>
            <div
              className="tab-indicator"
              style={{ transform: activeTab === "register" ? "translateX(100%)" : "translateX(0)" }}
            />
          </div>

          {/* Sliding Forms Container */}
          <div className="auth-slider">
            <div
              className="auth-slides"
              style={{ transform: activeTab === "register" ? "translateX(-50%)" : "translateX(0)" }}
            >
              {/* ─── LOGIN FORM ─── */}
              <div className="auth-slide">
                <div className="form-header">
                  <p className="welcome-text">Welcome back</p>
                  <h2>Sign in to your account</h2>
                  <p className="subtitle">Enter your credentials to access the platform</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
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

                  <button type="submit" className="auth-submit-btn">
                    Sign In
                  </button>
                </form>

                <div className="auth-switch-text">
                  <p>
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => switchTab("register")}>
                      Create one now
                    </button>
                  </p>
                </div>
              </div>

              {/* ─── REGISTER FORM ─── */}
              <div className="auth-slide">
                <div className="form-header">
                  <p className="welcome-text">Get started</p>
                  <h2>Create your account</h2>
                  <p className="subtitle">Fill in your details to join HMS</p>
                </div>

                <form onSubmit={handleRegister} className="auth-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="reg-firstName">First Name</label>
                      <div className="input-wrapper">
                        <FaUser className="field-icon" />
                        <input
                          type="text"
                          id="reg-firstName"
                          name="firstName"
                          placeholder="John"
                          value={regForm.firstName}
                          onChange={handleRegChange}
                          maxLength="20"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="reg-lastName">Last Name</label>
                      <div className="input-wrapper">
                        <FaUser className="field-icon" />
                        <input
                          type="text"
                          id="reg-lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={regForm.lastName}
                          onChange={handleRegChange}
                          maxLength="20"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="reg-email">Email</label>
                      <div className="input-wrapper">
                        <FaEnvelope className="field-icon" />
                        <input
                          type="email"
                          id="reg-email"
                          name="email"
                          placeholder="you@example.com"
                          value={regForm.email}
                          onChange={handleRegChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="reg-password">Password</label>
                      <div className="input-wrapper">
                        <FaLock className="field-icon" />
                        <input
                          type="password"
                          id="reg-password"
                          name="password"
                          placeholder="••••••••"
                          value={regForm.password}
                          onChange={handleRegChange}
                          title={PASSWORD_HELPER_TEXT}
                          minLength="8"
                          maxLength="72"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="reg-dateOfBirth">Date of Birth</label>
                      <div className="input-wrapper">
                        <FaCalendarAlt className="field-icon" />
                        <input
                          type="date"
                          id="reg-dateOfBirth"
                          name="dateOfBirth"
                          value={regForm.dateOfBirth}
                          onChange={handleRegChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="reg-gender">Gender</label>
                      <div className="input-wrapper">
                        <FaUser className="field-icon" />
                        <select
                          id="reg-gender"
                          name="gender"
                          value={regForm.gender}
                          onChange={handleRegChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="reg-bloodGroup">Blood Group</label>
                      <div className="input-wrapper">
                        <FaTint className="field-icon" />
                        <select
                          id="reg-bloodGroup"
                          name="bloodGroup"
                          value={regForm.bloodGroup}
                          onChange={handleRegChange}
                          required
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A_Positive">A+</option>
                          <option value="A_Negative">A-</option>
                          <option value="B_Positive">B+</option>
                          <option value="B_Negative">B-</option>
                          <option value="AB_Positive">AB+</option>
                          <option value="AB_Negative">AB-</option>
                          <option value="O_Positive">O+</option>
                          <option value="O_Negative">O-</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="reg-phoneNumber">Phone Number</label>
                      <div className="input-wrapper">
                        <FaPhone className="field-icon" />
                        <input
                          type="tel"
                          id="reg-phoneNumber"
                          name="phoneNumber"
                          placeholder="0912345678"
                          value={regForm.phoneNumber}
                          onChange={handleRegChange}
                          inputMode="numeric"
                          pattern="[0-9]{10,11}"
                          maxLength="11"
                          title={PHONE_NUMBER_HELPER_TEXT}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="reg-address">Address</label>
                    <div className="input-wrapper textarea-wrapper">
                      <FaMapMarkerAlt className="field-icon" />
                      <textarea
                        id="reg-address"
                        name="address"
                        placeholder="Enter your address"
                        value={regForm.address}
                        onChange={handleRegChange}
                        required
                        rows="2"
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn">
                    Create Account
                  </button>
                </form>

                <div className="auth-switch-text">
                  <p>
                    Already have an account?{" "}
                    <button type="button" onClick={() => switchTab("login")}>
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
