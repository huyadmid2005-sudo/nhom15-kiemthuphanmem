import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import axiosInstanceNotificationService from "../../utils/axiosInstanceNotificationService";

const routeLabels = [
  { match: "/patient/health-recommendation", label: "Health Recommendations" },
  { match: "/patient/health-support-chat", label: "AI Health Support" },
  { match: "/patient/appointment/available", label: "Available Appointments" },
  { match: "/patient/appointment/all", label: "Booked Appointments" },
  { match: "/patient/doctor", label: "Doctors" },
  { match: "/patient/profile", label: "My Profile" },
  { match: "/patient/articles", label: "Doctor Articles" },
  { match: "/patient/home", label: "Dashboard" },
  { match: "/patient/dashboard", label: "Dashboard" },
];

const Navbar = () => {
  const location = useLocation();
  const [showSlider, setShowSlider] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [allNotifications, setAllNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const fetchedRef = useRef(false);

  const pageLabel = useMemo(() => {
    return (
      routeLabels.find((route) => location.pathname.startsWith(route.match))
        ?.label || "Workspace"
    );
  }, [location.pathname]);

  const isPatientWorkspace = location.pathname.startsWith("/patient");

  const fetchUserProfile = async (signal) => {
    try {
      const response = await axiosInstancePatientService.get("/profile", {
        signal,
      });
      setUserId(response.data.userId);
    } catch (error) {
      if (error.name === "CanceledError") return;
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchAllNotifications = async () => {
    if (!userId) return;
    try {
      const response = await axiosInstanceNotificationService.get(`/${userId}`);
      setAllNotifications(response.data);
    } catch (error) {
      console.error("Error fetching all notifications:", error);
    }
  };

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const response = await axiosInstanceNotificationService.get(
        `/unread/${userId}`
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await axiosInstanceNotificationService.post(`/mark-all-read/${userId}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const controller = new AbortController();
    fetchUserProfile(controller.signal);

    return () => controller.abort();
  }, []);

  const openPatientMenu = () => {
    window.dispatchEvent(new CustomEvent("hms:toggle-patient-sidebar"));
  };

  const handleClick = (type) => {
    if (type === "notifications") {
      setShowSlider((value) => !value);

      if (!showSlider) {
        fetchNotifications();
        setShowAllNotifications(false);
      }
      return;
    }

    if (type === "menu") {
      openPatientMenu();
    }
  };

  const handleViewAllNotifications = () => {
    fetchAllNotifications().then(() => {
      setShowAllNotifications((value) => !value);
      setShowSlider(false);
    });
  };

  const notificationPanelClass =
    "absolute right-0 top-14 z-50 max-h-[420px] w-[calc(100vw-2rem)] max-w-sm overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xl";

  const NotificationSlider = () => (
    <div className={`${notificationPanelClass} ${showSlider ? "block" : "hidden"}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-800">
          Notifications
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            onClick={markAllAsRead}
          >
            Mark read
          </button>
          <button
            type="button"
            onClick={handleViewAllNotifications}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            View all
          </button>
        </div>
      </div>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div
            key={index}
            className="mb-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
          >
            <p className="text-sm font-semibold text-slate-800">
              {notification.notificationType}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {notification.notificationText}
            </p>
          </div>
        ))
      ) : (
        <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
          No unread notifications
        </p>
      )}
    </div>
  );

  const AllNotificationsView = () => (
    <div
      className={`${notificationPanelClass} ${
        showAllNotifications ? "block" : "hidden"
      }`}
    >
      <h2 className="mb-4 text-base font-semibold text-slate-800">
        All Notifications
      </h2>
      {allNotifications.length > 0 ? (
        allNotifications.map((notification, index) => (
          <div
            key={index}
            className="mb-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
          >
            <p className="text-sm font-semibold text-slate-800">
              {notification.notificationType}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {notification.notificationText}
            </p>
          </div>
        ))
      ) : (
        <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
          No notifications
        </p>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-sky-50/90 px-3 py-3 backdrop-blur md:px-5">
      <div className="relative mx-auto flex min-h-[72px] max-w-[120rem] items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-3 shadow-sm sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          {isPatientWorkspace && (
            <button
              type="button"
              onClick={() => handleClick("menu")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 md:hidden"
              aria-label="Open patient navigation"
            >
              <ListOutlinedIcon fontSize="small" />
            </button>
          )}

          <div className="min-w-0">
            <p className="hidden text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 sm:block">
              Hospital Management System
            </p>
            <div className="mt-0.5 flex min-w-0 items-center gap-3">
              <Link
                to={isPatientWorkspace ? "/patient/home" : "/"}
                className="shrink-0 text-2xl font-semibold text-slate-950 no-underline transition-colors hover:text-sky-700"
              >
                HMS
              </Link>
              <span className="hidden h-5 w-px bg-slate-200 sm:block" />
              <span className="truncate text-sm font-medium text-slate-500 sm:text-base">
                {pageLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isPatientWorkspace && (
            <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-sky-50 px-3 py-2 text-sm font-medium text-slate-600 lg:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Patient workspace
            </div>
          )}

          <button
            type="button"
            onClick={() => handleClick("language")}
            className="hidden min-h-[44px] items-center gap-2 rounded-2xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 sm:flex"
            aria-label="Change language"
          >
            <LanguageOutlinedIcon fontSize="small" />
            <span>English</span>
          </button>

          <button
            type="button"
            onClick={() => handleClick("notifications")}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Open notifications"
          >
            <NotificationsNoneOutlinedIcon fontSize="small" />
            {notifications.length > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            )}
          </button>

          {isPatientWorkspace && (
            <button
              type="button"
              onClick={() => handleClick("menu")}
              className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 md:flex"
              aria-label="Toggle workspace menu"
            >
              <ListOutlinedIcon fontSize="small" />
            </button>
          )}
        </div>

        <NotificationSlider />
        <AllNotificationsView />
      </div>
    </header>
  );
};

export default Navbar;
