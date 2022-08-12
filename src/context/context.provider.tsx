import { useAuthState } from "react-firebase-hooks/auth";
import { createContext, useContext } from "react";

import { auth, logOut } from "../../firebase-config";

interface props {
  children: JSX.Element | JSX.Element[];
}

export const AppContext = createContext({});

export const UseContext = () => {
  const context = useContext(AppContext);
  return context;
};

export const LogOut = () => {
  logOut();
};

export const AppProvider = ({ children }: props) => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <AppContext.Provider value={{ user, loading, error }}>
      {children}
    </AppContext.Provider>
  );
};
