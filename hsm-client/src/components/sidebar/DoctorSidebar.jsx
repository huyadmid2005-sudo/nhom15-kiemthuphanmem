import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArticleIcon from "@mui/icons-material/Article";
import { useNavigate } from "react-router-dom";
import { AnimatedSubmenu } from "./SidebarMotion";

const Sidebar = () => {
  const navigate = useNavigate();
  const [patientSubmenuOpen, setPatientSubmenuOpen] = useState(false);
  const [doctorSubmenuOpen, setDoctorSubmenuOpen] = useState(false);
  const [healthSubmenuOpen, setHealthSubmenuOpen] = useState(false);
  const [articlesSubmenuOpen, setArticlesSubmenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  return (
    <>
    <div className="fixed inset-y-0 left-0 z-40 flex h-dvh w-56 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-12 shrink-0 items-center justify-center">
        <span className="text-xl font-bold text-purple-600">HMS</span>
      </div>
      <hr />
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        <ul className="space-y-2">
          {/* Main Options */}
          <li className="flex items-center bg-blue-500 p-2 hover:bg-blue-600">
            <DashboardIcon className="text-white" />
            <Link
              to="/doctor/dashboard"
              className="ml-4 text-base font-semibold text-white"
            >
              Dashboard
            </Link>
          </li>

          {/* Profile Section */}
          <li className="flex items-center bg-blue-500 p-2 hover:bg-blue-600">
            <AccountCircleIcon className="text-white" />
            <Link
              to="/doctor/profile"
              className="ml-4 text-base font-semibold text-white"
            >
              My Profile
            </Link>
          </li>
          {/* Patient Section */}
          <li>
            <button
              type="button"
              className="flex w-full items-center bg-blue-500 p-2 text-left hover:bg-blue-600"
              onClick={() => setPatientSubmenuOpen(!patientSubmenuOpen)}
              aria-expanded={patientSubmenuOpen}
            >
              <PersonAddAltIcon className="text-white" />
              <span className="flex-grow ml-4 text-base font-semibold text-white">
                Patients
              </span>
              {patientSubmenuOpen ? (
                <ExpandLessIcon className="text-white" />
              ) : (
                <ExpandMoreIcon className="text-white" />
              )}
            </button>
            <AnimatedSubmenu open={patientSubmenuOpen} className="mt-1">
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link to="/doctor/patient/all" className="text-black">
                    Patient List
                  </Link>
                </li>
                {/* Additional submenu items can be added here */}
            </AnimatedSubmenu>
          </li>
          {/* ... Dashboard, Patients ... */}
          {/* Doctor Section */}
          <li>
            <button
              type="button"
              className="flex w-full items-center bg-blue-500 p-2 text-left hover:bg-blue-600"
              onClick={() => setDoctorSubmenuOpen(!doctorSubmenuOpen)}
              aria-expanded={doctorSubmenuOpen}
            >
              <MedicalServicesIcon className="text-white" />
              <span className="flex-grow ml-4 text-base font-semibold text-white">
                Appointment
              </span>
              {doctorSubmenuOpen ? (
                <ExpandLessIcon className="text-white" />
              ) : (
                <ExpandMoreIcon className="text-white" />
              )}
            </button>
            <AnimatedSubmenu open={doctorSubmenuOpen} className="mt-1">
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link to="/doctor/appointment/create" className="text-black">
                    Create Appointments
                  </Link>
                </li>
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link to="/doctor/appointment/getall" className="text-black">
                    Available Appointments
                  </Link>
                </li>
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link
                    to="/doctor/appointment/booked/getall"
                    className="text-black"
                  >
                    Booked Appointments
                  </Link>
                </li>
            </AnimatedSubmenu>
          </li>

          {/* Health Recommendations Section */}
          <li>
            <button
              type="button"
              className="flex w-full items-center bg-blue-500 p-2 text-left hover:bg-blue-600"
              onClick={() => setHealthSubmenuOpen(!healthSubmenuOpen)}
              aria-expanded={healthSubmenuOpen}
            >
              <HealthAndSafetyIcon className="text-white" />
              <span className="flex-grow ml-4 text-base font-semibold text-white">
                Health Recommendations
              </span>
              {healthSubmenuOpen ? (
                <ExpandLessIcon className="text-white" />
              ) : (
                <ExpandMoreIcon className="text-white" />
              )}
            </button>
            <AnimatedSubmenu open={healthSubmenuOpen} className="mt-1">
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link
                    to="/doctor/health-recommendations"
                    className="text-black"
                  >
                    View All Recommendations
                  </Link>
                </li>
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link
                    to="/doctor/health-recommendation/create"
                    className="text-black"
                  >
                    Create Recommendation
                  </Link>
                </li>
            </AnimatedSubmenu>
          </li>

          {/* Articles Section */}
          <li>
            <button
              type="button"
              className="flex w-full items-center bg-blue-500 p-2 text-left hover:bg-blue-600"
              onClick={() => setArticlesSubmenuOpen(!articlesSubmenuOpen)}
              aria-expanded={articlesSubmenuOpen}
            >
              <ArticleIcon className="text-white" />
              <span className="flex-grow ml-4 text-base font-semibold text-white">
                Articles
              </span>
              {articlesSubmenuOpen ? (
                <ExpandLessIcon className="text-white" />
              ) : (
                <ExpandMoreIcon className="text-white" />
              )}
            </button>
            <AnimatedSubmenu open={articlesSubmenuOpen} className="mt-1">
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link to="/doctor/articles" className="text-black">
                    My Articles
                  </Link>
                </li>
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link to="/doctor/articles/create" className="text-black">
                    Create Article
                  </Link>
                </li>
            </AnimatedSubmenu>
          </li>
        </ul>
      </nav>
      <div className="shrink-0 border-t border-gray-200 p-2">
        <button
          type="button"
          className="flex w-full items-center bg-blue-500 p-2 text-left hover:bg-blue-600"
          onClick={handleLogout}
        >
          <LogoutIcon className="text-white" />
          <span className="ml-4 text-base font-semibold text-white">
            Logout
          </span>
        </button>
      </div>
    </div>
    <div className="w-56 shrink-0" aria-hidden="true" />
    </>
  );
};

export default Sidebar;
