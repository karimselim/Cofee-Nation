import { AppUser, AuthError, AuthService } from "./types";

/**
 * Local stand-in for Firebase used only when the app is built with
 * REACT_APP_FAKE_AUTH=true (the Playwright tests). It follows the same rules:
 * unique emails, email verification before login, the same error codes.
 */
interface FakeUser {
  uid: string;
  password: string;
  verified: boolean;
}

const USERS = "cn:fake-users";
const SESSION = "cn:fake-session";
const listeners = new Set<(u: AppUser | null) => void>();

const readUsers = (): Record<string, FakeUser> =>
  JSON.parse(localStorage.getItem(USERS) || "{}");
const writeUsers = (u: Record<string, FakeUser>) =>
  localStorage.setItem(USERS, JSON.stringify(u));

const current = (): AppUser | null => {
  const email = localStorage.getItem(SESSION);
  if (!email) return null;
  const user = readUsers()[email];
  return user ? { uid: user.uid, email, emailVerified: user.verified } : null;
};

const emit = () => listeners.forEach((cb) => cb(current()));
const norm = (email: string) => email.trim().toLowerCase();

const checkEmail = (email: string) => {
  if (!email) throw new AuthError("auth/missing-email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthError("auth/invalid-email");
};

export const fakeAuth: AuthService = {
  onChange(cb) {
    listeners.add(cb);
    cb(current());
    return () => listeners.delete(cb);
  },

  async signup(rawEmail, password) {
    const email = norm(rawEmail);
    checkEmail(email);
    if (!password) throw new AuthError("auth/missing-password");
    if (password.length < 6) throw new AuthError("auth/weak-password");
    const users = readUsers();
    if (users[email]) throw new AuthError("auth/email-already-in-use");
    users[email] = { uid: `fake-${email.replace(/[^a-z0-9]/g, "")}`, password, verified: false };
    writeUsers(users);
  },

  async login(rawEmail, password) {
    const email = norm(rawEmail);
    checkEmail(email);
    if (!password) throw new AuthError("auth/missing-password");
    const user = readUsers()[email];
    if (!user || user.password !== password) throw new AuthError("auth/invalid-credential");
    if (!user.verified) throw new AuthError("app/email-not-verified");
    localStorage.setItem(SESSION, email);
    emit();
    return current() as AppUser;
  },

  async google() {
    const email = "google.user@example.com";
    const users = readUsers();
    users[email] = users[email] ?? { uid: "fake-google", password: "", verified: true };
    writeUsers(users);
    localStorage.setItem(SESSION, email);
    emit();
    return current() as AppUser;
  },

  async logout() {
    localStorage.removeItem(SESSION);
    emit();
  },

  async reset(rawEmail) {
    const email = norm(rawEmail);
    checkEmail(email);
    if (!readUsers()[email]) throw new AuthError("auth/user-not-found");
  },

  async resendVerification(rawEmail, password) {
    const email = norm(rawEmail);
    const user = readUsers()[email];
    if (!user || user.password !== password) throw new AuthError("auth/invalid-credential");
  },
};

// Test hook: lets a test act as "the user clicked the link in the email".
declare global {
  interface Window {
    __verifyFakeEmail?: (email: string) => void;
  }
}
window.__verifyFakeEmail = (rawEmail: string) => {
  const users = readUsers();
  const email = norm(rawEmail);
  if (users[email]) users[email].verified = true;
  writeUsers(users);
};
