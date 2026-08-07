import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import useAuth from "../../hooks/useAuth.js";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("admin-theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "light" ? "dark" : "light"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors ${theme === "dark" ? "bg-gray-950 text-gray-100" : "bg-stone text-ink"}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className={`absolute top-4 right-4 flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${theme === "dark" ? "border-gray-700 bg-gray-900 text-gray-100" : "border-line bg-paper text-ink"}`}
      >
        {theme === "light" ? <HiOutlineMoon /> : <HiOutlineSun />} {theme === "light" ? "Dark mode" : "Light mode"}
      </button>

      <form onSubmit={handleSubmit} className={`w-full max-w-md rounded-2xl border p-8 shadow-xl ${theme === "dark" ? "border-gray-800 bg-gray-900" : "border-line bg-paper"}`}>
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Khilung Kalika Construction" className="h-16 w-16 mb-3" />
          <h1 className="text-2xl font-body font-bold text-secondary">Admin Login</h1>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Khilung Kalika Construction Dashboard</p>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <label className={`mb-1 block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`mb-4 w-full rounded-lg border px-3 py-2 ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-100" : "border-line bg-paper text-ink"}`}
        />

        <label className={`mb-1 block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={`mb-6 w-full rounded-lg border px-3 py-2 ${theme === "dark" ? "border-gray-700 bg-gray-800 text-gray-100" : "border-line bg-paper text-ink"}`}
        />

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
