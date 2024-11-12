export interface AuthState {
  isAuthenticated: boolean;
  uid: string;
}

export type Action =
  | { type: "Signout" }
  | { type: "Authenticated"; value: { isAuthenticated: boolean; uid: string } };

/**
 * Reducer function for handling authentication state.
 * @param state - The current authentication state.
 * @param action - The action object that describes the state change.
 * @returns The new authentication state.
 */
export function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "Authenticated":
      return {
        ...state,
        isAuthenticated: action.value.isAuthenticated,
        uid: action.value.uid,
      };
    case "Signout":
      return {
        ...state,
        isAuthenticated: false,
        uid: "",
      };
    default:
      return state;
  }
}
