import { useContext } from "react";
import AuthForm from "../auth/AuthForm";
import { UserContext, type UserContextType } from "../Hooks/userContext";

export default function AuthPage() {
  const { setUser }: UserContextType = useContext(UserContext)!;

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row">
      <div className="relative flex-2/5 md:h-full">
        <img
          src="/assets/bg-blob.svg"
          alt="Auth visual"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-2/5 flex md:h-full absolute md:static inset-0 flex-col p-8 gap-10">
      <h1 className="bg-gradient-to-r from-blue-400 via-slate-600 to-slate-500 text-transparent bg-clip-text text-2xl font-bold">Photo Drive</h1>
        <div className="flex items-center justify-center h-full">
        <div className="w-full bg-white/80 backdrop-blur-md rounded-xl justify-center flex">
          <AuthForm mode="login" onSuccess={() => setUser(true)} />
        </div>
      </div>
      </div>
    </div>
  );
}
