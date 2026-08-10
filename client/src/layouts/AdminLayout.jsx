import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineOfficeBuilding,
  HiOutlineTag,
  HiOutlineBriefcase,
  HiOutlineNewspaper,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineChatAlt2,
  HiOutlineMail,
  HiOutlinePhotograph,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMoon,
  HiOutlineSun,
  HiMenu,
  HiX,
} from "react-icons/hi";
import useAuth from "../hooks/useAuth.js";
import { ToastProvider } from "../contexts/ToastContext.jsx";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: HiOutlineViewGrid, end: true },
  { to: "/admin/projects", label: "Projects", icon: HiOutlineOfficeBuilding },
  { to: "/admin/categories", label: "Categories", icon: HiOutlineTag },
  { to: "/admin/services", label: "Services", icon: HiOutlineBriefcase },
  { to: "/admin/blogs", label: "Blogs", icon: HiOutlineNewspaper },
  { to: "/admin/team", label: "Team", icon: HiOutlineUsers },
  { to: "/admin/careers", label: "Careers", icon: HiOutlineUserGroup },
  { to: "/admin/applications", label: "Applications", icon: HiOutlineClipboardList },
  { to: "/admin/testimonials", label: "Testimonials", icon: HiOutlineChatAlt2 },
  { to: "/admin/inquiries", label: "Inquiries", icon: HiOutlineMail },
  { to: "/admin/gallery", label: "Gallery", icon: HiOutlinePhotograph },
  { to: "/admin/settings", label: "Settings", icon: HiOutlineCog },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("admin-theme") || "light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const toggleTheme = () => setTheme((current) => (current === "light" ? "dark" : "light"));

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-line flex items-center gap-3 dark:border-gray-800">
        <img src="/logo.png" alt="Khilung Kalika Construction" className="h-9 w-9" />
        <span className="font-body font-bold text-lg leading-tight">
          Khilung Kalika <span className="text-primary block font-body text-sm">Admin</span>
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary/15 text-secondary font-semibold"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`
            }
          >
            <Icon className="text-lg" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-line dark:border-gray-800">
        <div className="text-xs text-gray-500 mb-3 dark:text-gray-400">
          Signed in as <span className="font-semibold font-body text-ink dark:text-gray-100">{user?.name}</span> ({user?.role})
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary mb-3 dark:text-gray-300"
        >
          {theme === "light" ? <HiOutlineMoon /> : <HiOutlineSun />} {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary dark:text-gray-300"
        >
          <HiOutlineLogout /> Logout
        </button>
      </div>
    </>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-stone text-ink transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">
        {/* Desktop sidebar — always visible at lg+ */}
        <aside className="hidden lg:flex w-64 shrink-0 bg-paper/90 border-r border-line backdrop-blur-sm flex-col dark:bg-gray-900/90 dark:border-gray-800">
          {sidebarContent}
        </aside>

        {/* Mobile sidebar — slide-in drawer with backdrop */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="relative z-50 w-72 max-w-[80vw] bg-paper border-r border-line flex flex-col dark:bg-gray-900 dark:border-gray-800">
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="absolute top-4 right-4 text-2xl text-gray-500 dark:text-gray-400"
              >
                <HiX />
              </button>
              {sidebarContent}
            </aside>
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-line bg-paper/90 backdrop-blur-sm dark:bg-gray-900/90 dark:border-gray-800">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="text-2xl text-gray-700 dark:text-gray-300"
            >
              <HiMenu />
            </button>
            <span className="font-body font-bold">Khilung Kalika Admin</span>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-xl text-gray-700 dark:text-gray-300"
            >
              {theme === "light" ? <HiOutlineMoon /> : <HiOutlineSun />}
            </button>
          </div>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-stone/70 dark:bg-gray-950">
            <Outlet context={{ theme, toggleTheme }} />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default AdminLayout;
