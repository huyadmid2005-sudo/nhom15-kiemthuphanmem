import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InventoryIcon from "@mui/icons-material/Inventory";
import FolderIcon from "@mui/icons-material/Folder";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import RoomIcon from "@mui/icons-material/Room";
import { useNavigate } from "react-router-dom";
import { AnimatedSubmenu } from "./SidebarMotion";

const Sidebar = () => {
  const navigate = useNavigate();
  const [patientSubmenuOpen, setPatientSubmenuOpen] = useState(false);
  const [doctorSubmenuOpen, setDoctorSubmenuOpen] = useState(false);
  const [inventorySubmenuOpen, setInventorySubmenuOpen] = useState(false);
  const [healthRecordSubmenuOpen, setHealthRecordSubmenuOpen] = useState(false);
  const [analyticsSubmenuOpen, setAnalyticsSubmenuOpen] = useState(false);
  const [roomSubmenuOpen, setRoomSubmenuOpen] = useState(false);

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
              to="/dashboard"
              className="ml-4 text-base font-semibold text-white"
            >
              Dashboard
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
                  <Link to="/admin/patient/list" className="text-black">
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
                Doctors
              </span>
              {doctorSubmenuOpen ? (
                <ExpandLessIcon className="text-white" />
              ) : (
                <ExpandMoreIcon className="text-white" />
              )}
            </button>
            <AnimatedSubmenu open={doctorSubmenuOpen} className="mt-1">
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link to="/admin/doctor/list" className="text-black">
                    Doctor List
                  </Link>
                </li>
            </AnimatedSubmenu>
          </li>

          {/* Inventory Management Section */}
          <li>
            <button
              type="button"
              className="flex w-full items-center bg-blue-500 p-2 text-left hover:bg-blue-600"
              onClick={() => setInventorySubmenuOpen(!inventorySubmenuOpen)}
              aria-expanded={inventorySubmenuOpen}
            >
              <InventoryIcon className="text-white" />
              <span className="flex-grow ml-4 text-base font-semibold text-white">
                Inventory
              </span>
              {inventorySubmenuOpen ? (
                <ExpandLessIcon className="text-white" />
              ) : (
                <ExpandMoreIcon className="text-white" />
              )}
            </button>
            <AnimatedSubmenu open={inventorySubmenuOpen} className="mt-1">
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link to="/admin/inventory/medicines" className="text-black">
                    Medicine Management
                  </Link>
                </li>
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link
                    to="/admin/inventory/medical-equipment"
                    className="text-black"
                  >
                    Medical Equipment
                  </Link>
                </li>
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link
                    to="/admin/inventory/expiry-alerts"
                    className="text-black"
                  >
                    Expiry Alerts
                  </Link>
                </li>
            </AnimatedSubmenu>
          </li>

          {/* Health Records Management Section */}
          <li>
            <button
              type="button"
              className="flex w-full items-center bg-blue-500 p-2 text-left hover:bg-blue-600"
              onClick={() =>
                setHealthRecordSubmenuOpen(!healthRecordSubmenuOpen)
              }
              aria-expanded={healthRecordSubmenuOpen}
            >
              <FolderIcon className="text-white" />
              <span className="flex-grow ml-4 text-base font-semibold text-white">
                Health Records
              </span>
              {healthRecordSubmenuOpen ? (
                <ExpandLessIcon className="text-white" />
              ) : (
                <ExpandMoreIcon className="text-white" />
              )}
            </button>
            <AnimatedSubmenu open={healthRecordSubmenuOpen} className="mt-1">
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link to="/admin/health-records" className="text-black">
                    Manage Health Records
                  </Link>
                </li>
            </AnimatedSubmenu>
          </li>

          {/* Analytics & Research Management Section */}
          <li>
            <button
              type="button"
              className="flex w-full items-center bg-blue-500 p-2 text-left hover:bg-blue-600"
              onClick={() => setAnalyticsSubmenuOpen(!analyticsSubmenuOpen)}
              aria-expanded={analyticsSubmenuOpen}
            >
              <AnalyticsIcon className="text-white" />
              <span className="flex-grow ml-4 text-base font-semibold text-white">
                Analytics & Research
              </span>
              {analyticsSubmenuOpen ? (
                <ExpandLessIcon className="text-white" />
              ) : (
                <ExpandMoreIcon className="text-white" />
              )}
            </button>
            <AnimatedSubmenu open={analyticsSubmenuOpen} className="mt-1">
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link to="/admin/analytics" className="text-black">
                    Research Management
                  </Link>
                </li>
            </AnimatedSubmenu>
          </li>

          {/* Room Management Section */}
          <li>
            <button
              type="button"
              className="flex w-full items-center bg-blue-500 p-2 text-left hover:bg-blue-600"
              onClick={() => setRoomSubmenuOpen(!roomSubmenuOpen)}
              aria-expanded={roomSubmenuOpen}
            >
              <RoomIcon className="text-white" />
              <span className="flex-grow ml-4 text-base font-semibold text-white">
                Room Management
              </span>
              {roomSubmenuOpen ? (
                <ExpandLessIcon className="text-white" />
              ) : (
                <ExpandMoreIcon className="text-white" />
              )}
            </button>
            <AnimatedSubmenu open={roomSubmenuOpen} className="mt-1">
                <li className="py-1 text-base font-semibold hover:bg-gray-100 border border-gray-200 pl-10">
                  <Link to="/admin/rooms" className="text-black">
                    Manage Rooms
                  </Link>
                </li>
            </AnimatedSubmenu>
          </li>
          {/* ... Add more sections as needed ... */}
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
