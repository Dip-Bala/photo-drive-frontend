import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import {type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormFields = z.infer<typeof schema>;

const Auth = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/signup',
        data
      , {withCredentials: true})
      console.log(res);
    } catch (error) {
      console.log(error)
      setError("root", {
        message: "error axios",
      });
    }
  };

  return (
    <form className="w-sm h-md rounded-xl shadow-md flex flex-col gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} type="text" placeholder="Email" className="border-2 border-gray-500 p-2 rounded-lg focus:outline-slate-700"/> 
      {errors.email && (
        <div className="text-red-400">{errors.email.message}</div>
      )}
      <input {...register("password")} type="password" placeholder="Password" 
      className="border-2 border-gray-500 p-2 rounded-lg focus:outline-slate-700"/>
      {errors.password && (
        <div className="text-red-400">{errors.password.message}</div>
      )}
      <button disabled={isSubmitting} type="submit" 
      className="bg-gradient-to-r from-gray-700 via-slate-700 to-slate-900 p-2 rounded-lg focus:outline-slate-700 text-white cursor-pointer">
        {isSubmitting ? "Loading..." : "Submit"}
      </button>
      {errors.root && <div className="text-red-500">{errors.root.message}</div>}
    </form>
  );
};

export default Auth;