import { createContext } from "react";

export type UserContextType = {
  user: boolean | null;
  setUser: (user: boolean | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);