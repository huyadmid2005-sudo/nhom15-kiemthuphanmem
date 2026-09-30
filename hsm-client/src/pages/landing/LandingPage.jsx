import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaUserMd,
  FaCalendarAlt,
  FaAmbulance,
  FaHospital,
  FaStethoscope,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaClock,
  FaUsers,
  FaStar,
} from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageToggle from "../../components/language-toggle/LanguageToggle";
import LazySection from "../../components/animations/LazySection";
import { smoothScrollTo } from "../../utils/landingAnimations";
import "./landing-page.scss";
import "../../styles/lazyAnimations.css";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Smooth scroll handler for navigation links
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    smoothScrollTo(targetId);
    setMobileMenuOpen(false); // Close mobile menu if open
  };

  return (
    <div className="landing-page">
      {/* Header/Navigation */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <FaHeartbeat className="logo-icon" />
            <span className="logo-text">HMS</span>
          </div>

          <nav className={`nav ${mobileMenuOpen ? "nav-open" : ""}`}>
            <ul className="nav-list">
              <li>
                <a href="#home" onClick={(e) => handleNavClick(e, "home")}>
                  {t("home")}
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleNavClick(e, "services")}
                >
                  {t("services")}
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleNavClick(e, "about")}>
                  {t("about")}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "contact")}
                >
                  {t("contact")}
                </a>
              </li>
              <li>
                <Link to="/login" className="nav-login-btn">
                  {t("login")}
                </Link>
              </li>
              <li className="language-toggle-nav">
                <LanguageToggle />
              </li>
            </ul>
          </nav>

          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">{t("heroTitle")}</h1>
            <p className="hero-subtitle">{t("heroSubtitle")}</p>
            <div className="hero-buttons">
              <Link to="/patient/register" className="btn-primary">
                {t("bookAppointment")}
              </Link>
              <Link to="/login" className="btn-secondary">
                {t("learnMore")}
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <FaStethoscope className="hero-card-icon" />
              <h3>{t("emergencyCare")}</h3>
              <p>{t("availability24Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <LazySection
        className="stats"
        animationType="fadeInUp"
        threshold={0.2}
        delay={0.1}
      >
        <div className="stats-container">
          <div className="stat-item">
            <FaUsers className="stat-icon" />
            <div className="stat-number">50K+</div>
            <div className="stat-label">{t("patientsServed")}</div>
          </div>
          <div className="stat-item">
            <FaUserMd className="stat-icon" />
            <div className="stat-number">200+</div>
            <div className="stat-label">{t("doctorsAvailable")}</div>
          </div>
          <div className="stat-item">
            <FaHospital className="stat-icon" />
            <div className="stat-number">15+</div>
            <div className="stat-label">{t("yearsExperience")}</div>
          </div>
          <div className="stat-item">
            <FaStar className="stat-icon" />
            <div className="stat-number">4.9</div>
            <div className="stat-label">{t("successRate")}</div>
          </div>
        </div>
      </LazySection>

      {/* Services Section */}
      <LazySection
        id="services"
        className="services"
        animationType="fadeInUp"
        threshold={0.1}
        delay={0.2}
      >
        <div className="services-container">
          <div className="section-header">
            <h2>{t("servicesTitle")}</h2>
            <p>{t("servicesSubtitle")}</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <FaCalendarAlt className="service-icon" />
              <h3>{t("appointmentScheduling")}</h3>
              <p>{t("appointmentSchedulingDesc")}</p>
              <Link to="/patient/register" className="service-link">
                {t("learnMore")}
              </Link>
            </div>
            <div className="service-card">
              <FaAmbulance className="service-icon" />
              <h3>{t("emergencyServices")}</h3>
              <p>{t("emergencyServicesDesc")}</p>
              <a
                href="#contact"
                className="service-link"
                onClick={(e) => handleNavClick(e, "contact")}
              >
                {t("learnMore")}
              </a>
            </div>{" "}
            <div className="service-card">
              <FaUserMd className="service-icon" />
              <h3>{t("onlineConsultation")}</h3>
              <p>{t("onlineConsultationDesc")}</p>
              <Link to="/patient/doctor/all" className="service-link">
                {t("learnMore")}
              </Link>
            </div>
            <div className="service-card">
              <FaStethoscope className="service-icon" />
              <h3>{t("healthRecords")}</h3>
              <p>{t("healthRecordsDesc")}</p>
              <Link to="/login" className="service-link">
                {t("learnMore")}
              </Link>
            </div>
            <div className="service-card">
              <FaShieldAlt className="service-icon" />
              <h3>{t("comprehensiveCare")}</h3>
              <p>{t("comprehensiveCareDesc")}</p>
              <a
                href="#contact"
                className="service-link"
                onClick={(e) => handleNavClick(e, "contact")}
              >
                {t("learnMore")}
              </a>
            </div>
            <div className="service-card">
              <FaClock className="service-icon" />
              <h3>{t("telemedicine")}</h3>
              <p>{t("telemedicineDesc")}</p>
              <Link to="/patient/appointment/available" className="service-link">
                {t("learnMore")}
              </Link>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Why Choose Us Section */}
      <LazySection
        className="why-choose-us"
        animationType="fadeInLeft"
        threshold={0.1}
        delay={0.1}
      >
        <div className="why-container">
          <div className="why-content">
            <h2>{t("whyChooseTitle")}</h2>
            <div className="features-list">
              <div className="feature-item">
                <FaShieldAlt className="feature-icon" />
                <div>
                  <h4>{t("advancedTechnology")}</h4>
                  <p>{t("advancedTechnologyDesc")}</p>
                </div>
              </div>
              <div className="feature-item">
                <FaUserMd className="feature-icon" />
                <div>
                  <h4>{t("expertTeam")}</h4>
                  <p>{t("expertTeamDesc")}</p>
                </div>
              </div>
              <div className="feature-item">
                <FaClock className="feature-icon" />
                <div>
                  <h4>{t("availability24")}</h4>
                  <p>{t("availability24Desc")}</p>
                </div>
              </div>
              <div className="feature-item">
                <FaHospital className="feature-icon" />
                <div>
                  <h4>{t("comprehensiveCare")}</h4>
                  <p>{t("comprehensiveCareDesc")}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="why-image">
            <div className="image-placeholder">
              <FaHeartbeat className="placeholder-icon" />
              <p>{t("aboutTitle")}</p>
            </div>
          </div>
        </div>
      </LazySection>

      {/* CTA Section */}
      <LazySection
        className="cta"
        animationType="scaleIn"
        threshold={0.2}
        delay={0.1}
      >
        <div className="cta-container">
          <h2>{t("ctaTitle")}</h2>
          <p>{t("ctaSubtitle")}</p>
          <div className="cta-buttons">
            <Link to="/patient/register" className="btn-primary">
              {t("getStarted")}
            </Link>
            <Link to="/researcher/register" className="btn-secondary">
              {t("applyResearch")}
            </Link>
          </div>
        </div>
      </LazySection>

      {/* About Section */}
      <LazySection
        id="about"
        className="about"
        animationType="fadeInRight"
        threshold={0.1}
        delay={0.2}
      >
        <div className="about-container">
          <div className="section-header">
            <h2>About HMS</h2>
            <p>Leading healthcare management with innovation and compassion</p>
          </div>
          <div className="about-content">
            <div className="about-text">
              <div className="about-item">
                <h3>{t("ourMission")}</h3>
                <p>{t("missionText")}</p>
              </div>
              <div className="about-item">
                <h3>{t("ourVision")}</h3>
                <p>{t("visionText")}</p>
              </div>
              <div className="about-item">
                <h3>{t("ourValues")}</h3>
                <ul className="values-list">
                  <li>
                    <FaHeartbeat className="value-icon" />{" "}
                    {t("patientCenteredCare")}
                  </li>
                  <li>
                    <FaShieldAlt className="value-icon" />{" "}
                    {t("trustTransparency")}
                  </li>
                  <li>
                    <FaUserMd className="value-icon" />{" "}
                    {t("clinicalExcellence")}
                  </li>
                  <li>
                    <FaUsers className="value-icon" />{" "}
                    {t("collaborativeApproach")}
                  </li>
                </ul>
              </div>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">{t("healthcareProviders")}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">{t("patientsServed")}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">{t("medicalSpecialties")}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">{t("emergencyCare")}</div>
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Contact Section */}
      <LazySection
        id="contact"
        className="contact"
        animationType="fadeInUp"
        threshold={0.1}
        delay={0.1}
      >
        <div className="contact-container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>We&apos;re here to help you with all your healthcare needs</p>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <h4>{t("callUs")}</h4>
                  <p>+1 (555) 123-4567</p>
                  <p>{t("availability24")}</p>
                </div>
              </div>

              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h4>{t("emailUs")}</h4>
                  <p>info@healthcaremanagement.com</p>
                  <p>support@healthcaremanagement.com</p>
                </div>
              </div>

              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h4>{t("ourLocation")}</h4>
                  <p>123 Healthcare Street</p>
                  <p>Medical District, City 12345</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form>
                <div className="form-group">
                  <input type="text" placeholder={t("yourName")} required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder={t("yourEmail")} required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder={t("phoneNumber")} />
                </div>
                <div className="form-group">
                  <textarea placeholder={t("yourMessage")} rows="5"></textarea>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ color: "black" }}
                >
                  {t("sendMessage")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <FaHeartbeat className="footer-logo-icon" />
                <span>Healthcare Management System</span>
              </div>
              <p>
                Providing quality healthcare services with compassion and
                excellence.
              </p>
            </div>

            <div className="footer-section">
              <h4>{t("quickLinks")}</h4>
              <ul>
                <li>
                  <a href="#home" onClick={(e) => handleNavClick(e, "home")}>
                    {t("home")}
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, "services")}
                  >
                    {t("services")}
                  </a>
                </li>
                <li>
                  <Link to="/login">{t("login")}</Link>
                </li>
                <li>
                  <Link to="/patient/register">{t("register")}</Link>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>{t("services")}</h4>
              <ul>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, "services")}
                  >
                    {t("emergencyServices")}
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, "services")}
                  >
                    {t("onlineConsultation")}
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, "services")}
                  >
                    {t("healthRecords")}
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, "services")}
                  >
                    {t("telemedicine")}
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>{t("contactInfo")}</h4>
              <ul>
                <li>
                  <FaPhone /> +1 (555) 123-4567
                </li>
                <li>
                  <FaEnvelope /> info@hms.com
                </li>
                <li>
                  <FaMapMarkerAlt /> 123 Healthcare Street
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 HMS. {t("allRightsReserved")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
