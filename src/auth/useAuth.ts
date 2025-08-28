import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";

export type AuthPayload = { email: string; password: string };

export function useSignup() {
  return useMutation({
    mutationFn: (body: AuthPayload) =>
      api.post("/api/auth/signup", body).then((r) => r.data),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (body: AuthPayload) =>
      api.post("/api/auth/login", body).then((r) => r.data),
  });
}

export function useRefresh() {
  return useMutation({
    mutationFn: () => api.post("/api/auth/refresh").then((r) => r.data),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => api.post("/api/auth/logout").then((r) => r.data),
  });
}
