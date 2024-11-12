export interface AuthState {
  isAuthenticated: boolean;
  token: string;
  uid: string;
}

export type Action =
  | { type: "Signout" }
  | { type: "Authetication"; value: { isAuthenticated: boolean; token: string, uid: string } };


/**
 * Reducer function for authentication state management.
 *
 * @param state - The current authentication state.
 * @param action - The action to be processed.
 * @returns The new authentication state.
*/
export function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "Authetication":
      return {
        ...state,
        isAuthenticated: action.value.isAuthenticated,
        token: action.value.token,
        uid: action.value.uid,
      };
    case "Signout":
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
