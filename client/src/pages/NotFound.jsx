import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-stone relative">
    <Seo title="Page Not Found" noindex />
    <div className="absolute inset-0 bg-hero-pattern opacity-40 pointer-events-none" />
    <div className="relative">
      <p className="eyebrow mb-4">Error</p>
      <h1 className="font-body text-8xl md:text-9xl text-navy/10 font-bold">404</h1>
      <h2 className="font-body text-2xl md:text-3xl text-navy -mt-6 mb-3">Page Not Found</h2>
      <p className="text-navy/60 max-w-md leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-fill mt-8 inline-flex">Back to Home</Link>
    </div>
  </div>
);

export default NotFound;
