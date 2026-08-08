import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../services/authService.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const theme = localStorage.getItem("admin-theme") || "light";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, form.password);
      setDone(true);
      setTimeout(() => navigate("/admin/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors ${theme === "dark" ? "bg-gray-950 text-gray-100" : "bg-stone text-ink"}`}>
      <div className={`w-full max-w-md rounded-2xl border p-8 shadow-xl ${theme === "dark" ? "border-gray-800 bg-gray-900" : "border-line bg-paper"}`}>
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Khilung Kalika Construction" className="h-16 w-16 mb-3" />
          <h1 className="text-2xl font-body font-bold text-secondary">Reset Password</h1>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Choose a new password below.</p>
        </div>

        {done ? (
          <p className={`rounded-lg px-4 py-3 text-center text-sm ${theme === "dark" ? "bg-emerald-950/40 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
            Password reset successfully. Redirecting you to login...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <label className={`mb-1 block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`mb-4 w-full rounded-lg border px-3 py-2 ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-100" : "border-line bg-paper text-ink"}`}
            />

            <label className={`mb-1 block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={`mb-6 w-full rounded-lg border px-3 py-2 ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-100" : "border-line bg-paper text-ink"}`}
            />

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
