import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axiosInstanceAnalyticResearchService from "../../utils/axiosInstanceAnalyticResearchService";
import {
  FaUserGraduate,
  FaUniversity,
  FaEnvelope,
  FaUser,
  FaClipboardList,
  FaHeartbeat,
} from "react-icons/fa";

const ResearcherRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    institute: "",
    purpose: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstanceAnalyticResearchService.post("/register", formData);
      toast.success(
        "Research application submitted successfully! Admin will review your request."
      );
      navigate("/login");
    } catch (error) {
      console.error("Error submitting research application:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error submitting application. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <FaHeartbeat className="text-4xl text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              HMS Research Portal
            </h1>
          </div>
          <h2 className="text-xl text-gray-600">
            Apply for Health Data Access
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Submit your research proposal to access anonymized health data for
            research purposes
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white shadow-2xl rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUserGraduate className="inline mr-2" />
                Designation/Title *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="e.g., Research Scientist, PhD Student, Professor"
                required
              />
            </div>

            {/* Institute */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUniversity className="inline mr-2" />
                Institution/Organization *
              </label>
              <input
                type="text"
                name="institute"
                value={formData.institute}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your institution or organization name"
                required
              />
            </div>

            {/* Research Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClipboardList className="inline mr-2" />
                Research Purpose & Methodology *
              </label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                rows="6"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Please describe your research objectives, methodology, expected outcomes, and how the health data will be used. Include details about data security measures and ethical considerations."
                required
              />
            </div>

            {/* Terms & Conditions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Data Usage Agreement
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • All data provided will be anonymized and de-identified
                </li>
                <li>
                  • Data must be used solely for the stated research purpose
                </li>
                <li>
                  • Data cannot be shared with third parties without prior
                  approval
                </li>
                <li>
                  • Research findings must acknowledge HMS as the data source
                </li>
                <li>
                  • Data must be securely deleted after research completion
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Application...
                  </div>
                ) : (
                  "Submit Research Application"
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                >
                  Already have access? Login here
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            By submitting this application, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Research Data Usage Terms
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResearcherRegistration;
