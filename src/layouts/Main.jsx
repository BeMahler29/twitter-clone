import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function Main() {
  // Variables
  const { user } = useAuth();
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/signup") {
    return (
      <main>
        <div>
          <Outlet />
        </div>
      </main>
    );
  } else {
    return (
      <div className="grid grid-cols-[1fr_minmax(400px,1fr)_1fr] h-screen overflow-y-auto">
        {/* Header */}
        {user && (
          <aside className="border-r border-gray-300 p-4 block h-screen sticky top-0">
            <Header />
          </aside>
        )}

        {/* Children */}
        <main>
          <div className="max-w-[700px] mx-auto p-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        {user && (
          <footer className="border-l border-gray-300 p-4 block h-screen sticky top-0">
            <Footer />
          </footer>
        )}
      </div>
    );
  }
}
