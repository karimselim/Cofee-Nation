export interface AppUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

export class AuthError extends Error {
  code: string;
  constructor(code: string, message = code) {
    super(message);
    this.code = code;
  }
}

export interface AuthService {
  /** Called with the signed-in, email-verified user, or null. */
  onChange(cb: (user: AppUser | null) => void): () => void;
  /** Creates the account and sends a verification email. Does not keep the user signed in. */
  signup(email: string, password: string): Promise<void>;
  /** Signs in. Throws AuthError("app/email-not-verified") for unverified accounts. */
  login(email: string, password: string): Promise<AppUser>;
  google(): Promise<AppUser>;
  logout(): Promise<void>;
  reset(email: string): Promise<void>;
  resendVerification(email: string, password: string): Promise<void>;
}
