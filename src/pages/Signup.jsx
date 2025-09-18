import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../components/Logo/Logo";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function Signup() {
  // Variables
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, user, loading } = useAuth();
  const navigate = useNavigate();

  // Cycle

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  // Fonction
  const onSubmit = async ({ email, password, displayName }) => {
    try {
      await signup(email, password, displayName);
      toast.success("Compte crée !");
    } catch (error) {
      toast.error("Erreur: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="flex justify-center">
          <Logo />
        </div>

        <h2 className="text-2xl my-4 text-center">Créer votre compte</h2>

        <label className="block mb-2">
          <span>Pseudo</span>
          <input
            type="text"
            className="input"
            {...register("displayName", {
              required: true,
            })}
          />
          {errors.displayName && (
            <p className="text-red-400 mb-10">{errors.email.message}</p>
          )}
        </label>

        <label className="block mb-2">
          <span>Email</span>
          <input
            type="email"
            className="input"
            {...register("email", {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Veuillez entrer un email valide.",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-400 mb-10">{errors.email.message}</p>
          )}
        </label>

        <label className="block mb-4">
          <span>Mot de passe</span>
          <input
            type="password"
            className="input"
            {...register("password", {
              required: true,
              minLength: {
                value: 8,
                message:
                  "Votre mot de passe doit contenir au moins 8 caractères.",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-400 mb-10">{errors.password.message}</p>
          )}
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white cursor-pointer my-3 py-1 rounded-2xl font-semibold"
        >
          S'inscrire
        </button>

        <div className="flex justify-center font-light mt-10">
          <span>Vous avez déjà un compte ? </span>
          <Link to="/login">
            <button className="cursor-pointer text-blue-500 ml-2">
              Connectez-vous
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
