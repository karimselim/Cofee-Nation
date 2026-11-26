import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebase-config";

interface UserAuthContextValue {
  user: User | null;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  signinWithGoogle: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
}

const userAuthContext = createContext<UserAuthContextValue | null>(null);

export const UserAuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    return signOut(auth);
  };

  const signinWithGoogle = () => {
    const googleauthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleauthProvider);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{ user, signup, login, logOut, signinWithGoogle, resetPassword }}
    >
      {children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = (): UserAuthContextValue => {
  const ctx = useContext(userAuthContext);
  if (!ctx) {
    throw new Error("useUserAuth must be used inside UserAuthContextProvider");
  }
  return ctx;
};
