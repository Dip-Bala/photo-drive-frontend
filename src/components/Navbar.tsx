import { useContext, useState } from "react";
import { UserContext, type UserContextType } from "../Hooks/userContext";
import api from "../lib/api";

type Props = {
  onSearch: (q: string) => void;
};

export default function Navbar({ onSearch }: Props) {
  const { setUser }: UserContextType = useContext(UserContext)!;
  const [query, setQuery] = useState("");

 async function handleLogout(){
    try{
      const res = await api.post('/api/auth/logout');
      setUser(false);
      console.log(res);
    }
    catch(e){'Error with Logout'}
  }
  return (
    <nav className="w-full flex items-center justify-between bg-white px-6 py-3 shadow">
      <h1 className="text-sm sm:text-xl font-semibold text-blue-500">Photo Drive</h1>
      <div className="flex-1 px-6">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="Search your photos..."
          className="w-full  max-w-md text-xs sm:text-base px-4 py-2 rounded-4xl border border-neutral-400 hover:border-2 focus:border-2 hover:border-neutral-600 text-neutral-700 bg-gray-50 focus:outline-0 focus:bg-white" 
        />
      </div>

      <button
        onClick={handleLogout}
        className="text-pink-500 cursor-pointer px-4 py-2 rounded-4xl shadow  hover:bg-pink-100"
      >
        Log out
      </button>
    </nav>
  );
}
