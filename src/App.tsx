import { useState, useEffect } from "react";
import AuthForm from "./auth/AuthForm";
import api from "./lib/api";
import Dashboard from "./pages/Dashboard";


export default function App() {
  const [user, setUser] = useState<boolean | null>(null);
  const [mode, setMode] = useState<"signup" | "login">("signup");

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.post("/api/auth/refresh");
        setUser(true);
      } catch {
        setUser(false);
      }
    }
    checkAuth();
  }, []);

  if (user === null) return <p>Loading...</p>;

  return user ? <Dashboard /> : <AuthForm mode={mode} onSuccess={() => setUser(true)} />;
}
