import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useContext } from "react";
import { useAuth } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// lazy
const Main = lazy(() => import("./layouts/Main"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const TweetPage = lazy(() => import("./pages/TweetPage"));

export default function App() {
  // Context
  const { user } = useAuth();
  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <RouterProvider
        router={createBrowserRouter([
          {
            path: "/",
            element: (
              <Suspense>
                <Main />
              </Suspense>
            ),
            children: [
              // Si user, page Home sinon page Login
              {
                path: "/",
                index: true,
                element: (
                  <Suspense>
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  </Suspense>
                ),
              },
              //  Page Login
              {
                path: "/login",
                element: (
                  <Suspense>
                    <Login />
                  </Suspense>
                ),
              },
              //  Page Inscription
              {
                path: "/signup",
                element: (
                  <Suspense>
                    <Signup />
                  </Suspense>
                ),
              },
              // Page Profile
              {
                path: "/profile/:uid",
                element: (
                  <Suspense>
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </Suspense>
                ),
              },
              // Page Tweet
              {
                path: "/tweet/:tweetId",
                element: (
                  <Suspense>
                    <ProtectedRoute>
                      <TweetPage />
                    </ProtectedRoute>
                  </Suspense>
                ),
              },
            ],
          },
        ])}
      />
    </>
  );
}
