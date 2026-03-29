import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Reset standard window scroll (for default pages like Home, Login, About)
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    // 2. Reset custom dashboard container scroll (for logged-in nested sub-pages)
    const dashboardContainer = document.getElementById("dashboard-scroll-container");
    if (dashboardContainer) {
      dashboardContainer.scrollTo({
        top: 0,
        behavior: "instant"
      });
    }
  }, [pathname]);

  return null;
}
