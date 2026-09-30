import { useState } from "react";
import AppointmentPatientBooked from "../../components/doctor-appointment/appointmentPatientBooked";
import HealthRecommendation from "../../components/appointments/HealthRecommendation";
import PatientProfile from "../../components/patients/PatientProfile";
import PatientSidebar from "../../components/sidebar/PatientSidebar";
import Navbar from "../../components/navbar/Navbar";
import {
  CalendarDaysIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const PatientAppointmentDashboard = () => {
  const [activeView, setActiveView] = useState("profile");

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: UserCircleIcon,
      component: PatientProfile,
    },
    {
      id: "appointments",
      label: "My Appointments",
      icon: CalendarDaysIcon,
      component: AppointmentPatientBooked,
    },
    {
      id: "health-recommendations",
      label: "Health Recommendations",
      icon: HeartIcon,
      component: HealthRecommendation,
    },
    {
      id: "health-records",
      label: "Health Records",
      icon: ClipboardDocumentListIcon,
      component: () => (
        <div className="p-8 text-center text-gray-500">
          Health Records coming soon...
        </div>
      ),
    },
  ];

  const ActiveComponent = menuItems.find(
    (item) => item.id === activeView
  )?.component;

  return (
    <div className="flex min-h-screen bg-sky-50">
      <PatientSidebar />
      <div className="min-w-0 flex-1">
        <Navbar />

        {/* Tab Navigation */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="overflow-x-auto px-3 sm:px-6">
            <nav className="flex min-w-max gap-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex min-h-[48px] items-center gap-2 border-b-2 px-1 text-sm font-semibold transition-colors ${
                      activeView === item.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-6">{ActiveComponent && <ActiveComponent />}</div>
      </div>
    </div>
  );
};

export default PatientAppointmentDashboard;
