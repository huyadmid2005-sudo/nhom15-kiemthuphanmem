import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const HealthSummaryCard = ({ patientId, onViewDetails }) => {
  const [healthSummary, setHealthSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHealthSummary({
        latestRecommendation: {
          doctorName: "Dr. Nguyễn Văn A",
          date: "2025-08-20",
          priority: "high",
          title: "Kiểm soát huyết áp",
          summary: "Cần theo dõi huyết áp hàng ngày và điều chỉnh chế độ ăn",
        },
        healthMetrics: [
          { name: "Huyết áp", value: "145/92", status: "high" },
          { name: "Nhịp tim", value: "78", status: "normal" },
          { name: "BMI", value: "24.8", status: "normal" },
        ],
        nextFollowUp: "2025-09-20",
        urgentAlerts: 1,
      });
      setLoading(false);
    }, 500);
  }, [patientId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "high":
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case "normal":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "low":
        return <InformationCircleIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <InformationCircleIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "high":
        return "text-red-600";
      case "normal":
        return "text-green-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!healthSummary) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Chưa có dữ liệu sức khỏe</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartSolid className="w-6 h-6" />
            <h3 className="font-semibold">Health Summary</h3>
          </div>
          {healthSummary.urgentAlerts > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {healthSummary.urgentAlerts} Alert
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Latest Recommendation */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Lời khuyên mới nhất
            </h4>
            <span className="text-xs text-gray-500">
              {healthSummary.latestRecommendation.date}
            </span>
          </div>
          <div
            className={`p-3 rounded-lg ${
              healthSummary.latestRecommendation.priority === "high"
                ? "bg-red-50 border border-red-200"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <p className="text-sm font-medium text-gray-900 mb-1">
              {healthSummary.latestRecommendation.title}
            </p>
            <p className="text-xs text-gray-600">
              {healthSummary.latestRecommendation.summary}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              - {healthSummary.latestRecommendation.doctorName}
            </p>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Chỉ số sức khỏe
          </h4>
          <div className="space-y-2">
            {healthSummary.healthMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(metric.status)}
                  <span className="text-sm text-gray-700">{metric.name}</span>
                </div>
                <span
                  className={`text-sm font-medium ${getStatusColor(
                    metric.status
                  )}`}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Follow-up */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">
                Lịch tái khám tiếp theo
              </p>
              <p className="text-sm font-semibold text-blue-800">
                {healthSummary.nextFollowUp}
              </p>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={onViewDetails}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span className="text-sm font-medium">Xem chi tiết</span>
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

HealthSummaryCard.propTypes = {
  patientId: PropTypes.string,
  onViewDetails: PropTypes.func.isRequired,
};

export default HealthSummaryCard;
