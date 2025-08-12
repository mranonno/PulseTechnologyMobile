import React, { createContext, useContext, useState, ReactNode } from "react";

// ===== Types =====
interface GlobalState {
  user: {
    id: string | null;
    name: string | null;
    role?: string;
  };
  loading: boolean;
  setUser: (user: GlobalState["user"]) => void;
  setLoading: (loading: boolean) => void;
}

const defaultState: GlobalState = {
  user: { id: null, name: null, role: undefined },
  loading: false,
  setUser: () => {},
  setLoading: () => {},
};

// ===== Create Context =====
const GlobalContext = createContext<GlobalState>(defaultState);

// ===== Provider =====
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<GlobalState["user"]>(defaultState.user);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <GlobalContext.Provider value={{ user, loading, setUser, setLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};

// ===== Hook for Using Context =====
export const useGlobalContext = () => useContext(GlobalContext);
