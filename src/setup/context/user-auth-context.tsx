import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { AppUser, AuthService } from "../../auth/types";
import { firebaseAuth } from "../../auth/firebaseAuth";
import { fakeAuth } from "../../auth/fakeAuth";

const service: AuthService =
  process.env.REACT_APP_FAKE_AUTH === "true" ? fakeAuth : firebaseAuth;

interface UserAuthContextValue {
  /** The signed-in user with a verified email, or null. */
  user: AppUser | null;
  /** False until the first auth state is known (avoids flashing logged-out pages). */
  ready: boolean;
  signup: AuthService["signup"];
  login: AuthService["login"];
  logOut: () => Promise<void>;
  signinWithGoogle: AuthService["google"];
  resetPassword: AuthService["reset"];
  resendVerification: AuthService["resendVerification"];
}

const userAuthContext = createContext<UserAuthContextValue | null>(null);

export const UserAuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(
    () =>
      service.onChange((u) => {
        setUser(u);
        setReady(true);
      }),
    []
  );

  const value: UserAuthContextValue = {
    user,
    ready,
    signup: service.signup,
    login: service.login,
    logOut: service.logout,
    signinWithGoogle: service.google,
    resetPassword: service.reset,
    resendVerification: service.resendVerification,
  };

  return <userAuthContext.Provider value={value}>{children}</userAuthContext.Provider>;
};

export const useUserAuth = (): UserAuthContextValue => {
  const ctx = useContext(userAuthContext);
  if (!ctx) {
    throw new Error("useUserAuth must be used inside UserAuthContextProvider");
  }
  return ctx;
};
