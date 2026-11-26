export interface DescribedError {
  field: "email" | "password" | "form";
  message: string;
}

/** Turns Firebase (and app) error codes into messages that say what went wrong. */
export function describeAuthError(error: unknown): DescribedError {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/invalid-email":
      return { field: "email", message: "That email address isn't valid. Check it for typos." };
    case "auth/missing-email":
      return { field: "email", message: "Please enter your email address." };
    case "auth/missing-password":
      return { field: "password", message: "Please enter your password." };
    case "auth/weak-password":
      return { field: "password", message: "That password is too weak. Use at least 8 characters with letters and numbers." };
    case "auth/email-already-in-use":
      return { field: "email", message: "An account with this email already exists. Log in instead, or use \"Forgot password\"." };
    case "auth/user-not-found":
      return { field: "email", message: "We couldn't find an account with this email. Check the address or sign up." };
    case "auth/wrong-password":
      return { field: "password", message: "That password is wrong. Try again or use \"Forgot password\"." };
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return { field: "form", message: "The email or password is incorrect. If you don't have an account yet, sign up first." };
    case "auth/user-disabled":
      return { field: "form", message: "This account has been disabled. Contact support to get it back." };
    case "auth/too-many-requests":
      return { field: "form", message: "Too many attempts. Wait a few minutes and try again, or reset your password." };
    case "auth/network-request-failed":
      return { field: "form", message: "Can't reach the server. Check your internet connection and try again." };
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return { field: "form", message: "The Google window was closed before finishing. Try again and complete the sign-in." };
    case "auth/popup-blocked":
      return { field: "form", message: "Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again." };
    case "auth/unauthorized-domain":
      return { field: "form", message: "Google sign-in isn't enabled for this website address yet. Use email and password for now." };
    case "auth/operation-not-allowed":
      return { field: "form", message: "This sign-in method isn't enabled for the shop yet." };
    case "app/email-not-verified":
      return { field: "form", message: "Please verify your email first. We sent you a link, check your inbox and spam folder." };
    default:
      return { field: "form", message: "Something went wrong. Please try again in a moment." };
  }
}
