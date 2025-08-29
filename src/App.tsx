import { useState, useEffect} from "react";
import api from "./lib/api";
import { UserContext } from "./Hooks/userContext";
import AuthPage from "./pages/AuthPage";
import FileExplorer from "./pages/FileExplorer";

export default function App() {
  const [user, setUser] = useState<boolean | null>(null);
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

  return (
  <UserContext.Provider value={{ user, setUser }}>
      {user ? (
        <FileExplorer />
      ) : (
        <AuthPage />
      )}
  </UserContext.Provider>
  )
}
