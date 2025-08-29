import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

type AuthProps = { mode: "login" | "signup"; onSuccess?: () => void };

export default function AuthForm({onSuccess }: AuthProps) {
  const [mode, setMode] = useState<"signup" | "login">("login");
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    setServerError("");
    try {
      const url = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      await api.post(url, values);
      onSuccess?.();
    } catch (e: any) {
      setServerError(e?.response?.data || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-xs md:w-sm p-8 flex flex-col gap-2  rounded">
      <h2 className="font-semibold text-xl pb-4">{mode === "signup" ? "Sign Up" : "Log In"}</h2>
      <input {...register("email")} type="email" placeholder="Email" className="border border-gray-400 p-2 rounded-md focus:outline-blue-500 mb-4" />
      {errors.email && <span className="text-red-400">{errors.email.message}</span>}

      <input {...register("password")} type="password" placeholder="Password" className="border border-gray-400 p-2 rounded-md focus:outline-blue-500 mb-4" />
      {errors.password && <span className="text-red-400">{errors.password.message}</span>}

      <button disabled={isSubmitting} className="bg-gradient-to-r from-blue-400 via-slate-600 to-slate-500 text-white p-2 rounded cursor-pointer my-4">
        {isSubmitting ? "Loading..." : mode === "signup" ? "Sign Up" : "Log In"}
      </button>

      {serverError && <span className="text-red-500">{serverError}</span>}

      <div className="border-t border-dashed text-neutral-500 py-2">
        {mode === 'login' ? <p>Create a new account. <span onClick={() => setMode('signup')} className="cursor-pointer underline font-medium">Sign up</span></p> : <p>Already Signed up? <span onClick={() => setMode('login')} className="cursor-pointer underline font-semibold">Log in</span></p>}
      </div>
    </form>
  );
}
