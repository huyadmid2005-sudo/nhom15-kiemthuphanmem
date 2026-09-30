import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  HeartIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const AppointmentHealthRecommendation = ({
  appointmentId,
  doctorId,
  patientId,
}) => {
  const [recommendation, setRecommendation] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    // Simulate API call to get appointment-specific recommendations
    setTimeout(() => {
      setRecommendation({
        id: 1,
        appointmentId: appointmentId,
        doctorName: "Dr. Nguyễn Văn A",
        doctorAvatar: "/api/placeholder/64/64",
        specialty: "Tim mạch",
        date: "2025-08-20",
        priority: "high",
        title: "Kết quả khám và lời khuyên",
        diagnosis: "Huyết áp cao độ 1",
        content:
          "Sau khi khám, bạn được chẩn đoán huyết áp cao độ 1. Cần thay đổi lối sống và có thể cần dùng thuốc.",
        recommendations: [
          "Giảm lượng muối trong thức ăn xuống dưới 6g/ngày",
          "Tập thể dục nhẹ 30-45 phút mỗi ngày",
          "Kiểm soát cân nặng, giảm 5-10% nếu thừa cân",
          "Hạn chế rượu bia và không hút thuốc",
          "Theo dõi huyết áp tại nhà 2 lần/ngày",
        ],
        medications: [
          {
            name: "Amlodipine 5mg",
            dosage: "1 viên/ngày vào buổi sáng",
            duration: "30 ngày",
            instructions: "Uống sau ăn, không nhai",
          },
          {
            name: "Aspirin 81mg",
            dosage: "1 viên/ngày vào buổi tối",
            duration: "Dài hạn",
            instructions: "Uống sau ăn tối",
          },
        ],
        followUp: {
          date: "2025-09-20",
          type: "Tái khám",
          note: "Kiểm tra huyết áp và điều chỉnh thuốc nếu cần",
        },
        warnings: [
          "Nếu huyết áp > 180/110 mmHg, đến bệnh viện ngay",
          "Nếu có đau ngực, khó thở, đến cấp cứu",
          "Không tự ý ngừng thuốc khi thấy huyết áp bình thường",
        ],
      });

      setHealthMetrics([
        {
          id: 1,
          name: "Huyết áp",
          value: "145/92",
          unit: "mmHg",
          status: "high",
          normal_range: "< 130/80",
          measured_at: "2025-08-20 10:30",
        },
        {
          id: 2,
          name: "Nhịp tim",
          value: "78",
          unit: "bpm",
          status: "normal",
          normal_range: "60-100",
          measured_at: "2025-08-20 10:30",
        },
        {
          id: 3,
          name: "Cân nặng",
          value: "75.5",
          unit: "kg",
          status: "normal",
          normal_range: "Phụ thuộc chiều cao",
          measured_at: "2025-08-20 10:25",
        },
        {
          id: 4,
          name: "BMI",
          value: "24.8",
          unit: "",
          status: "normal",
          normal_range: "18.5-24.9",
          measured_at: "2025-08-20 10:25",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [appointmentId, doctorId, patientId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "high":
        return "text-red-600 bg-red-50";
      case "low":
        return "text-blue-600 bg-blue-50";
      case "normal":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "high":
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case "normal":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "low":
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">
          Chưa có lời khuyên sức khỏe cho cuộc hẹn này
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Doctor Info & Diagnosis */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{recommendation.doctorName}</h2>
              <p className="text-blue-100">{recommendation.specialty}</p>
              <div className="flex items-center mt-2 text-blue-100">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span className="text-sm">{recommendation.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chẩn đoán
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                {recommendation.diagnosis}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Kết quả khám
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {recommendation.content}
            </p>
          </div>

          {/* Health Metrics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Chỉ số sức khỏe
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {healthMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className={`rounded-lg p-4 border ${getStatusColor(
                    metric.status
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.name}</span>
                    {getStatusIcon(metric.status)}
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {metric.value}{" "}
                    <span className="text-sm font-normal">{metric.unit}</span>
                  </div>
                  <div className="text-xs opacity-75">
                    <div>Bình thường: {metric.normal_range}</div>
                    <div>Đo lúc: {metric.measured_at}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Lời khuyên
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="space-y-2">
                {recommendation.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <HeartSolid className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Medications */}
          {recommendation.medications && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Đơn thuốc
              </h3>
              <div className="space-y-3">
                {recommendation.medications.map((med, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800">
                        {med.name}
                      </h4>
                      <span className="text-sm text-green-600">
                        {med.duration}
                      </span>
                    </div>
                    <p className="text-green-700 mb-1">{med.dosage}</p>
                    <p className="text-sm text-green-600">{med.instructions}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {recommendation.warnings && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Cảnh báo quan trọng
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {recommendation.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-800">{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Follow-up */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              Lịch tái khám
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-700 font-medium">
                  {recommendation.followUp.date}
                </p>
                <p className="text-sm text-indigo-600">
                  {recommendation.followUp.note}
                </p>
              </div>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                Đặt lịch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowChatModal(true)}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
            <span>Hỏi bác sĩ</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors">
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Tải đơn thuốc</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors">
            <PhoneIcon className="w-5 h-5" />
            <span>Liên hệ khẩn cấp</span>
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <div className="bg-blue-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Chat với {recommendation.doctorName}
                </h3>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
              <div className="space-y-3">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm">
                    Xin chào! Tôi có thể giúp gì cho bạn về kết quả khám hôm
                    nay?
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Nhập câu hỏi..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AppointmentHealthRecommendation.propTypes = {
  appointmentId: PropTypes.string,
  doctorId: PropTypes.string,
  patientId: PropTypes.string,
};

export default AppointmentHealthRecommendation;
