import { useLanguage } from "../../contexts/LanguageContext";
import { FaGlobe } from "react-icons/fa";
import "./LanguageToggle.scss";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className="language-toggle"
      onClick={toggleLanguage}
      title={language === "en" ? "Chuyển sang tiếng Việt" : "Switch to English"}
    >
      <FaGlobe className="globe-icon" />
      <span className="language-text">{language === "en" ? "VI" : "EN"}</span>
    </button>
  );
};

export default LanguageToggle;
