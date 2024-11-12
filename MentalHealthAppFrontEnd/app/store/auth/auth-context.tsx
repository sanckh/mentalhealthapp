import React, {
  createContext,
  useReducer,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { getData, removeData, setData } from "../../utilities/storage-utility";
import { authReducer, AuthState, Action } from "./auth-reducer";

export interface AuthContextType extends AuthState {
  setIsAuthenticated: (
    isAuthenticated: boolean,
    token: string,
    uid: string
  ) => void;
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

  useEffect(() => {
    if (state.isAuthenticated) {
      setData("mhAuthState", JSON.stringify(state));
    } else {
      getData("mhAuthState");
    }
  }, [state]);

  useEffect(() => {
    const loadAuthState = async () => {
      const savedState = await getData("mhAuthState");
      if (savedState) {
        const parsedState: AuthState = JSON.parse(savedState);
        dispatch({ type: "Authetication", value: parsedState });
      }
    };
    loadAuthState();
  }, []);

  const setIsAuthenticated = (
    isAuthenticated: boolean,
    token: string,
    uid: string
  ) => {
    dispatch({ type: "Authetication", value: { isAuthenticated, token, uid } });
  };

  const removeAuth = async () => {
    await removeData("mhAuthState");
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
