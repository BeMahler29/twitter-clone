import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Logo/Logo";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Header() {
  // Variables
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  //   State
  const [isOpen, setIsOpen] = useState(false);

  // Fonction
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      toast.error("Erreur: " + error.message);
    }
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="flex flex-col items-end gap-6 justify-between h-full pr-6">
      <div>
        <Link to="/">
          <Logo />
        </Link>

        {/* Home */}
        <Link to="/">
          <svg viewBox="0 0 24 24" className="mt-6">
            <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path>
          </svg>
          <span>Accueil</span>
        </Link>

        {/* Profile */}
        <Link to={`/profile/${user.uid}`}>
          <svg viewBox="0 0 24 24" className="mt-6">
            <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
          </svg>
          <span>Profile</span>
        </Link>
      </div>

      {/* Button user */}
      {user && (
        <div className="relative">
          {isOpen && (
            <div className="absolute left-0 bottom-20 mt-2 w-35 text-center bg-white border border-gray-200 rounded shadow-md z-50">
              <button
                onClick={handleLogout}
                className="w-full py-1 rounded hover:bg-gray-200 transition cursor-pointer"
              >
                Se déconnecter
              </button>
            </div>
          )}
          <button
            onClick={toggleDropdown}
            className="w-15 h-15 rounded-full bg-amber-600 text-white text-xl hover:bg-amber-700 cursor-pointer"
          >
            {user.displayName?.charAt(0).toUpperCase() || "?"}
          </button>
        </div>
      )}
    </nav>
  );
}
