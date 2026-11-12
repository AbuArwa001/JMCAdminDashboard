import Cookies from "js-cookie";

export function storeAuthToken(token: string) {
  Cookies.set("firebaseToken", token, {
    expires: 1,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  localStorage.setItem("firebaseToken", token);
}

export function clearAuthStorage() {
  Cookies.remove("firebaseToken");
  localStorage.removeItem("firebaseToken");
  localStorage.removeItem("firebaseUser");
}

