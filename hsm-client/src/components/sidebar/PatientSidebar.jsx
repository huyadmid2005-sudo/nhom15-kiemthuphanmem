import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnimatedPanel } from "./SidebarMotion";

const navItemBase =
  "group flex min-h-[44px] w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2";

const subItemBase =
  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400";

const iconBoxBase =
  "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200";

const sectionLabel =
  "px-2.5 pb-1.5 pt-3 text-[11px] font-bold uppercase text-slate-400";

const PatientSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [doctorSubmenuOpen, setDoctorSubmenuOpen] = useState(false);
  const [appointmentSubmenuOpen, setAppointmentSubmenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const activeSection = useMemo(
    () => ({
      doctors: location.pathname.startsWith("/patient/doctor"),
      appointments: location.pathname.startsWith("/patient/appointment"),
    }),
    [location.pathname]
  );

  useEffect(() => {
    setDoctorSubmenuOpen(activeSection.doctors);
    setAppointmentSubmenuOpen(activeSection.appointments);
    setMobileOpen(false);
  }, [activeSection]);

  useEffect(() => {
    const handleToggle = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setDesktopCollapsed((value) => !value);
        return;
      }

      setMobileOpen((value) => !value);
    };
    const handleClose = () => setMobileOpen(false);

    window.addEventListener("hms:toggle-patient-sidebar", handleToggle);
    window.addEventListener("hms:close-patient-sidebar", handleClose);

    return () => {
      window.removeEventListener("hms:toggle-patient-sidebar", handleToggle);
      window.removeEventListener("hms:close-patient-sidebar", handleClose);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("patientId");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `${navItemBase} ${
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-600 hover:bg-sky-50 hover:text-slate-950"
    }`;

  const iconClass = (isActive) =>
    `${iconBoxBase} ${
      isActive
        ? "border-slate-800 bg-slate-800 text-white"
        : "border-slate-200 bg-white text-slate-500 group-hover:border-sky-200 group-hover:bg-sky-100 group-hover:text-sky-700"
    }`;

  const submenuButtonClass = (active) =>
    `${navItemBase} ${
      active
        ? "bg-sky-100 text-sky-950"
        : "text-slate-600 hover:bg-sky-50 hover:text-slate-950"
    }`;

  const submenuIconClass = (active) =>
    `${iconBoxBase} ${
      active
        ? "border-sky-200 bg-sky-600 text-white"
        : "border-slate-200 bg-white text-slate-500 group-hover:border-sky-200 group-hover:bg-sky-100 group-hover:text-sky-700"
    }`;

  const desktopMotion = reduceMotion
    ? {
        initial: false,
        animate: {},
        exit: {},
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, x: -18 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -18 },
        transition: { duration: 0.18, ease: "easeOut" },
      };

  const overlayMotion = reduceMotion
    ? {
        initial: false,
        animate: {},
        exit: {},
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.16, ease: "easeOut" },
      };

  const sheetMotion = reduceMotion
    ? {
        initial: false,
        animate: {},
        exit: {},
        transition: { duration: 0 },
      }
    : {
        initial: { x: "-100%" },
        animate: { x: 0 },
        exit: { x: "-100%" },
        transition: { duration: 0.18, ease: "easeOut" },
      };

  const SidebarContent = ({ onNavigate }) => (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="shrink-0 border-b border-slate-200 px-6 py-5">
        <div className="mb-5 flex items-center justify-between md:hidden">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition-colors hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Close patient navigation"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <p className="text-[11px] font-bold uppercase text-slate-400">
          Health Management
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white shadow-sm">
            H
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-tight text-slate-950">
              HMS
            </p>
            <p className="truncate text-sm text-slate-500">
              Patient workspace
            </p>
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-hidden px-4 pb-2">
        <p className={sectionLabel}>Overview</p>
        <ul className="space-y-1.5">
          <li>
            <NavLink
              to="/patient/home"
              className={navLinkClass}
              onClick={onNavigate}
            >
              {({ isActive }) => (
                <>
                  <span className={iconClass(isActive)}>
                    <DashboardIcon fontSize="small" />
                  </span>
                  <span className="min-w-0 flex-1">Dashboard</span>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient/profile"
              className={navLinkClass}
              onClick={onNavigate}
            >
              {({ isActive }) => (
                <>
                  <span className={iconClass(isActive)}>
                    <AccountCircleIcon fontSize="small" />
                  </span>
                  <span className="min-w-0 flex-1">My Profile</span>
                </>
              )}
            </NavLink>
          </li>
        </ul>

        <p className={sectionLabel}>Care Services</p>
        <ul className="space-y-1.5">
          <li>
            <button
              type="button"
              className={submenuButtonClass(activeSection.doctors)}
              onClick={() => setDoctorSubmenuOpen((value) => !value)}
              aria-expanded={doctorSubmenuOpen}
            >
              <span className={submenuIconClass(activeSection.doctors)}>
                <MedicalServicesIcon fontSize="small" />
              </span>
              <span className="min-w-0 flex-1 text-left">Doctors</span>
              {doctorSubmenuOpen ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </button>
            <AnimatedPanel open={doctorSubmenuOpen} className="mt-1.5 space-y-1 pl-12">
                <NavLink
                  to="/patient/doctor/all"
                  className={({ isActive }) =>
                    `${subItemBase} ${
                      isActive
                        ? "bg-sky-100 text-sky-800"
                        : "text-slate-500 hover:bg-sky-50 hover:text-sky-800"
                    }`
                  }
                  onClick={onNavigate}
                >
                  Doctor List
                </NavLink>
            </AnimatedPanel>
          </li>

          <li>
            <button
              type="button"
              className={submenuButtonClass(activeSection.appointments)}
              onClick={() => setAppointmentSubmenuOpen((value) => !value)}
              aria-expanded={appointmentSubmenuOpen}
            >
              <span className={submenuIconClass(activeSection.appointments)}>
                <LocalPharmacyIcon fontSize="small" />
              </span>
              <span className="min-w-0 flex-1 text-left">Appointments</span>
              {appointmentSubmenuOpen ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </button>
            <AnimatedPanel
              open={appointmentSubmenuOpen}
              className="mt-1.5 space-y-1 pl-12"
            >
                <NavLink
                  to="/patient/appointment/available"
                  className={({ isActive }) =>
                    `${subItemBase} ${
                      isActive
                        ? "bg-sky-100 text-sky-800"
                        : "text-slate-500 hover:bg-sky-50 hover:text-sky-800"
                    }`
                  }
                  onClick={onNavigate}
                >
                  Available Appointments
                </NavLink>
                <NavLink
                  to="/patient/appointment/all"
                  className={({ isActive }) =>
                    `${subItemBase} ${
                      isActive
                        ? "bg-sky-100 text-sky-800"
                        : "text-slate-500 hover:bg-sky-50 hover:text-sky-800"
                    }`
                  }
                  onClick={onNavigate}
                >
                  Booked Appointments
                </NavLink>
            </AnimatedPanel>
          </li>
        </ul>

        <p className={sectionLabel}>Health Tools</p>
        <ul className="space-y-1.5">
          <li>
            <NavLink
              to="/patient/health-recommendation"
              className={navLinkClass}
              onClick={onNavigate}
            >
              {({ isActive }) => (
                <>
                  <span className={iconClass(isActive)}>
                    <FavoriteIcon fontSize="small" />
                  </span>
                  <span className="min-w-0 flex-1 leading-snug">
                    Health Recommendations
                  </span>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient/health-support-chat"
              className={navLinkClass}
              onClick={onNavigate}
            >
              {({ isActive }) => (
                <>
                  <span className={iconClass(isActive)}>
                    <ChatIcon fontSize="small" />
                  </span>
                  <span className="min-w-0 flex-1 leading-snug">
                    AI Health Support
                  </span>
                </>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient/articles"
              className={navLinkClass}
              onClick={onNavigate}
            >
              {({ isActive }) => (
                <>
                  <span className={iconClass(isActive)}>
                    <ArticleIcon fontSize="small" />
                  </span>
                  <span className="min-w-0 flex-1 leading-snug">
                    Doctor Articles
                  </span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="shrink-0 border-t border-slate-200 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex min-h-[44px] w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-sky-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
        >
          <span className={iconBoxBase + " border-slate-200 bg-white text-slate-500 group-hover:border-sky-200 group-hover:bg-sky-100 group-hover:text-sky-700"}>
            <LogoutIcon fontSize="small" />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  SidebarContent.propTypes = {
    onNavigate: PropTypes.func,
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {!desktopCollapsed && (
          <motion.aside
            key="patient-sidebar-desktop"
            {...desktopMotion}
            className="fixed inset-y-0 left-0 z-40 hidden h-dvh w-72 overflow-hidden border-r border-slate-200 bg-white md:flex"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
      {!desktopCollapsed && (
        <div className="hidden w-72 shrink-0 md:block" aria-hidden="true" />
      )}

      <AnimatePresence initial={false}>
        {mobileOpen && (
        <motion.div
          key="patient-sidebar-mobile"
          {...overlayMotion}
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Patient navigation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45"
            aria-label="Close patient navigation overlay"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            {...sheetMotion}
            className="relative h-dvh w-[min(88vw,20rem)] shadow-2xl"
          >
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </motion.aside>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PatientSidebar;
