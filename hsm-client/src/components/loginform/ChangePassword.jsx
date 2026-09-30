import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstanceUserService from "../../utils/axiosInstanceUserService";

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Extract email and code from URL parameters
    const email = searchParams.get("email");
    const code = searchParams.get("code");

    if (email && code) {
      setFormData((prev) => ({
        ...prev,
        email: email,
        code: code,
      }));
    } else {
      toast.error(
        "Invalid recovery link. Please request a new password reset."
      );
      navigate("/login");
    }
  }, [searchParams, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword,
      };

      await axiosInstanceUserService.post("/recovery/verify", requestData);
      toast.success(
        "Password changed successfully! Please login with your new password."
      );
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Reset Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
              value={formData.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="newPassword"
              className="block text-lg font-semibold text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-semibold text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              minLength={6}
              required
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full px-4 py-3 text-lg font-medium text-blue-600 bg-transparent border border-blue-600 rounded-lg shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
