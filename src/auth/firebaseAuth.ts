import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { AppUser, AuthError, AuthService } from "./types";

const toAppUser = (user: User): AppUser => ({
  uid: user.uid,
  email: user.email,
  emailVerified: user.emailVerified,
});

export const firebaseAuth: AuthService = {
  onChange(cb) {
    return onAuthStateChanged(auth, (user) => {
      // Accounts that have not verified their email are treated as signed out.
      cb(user && user.emailVerified ? toAppUser(user) : null);
    });
  },

  async signup(email, password) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(user);
    await signOut(auth);
  },

  async login(email, password) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (!user.emailVerified) {
      await signOut(auth);
      throw new AuthError("app/email-not-verified");
    }
    return toAppUser(user);
  },

  async google() {
    const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
    return toAppUser(user);
  },

  async logout() {
    await signOut(auth);
  },

  async reset(email) {
    await sendPasswordResetEmail(auth, email);
  },

  async resendVerification(email, password) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    try {
      if (!user.emailVerified) await sendEmailVerification(user);
    } finally {
      await signOut(auth);
    }
  },
};
