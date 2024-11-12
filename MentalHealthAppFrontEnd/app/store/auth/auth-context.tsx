import React, { createContext, useReducer, ReactNode, useContext } from "react";
import { authReducer, AuthState, Action } from "./auth-reducer";

export interface AuthContextType extends AuthState {
  setIsAuthenticated: (isAuthenticated: boolean, token: string, uid: string) => void;
  removeAuth: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: "",
  uid: "",
  setIsAuthenticated: () => {},
  removeAuth: () => {},
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer<React.Reducer<AuthState, Action>>(
    authReducer,
    {
      isAuthenticated: false,
      token: "",
      uid: "",
    }
  );

  const setIsAuthenticated = (isAuthenticated: boolean,token: string, uid: string) => {
    dispatch({ type: "Authenticated", value: { isAuthenticated, token, uid } });
  };

  const removeAuth = () => {
    dispatch({ type: "Signout" });
  };

  const ctxValue: AuthContextType = {
    ...state,
    setIsAuthenticated,
    removeAuth,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
