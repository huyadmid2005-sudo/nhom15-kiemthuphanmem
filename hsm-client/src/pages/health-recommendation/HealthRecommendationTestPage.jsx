import { useState } from "react";
import PatientSidebar from "../../components/sidebar/PatientSidebar";
import Navbar from "../../components/navbar/Navbar";
import HealthRecommendation from "../../components/appointments/HealthRecommendation";
import AppointmentHealthRecommendation from "../../components/appointments/AppointmentHealthRecommendation";
import HealthSummaryCard from "../../components/appointments/HealthSummaryCard";
import { FaHeart, FaChartLine, FaFileMedical } from "react-icons/fa";

const HealthRecommendationTestPage = () => {
  const [activeDemo, setActiveDemo] = useState("summary");

  const demoOptions = [
    {
      id: "summary",
      label: "Health Summary Card",
      icon: FaHeart,
      description: "Compact health overview for dashboard",
    },
    {
      id: "full",
      label: "Full Health Recommendations",
      icon: FaChartLine,
      description: "Complete health recommendation system",
    },
    {
      id: "appointment",
      label: "Appointment Health Details",
      icon: FaFileMedical,
      description: "Detailed health info for specific appointment",
    },
  ];

  const renderDemo = () => {
    switch (activeDemo) {
      case "summary":
        return (
          <div className="max-w-sm mx-auto">
            <HealthSummaryCard
              patientId="patient123"
              onViewDetails={() => setActiveDemo("full")}
            />
          </div>
        );
      case "full":
        return (
          <HealthRecommendation
            patientId="patient123"
            appointmentId="appointment456"
          />
        );
      case "appointment":
        return (
          <AppointmentHealthRecommendation
            appointmentId="appointment123"
            doctorId="doctor456"
            patientId="patient789"
          />
        );
      default:
        return <div>Select a demo option</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-sky-50">
      <PatientSidebar />
      <div className="min-w-0 flex-1">
        <Navbar />

        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🏥 Health Recommendation System Demo
            </h1>
            <p className="text-gray-600">
              Explore different components of the health recommendation feature
            </p>
          </div>

          {/* Demo Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Choose Demo:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveDemo(option.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      activeDemo === option.id
                        ? "border-blue-500 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon
                        className={`w-6 h-6 ${
                          activeDemo === option.id
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                      <h3
                        className={`font-semibold ${
                          activeDemo === option.id
                            ? "text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        {option.label}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Demo Content */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Demo: {demoOptions.find((opt) => opt.id === activeDemo)?.label}
              </h2>
              <div className="text-sm text-gray-500">Live Preview</div>
            </div>

            <div className="bg-white rounded-lg p-4 min-h-[400px]">
              {renderDemo()}
            </div>
          </div>

          {/* Features List */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ✨ Available Features:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-green-600">
                  ✅ Implemented:
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Doctor recommendations with priority levels</li>
                  <li>• Health metrics tracking (BP, Heart Rate, BMI)</li>
                  <li>• Medication prescriptions with dosage</li>
                  <li>• Important health warnings</li>
                  <li>• Follow-up appointment scheduling</li>
                  <li>• Interactive chat support</li>
                  <li>• Responsive design for all devices</li>
                  <li>• Beautiful UI with gradients and animations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-600">
                  🔮 Next Features:
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Real-time health data integration</li>
                  <li>• AI-powered health insights</li>
                  <li>• Appointment booking from recommendations</li>
                  <li>• Health trend charts and analytics</li>
                  <li>• Push notifications for medication</li>
                  <li>• Emergency contact system</li>
                  <li>• PDF export for prescriptions</li>
                  <li>• Multi-language support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecommendationTestPage;
