import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import Gallery from "./pages/Gallery.jsx";
import Team from "./pages/Team.jsx";
import Careers from "./pages/Careers.jsx";
import CareerDetail from "./pages/CareerDetail.jsx";
import GeneralApplication from "./pages/GeneralApplication.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

import Login from "./pages/admin/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProjectsManage from "./pages/admin/ProjectsManage.jsx";
import CategoriesManage from "./pages/admin/CategoriesManage.jsx";
import ServicesManage from "./pages/admin/ServicesManage.jsx";
import BlogsManage from "./pages/admin/BlogsManage.jsx";
import CareersManage from "./pages/admin/CareersManage.jsx";
import ApplicationsManage from "./pages/admin/ApplicationsManage.jsx";
import TestimonialsManage from "./pages/admin/TestimonialsManage.jsx";
import GalleryManage from "./pages/admin/GalleryManage.jsx";
import TeamManage from "./pages/admin/TeamManage.jsx";
import SettingsManage from "./pages/admin/SettingsManage.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/team" element={<Team />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/general" element={<GeneralApplication />} />
          <Route path="/careers/:slug" element={<CareerDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsManage />} />
          <Route path="categories" element={<CategoriesManage />} />
          <Route path="services" element={<ServicesManage />} />
          <Route path="blogs" element={<BlogsManage />} />
          <Route path="careers" element={<CareersManage />} />
          <Route path="applications" element={<ApplicationsManage />} />
          <Route path="testimonials" element={<TestimonialsManage />} />
          <Route path="gallery" element={<GalleryManage />} />
          <Route path="team" element={<TeamManage />} />
          <Route path="settings" element={<SettingsManage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
