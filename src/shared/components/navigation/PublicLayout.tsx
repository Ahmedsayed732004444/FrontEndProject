import PublicHeader from "./PublicHeader";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

/**
 * PublicLayout - For public-facing pages
 * Used for: home, about, blog, contact, privacy, terms, help
 * Shows different navigation based on authentication status
 * Always shows full footer
 */
const PublicLayout = () => {
  return (
    <>
      <PublicHeader />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;

