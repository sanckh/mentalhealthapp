import React, {
  createContext,
  useReducer,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getData, removeData, setData } from "../../utilities/storage-utility";
import { authReducer, AuthState, Action } from "./auth-reducer";
import { getCurrentUser } from "@/api/auth";

export interface AuthContextType extends AuthState {
  setIsAuthenticated: (
    isAuthenticated: boolean,
    token: string,
    uid: string
  ) => Promise<void>;
  removeAuth: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: "",
  uid: "",
  isLoading: false,
  setIsAuthenticated: async () => {},
  removeAuth: async () => {},
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const savedState = await getData("mhAuthState");
        if (!savedState) return;

        const parsedState: AuthState = JSON.parse(savedState);
        if (!parsedState.isAuthenticated || !parsedState.uid) {
          await removeData("mhAuthState");
          return;
        }

        setIsLoading(true);
        try {
          const userData = await getCurrentUser();
          if (userData?.uid === parsedState.uid) {
            dispatch({ type: "Authetication", value: parsedState });
          } else {
            await removeData("mhAuthState");
            dispatch({ type: "Signout" });
          }
        } catch (error) {
          console.error("Error verifying user data:", error);
          await removeData("mhAuthState");
          dispatch({ type: "Signout" });
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        setIsLoading(false);
      }
    };
    loadAuthState();
  }, []);

  useEffect(() => {
    if (state.isAuthenticated) {
      setData("mhAuthState", JSON.stringify(state));
    }
  }, [state]);

  const setIsAuthenticated = async (
    isAuthenticated: boolean,
    token: string,
    uid: string
  ) => {
    if (!isAuthenticated) {
      dispatch({ type: "Signout" });
      return;
    }

    setIsLoading(true);
    try {
      const userData = await getCurrentUser();
      if (userData?.uid === uid) {
        dispatch({ type: "Authetication", value: { isAuthenticated, token, uid } });
      } else {
        throw new Error("User data verification failed");
      }
    } catch (error) {
      console.error("Error verifying user data:", error);
      await removeData("mhAuthState");
      dispatch({ type: "Signout" });
    } finally {
      setIsLoading(false);
    }
  };

  const removeAuth = async () => {
    await removeData("mhAuthState");
    dispatch({ type: "Signout" });
  };

  const ctxValue: AuthContextType = {
    ...state,
    setIsAuthenticated,
    removeAuth,
    isLoading,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
