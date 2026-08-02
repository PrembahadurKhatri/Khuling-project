import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on navigation like a traditional
// multi-page site does — without this, navigating away while scrolled down
// (e.g. picking a link from the mobile menu) leaves the viewport stuck at the
// same pixel offset on the new page, which reads as the app being unresponsive.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
