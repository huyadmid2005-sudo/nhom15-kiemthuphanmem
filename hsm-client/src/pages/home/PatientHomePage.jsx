import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstancePatientService from "../../utils/axiosInstancePatientService";
import {
  FaHeartbeat,
  FaRulerVertical,
  FaWeight,
  FaCalendarPlus,
  FaUserMd,
  FaUserEdit,
  FaRobot,
  FaNotesMedical,
  FaAppleAlt,
  FaRunning,
  FaBed,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/PatientSidebar";

const PatientHomePage = () => {
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasNoData, setHasNoData] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const patientId = localStorage.getItem("patientId");

        // Fetch patient profile for personalized greeting
        try {
          const profileResp = await axiosInstancePatientService.get(
            "/profile",
            { signal: controller.signal }
          );
          const profile = profileResp.data;
          if (profile?.firstName) {
            setPatientName(profile.firstName);
          }
        } catch {
          // Non-critical — proceed without name
        }

        if (!patientId) {
          setLoading(false);
          setHasNoData(true);
          return;
        }

        const response = await axiosInstancePatientService.get(
          `/health-records/patient/${patientId}`,
          { signal: controller.signal }
        );
        const data = response.data;
        if (data && data.length > 0) {
          setHealthData(data[0]);
          processChartData(data);
        } else {
          setHasNoData(true);
        }
      } catch (error) {
        if (error.name === "CanceledError") return;
        console.error("Error fetching health data:", error);
        setHasNoData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  const processChartData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return;
    const dates = data.map((item) => item.checkupDate);
    const bodyTemperatures = data.map((item) => item.bodyTemperature);
    const pulseRates = data.map((item) => item.pulseRate);
    const bloodSugars = data.map((item) => item.bloodSugar);

    setChartData({
      labels: dates,
      datasets: [
        {
          label: "Body Temperature",
          data: bodyTemperatures,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Pulse Rate",
          data: pulseRates,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
        {
          label: "Blood Sugar",
          data: bloodSugars,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    });
  };

  const calculateBMI = (heightInCm, weightInKg) => {
    if (heightInCm && weightInKg) {
      const heightInMeters = heightInCm / 100;
      return (weightInKg / heightInMeters ** 2).toFixed(2);
    }
    return "N/A";
  };

  const calculateBMR = (heightInCm, weightInKg, age, gender) => {
    if (heightInCm && weightInKg && age && gender) {
      if (gender === "Male") {
        return 88.362 + 13.397 * weightInKg + 4.799 * heightInCm - 5.677 * 22.2;
      } else {
        return 447.593 + 9.247 * weightInKg + 3.098 * heightInCm - 4.33 * 22.4;
      }
    }
    return 88.362 + 13.397 * weightInKg + 4.799 * heightInCm - 5.677 * 22.55;
  };

  /** Quick action cards configuration */
  const quickActions = [
    {
      icon: FaCalendarPlus,
      title: "Schedule a Checkup",
      description: "Book your first appointment to start tracking your health journey",
      path: "/patient/appointment/available",
      iconBg: "bg-blue-500",
      borderColor: "border-l-blue-500",
      iconColor: "text-blue-500",
      lightBg: "bg-blue-50",
    },
    {
      icon: FaUserMd,
      title: "Browse Doctors",
      description: "Find specialists that match your healthcare needs",
      path: "/patient/doctor/all",
      iconBg: "bg-emerald-500",
      borderColor: "border-l-emerald-500",
      iconColor: "text-emerald-500",
      lightBg: "bg-emerald-50",
    },
    {
      icon: FaUserEdit,
      title: "Complete Your Profile",
      description: "Update your medical details for personalized care",
      path: "/patient/profile",
      iconBg: "bg-cyan-500",
      borderColor: "border-l-cyan-500",
      iconColor: "text-cyan-500",
      lightBg: "bg-cyan-50",
    },
    {
      icon: FaRobot,
      title: "AI Health Assistant",
      description: "Get instant answers to your health questions 24/7",
      path: "/patient/health-support-chat",
      iconBg: "bg-sky-500",
      borderColor: "border-l-sky-500",
      iconColor: "text-sky-500",
      lightBg: "bg-sky-50",
    },
  ];

  /** Health tips for new patients */
  const healthTips = [
    {
      icon: FaAppleAlt,
      title: "Nutrition",
      text: "Eat a balanced diet rich in fruits, vegetables, and whole grains for optimal health.",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      icon: FaRunning,
      title: "Exercise",
      text: "Stay active with at least 30 minutes of moderate exercise daily.",
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      icon: FaBed,
      title: "Rest",
      text: "Quality sleep of 7-9 hours each night is crucial for recovery and wellbeing.",
      gradient: "from-cyan-400 to-sky-500",
    },
    {
      icon: FaNotesMedical,
      title: "Prevention",
      text: "Regular checkups help catch potential issues early for better outcomes.",
      gradient: "from-blue-400 to-sky-600",
    },
  ];

  /** Welcome + Quick Actions UI for new patients — Modern Design */
  const renderWelcomeDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Banner — Gradient with decorative elements */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-cyan-600 to-blue-700 rounded-2xl p-8 md:p-10 text-white shadow-xl">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-56 h-56 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/10 rounded-full" />

        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium tracking-wide uppercase mb-2">
            Patient Dashboard
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            Welcome back{patientName ? `, ${patientName}` : ""}!
          </h2>
          <p className="text-blue-100/90 text-lg max-w-xl leading-relaxed">
            Your health journey starts here. Let&apos;s get you set up with your
            first checkup and personalized health tracking.
          </p>
          <button
            onClick={() => navigate("/patient/appointment/available")}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-sky-700 font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-sky-50 transition-all duration-200"
          >
            <FaCalendarPlus className="text-sm" />
            Get Started
          </button>
        </div>
      </div>

      {/* Quick Actions — Modern card style */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">
            Quick Actions
          </h3>
          <span className="text-xs text-gray-400 font-medium">
            4 actions available
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className={`group relative bg-white rounded-xl p-5 text-left border-l-4 ${action.borderColor} shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
            >
              <div
                className={`${action.lightBg} w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
              >
                <action.icon className={`text-xl ${action.iconColor}`} />
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1.5">
                {action.title}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {action.description}
              </p>
              {/* Arrow indicator on hover */}
              <div className="absolute top-5 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Health Tips — Modern gradient style */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">
            Daily Health Tips
          </h3>
          <span className="text-xs text-gray-400 font-medium">
            Wellness essentials
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {healthTips.map((tip) => (
            <div
              key={tip.title}
              className="group relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              {/* Gradient top bar */}
              <div className={`h-1.5 bg-gradient-to-r ${tip.gradient}`} />
              <div className="p-5">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${tip.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}
                >
                  <tip.icon className="text-white text-sm" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1.5">
                  {tip.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {tip.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Trends Placeholder — Polished empty state */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">
            Health Trends
          </h3>
          <span className="text-xs text-gray-400 font-medium">
            Updated after checkups
          </span>
        </div>
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaHeartbeat className="text-2xl text-gray-300" />
          </div>
          <h4 className="font-bold text-gray-600 mb-2">
            No health data yet
          </h4>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mb-5 leading-relaxed">
            Your BMI, blood pressure, and other health metrics will be
            visualized here after your first checkup with a doctor.
          </p>
          <button
            onClick={() => navigate("/patient/appointment/available")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors duration-200"
          >
            <FaCalendarPlus className="text-xs" />
            Book Your First Checkup
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-sky-50">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="p-3 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading health data...</p>
            </div>
          </div>
        ) : hasNoData || !healthData ? (
          renderWelcomeDashboard()
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <FaRulerVertical className="text-4xl text-blue-500 mb-3 mx-auto" />
                <h3 className="text-xl font-bold mb-2">BMI</h3>
                <p className="text-lg">
                  {calculateBMI(healthData.heightInCm, healthData.weightInKg)}
                </p>
              </div>

              <div className="card bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <FaWeight className="text-4xl text-green-500 mb-3 mx-auto" />
                <h3 className="text-xl font-bold mb-2">BMR</h3>
                <p className="text-lg">
                  {calculateBMR(
                    healthData.heightInCm,
                    healthData.weightInKg,
                    healthData.age,
                    healthData.gender
                  )}
                </p>
              </div>

              <div className="card bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <FaHeartbeat className="text-4xl text-red-500 mb-3 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Blood Pressure</h3>
                <p className="text-lg">{healthData.bloodPressure || "N/A"}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Health Trends</h2>
              {chartData && chartData.labels.length > 0 && (
                <Line data={chartData} />
              )}
            </div>
          </>
        )}
        </main>
      </div>
    </div>
  );
};

export default PatientHomePage;

