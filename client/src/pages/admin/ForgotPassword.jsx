import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService.js";
import Seo from "../../components/Seo.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = localStorage.getItem("admin-theme") || "light";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors ${theme === "dark" ? "bg-gray-950 text-gray-100" : "bg-stone text-ink"}`}>
      <Seo title="Forgot Password" noindex />
      <div className={`w-full max-w-md rounded-2xl border p-8 shadow-xl ${theme === "dark" ? "border-gray-800 bg-gray-900" : "border-line bg-paper"}`}>
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Khilung Kalika Construction" className="h-16 w-16 mb-3" />
          <h1 className="text-2xl font-body font-bold text-secondary">Forgot Password</h1>
          <p className={`text-sm text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            Enter your admin email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className={`mb-6 rounded-lg px-4 py-3 text-sm ${theme === "dark" ? "bg-emerald-950/40 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
              If that email exists, a reset link has been sent. Check your inbox — the link expires in 15 minutes.
            </p>
            <Link to="/admin/login" className="btn-primary w-full justify-center">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <label className={`mb-1 block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mb-6 w-full rounded-lg border px-3 py-2 ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-100" : "border-line bg-paper text-ink"}`}
            />

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <Link
              to="/admin/login"
              className={`mt-4 block text-center text-sm hover:underline ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
