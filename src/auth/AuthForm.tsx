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

type Props = { mode: "login" | "signup"; onSuccess?: () => void };

export default function AuthForm({ mode, onSuccess }: Props) {
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-sm p-4 flex flex-col gap-2 border rounded">
      <h2>{mode === "signup" ? "Sign Up" : "Log In"}</h2>
      <input {...register("email")} type="email" placeholder="Email" className="border p-2 rounded" />
      {errors.email && <span className="text-red-500">{errors.email.message}</span>}

      <input {...register("password")} type="password" placeholder="Password" className="border p-2 rounded" />
      {errors.password && <span className="text-red-500">{errors.password.message}</span>}

      <button disabled={isSubmitting} className="bg-slate-800 text-white p-2 rounded">
        {isSubmitting ? "Loading..." : mode === "signup" ? "Sign Up" : "Log In"}
      </button>

      {serverError && <span className="text-red-500">{serverError}</span>}
    </form>
  );
}
