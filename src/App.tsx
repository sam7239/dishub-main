import { Suspense, lazy, useEffect, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { subscribeToAuthChanges } from "@/lib/discordAuth";
import Layout from "@/components/layout/Layout";

const HomePage = lazy(() => import("./pages/home"));
const LoginPage = lazy(() => import("./pages/login"));
const AuthCallback = lazy(() => import("./pages/auth/callback"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const AdminPage = lazy(() => import("./pages/admin"));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated via Discord direct auth
    const discordUser = localStorage.getItem("discord_user");
    if (discordUser) {
      setIsAuthenticated(true);
    } else {
      // Fall back to Firebase auth
      const unsubscribe = subscribeToAuthChanges((user) => {
        setIsAuthenticated(!!user);
      });
      return () => unsubscribe();
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AuthProvider>
      <Layout isAuthenticated={isAuthenticated}>
        <Suspense
          fallback={
            <div className="h-screen w-full flex items-center justify-center bg-[#310f3e] from-[#330909]">
              Loading...
            </div>
          }
          className="bg-[#9e1a1a]"
        >
          {/* Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

          <Routes>
            <Route index element={<HomePage />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin"
              element={
                isAuthenticated ? (
                  <AdminPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* Add tempo route before catch-all */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  );
}

export default App;
