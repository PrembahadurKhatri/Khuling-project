import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="section text-center py-32">
    <h1 className="text-6xl font-heading font-extrabold text-primary">404</h1>
    <p className="mt-4 text-xl text-secondary font-semibold">Page Not Found</p>
    <p className="mt-2 text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary mt-8 inline-flex">Back to Home</Link>
  </div>
);

export default NotFound;
