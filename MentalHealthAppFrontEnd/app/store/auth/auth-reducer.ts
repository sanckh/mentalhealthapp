export interface AuthState {
  isAuthenticated: boolean;
  token: string;
  uid: string;
}

export type Action =
  | { type: "Signout" }
  | { type: "Authenticated"; value: { isAuthenticated: boolean; token: string, uid: string } };

/**
 * Reducer function for handling authentication state.
 * @param state - The current authentication state.
 * @param action - The action object that describes the state change.
 * @returns The new authentication state.
 */
export function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "Authenticated":
      localStorage.setItem(
        "mhAuthState",
        JSON.stringify({
          isAuthenticated: action.value.isAuthenticated,
          token: action.value.token,
          uid: action.value.uid,
        })
      );
      return {
        ...state,
        isAuthenticated: action.value.isAuthenticated,
        token: action.value.token,
        uid: action.value.uid,
      };
    case "Signout":
      localStorage.removeItem("mhAuthState");
      return {
        ...state,
        isAuthenticated: false,
        token: "",
        uid: "",
      };
    default:
      return state;
  }
}
