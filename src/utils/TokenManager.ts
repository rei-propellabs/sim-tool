import { jwtDecode } from "jwt-decode";

export const TOKEN_KEYS = {
  uploadAdmin: "uc_a_token",
  uploadClient: "uc_c_token",
};

export function setToken(type: keyof typeof TOKEN_KEYS, token: string) {
  if (type === "uploadAdmin") {
    localStorage.setItem("uc_a_token", token);
  } else {
    const key = getKeyFromToken(token);
    if (key !== null) {
      localStorage.setItem(key, token);
      saveLastUsedUser(token);
    }
  }
}

export function getTokenByOrgAndUser(type: keyof typeof TOKEN_KEYS, token: string): string | null {
  if (type === "uploadAdmin") {
    return localStorage.getItem("uc_a_token");
  } else {
    const key = getKeyFromToken(token);
    if (key !== null) {
      return localStorage.getItem(key);
    }
  }
  return null;
}

export function saveLastUsedUser(token: string) {
  const key = getKeyFromToken(token);
  if (key !== null) {
    localStorage.setItem('last_uc_c', key);
  }
}

export function getToken(type: keyof typeof TOKEN_KEYS): string | null {
  switch (type) {
    case "uploadAdmin":
      return localStorage.getItem('uc_a_token');
    case "uploadClient":
      const key = localStorage.getItem('last_uc_c');
      if (key !== null) {
        return localStorage.getItem(key);
      }
      return null;
    default:
      return null;
  }
}

export function clearClientToken(token: string | null) {
  // localStorage.removeItem('last_uc_c');

  if (token !== null) {
    const lastUsed = localStorage.getItem('last_uc_c');

    if (lastUsed !== null) {
      localStorage.removeItem(lastUsed);
    }
  }
}

function getKeyFromToken(token: string): string | null {
  try {
    const decoded: any = jwtDecode(token);
    const organizationId = decoded.organizationId;
    const userId = decoded.userId;
    return `${TOKEN_KEYS.uploadClient}_${organizationId}_${userId}`;
  } catch (error) {
    return null;
  }
}

export function clearAdminToken() {
  localStorage.removeItem('uc_a_token');
}