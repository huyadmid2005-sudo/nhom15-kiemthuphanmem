import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstanceUserService from "../../utils/axiosInstanceUserService";
import PropTypes from "prop-types";

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstanceUserService.post(`/recovery/${email}`);
      toast.success(
        "Password recovery email sent successfully! Please check your email."
      );
      setEmail("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send recovery email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
        Forgot Password
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label
            htmlFor="email"
            className="block text-lg font-semibold text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Recovery Email"}
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full px-4 py-3 text-lg font-medium text-blue-600 bg-transparent border border-blue-600 rounded-lg shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

ForgotPassword.propTypes = {
  onBackToLogin: PropTypes.func.isRequired,
};

export default ForgotPassword;
