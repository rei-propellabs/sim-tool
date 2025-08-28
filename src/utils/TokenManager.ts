export const TOKEN_KEYS = {
  uploadAdmin: "uc_a_token",
  uploadClient: "uc_c_token",
};

export function setToken(type: keyof typeof TOKEN_KEYS, token: string) {
  localStorage.setItem(TOKEN_KEYS[type], token);
}

export function getToken(type: keyof typeof TOKEN_KEYS): string | null {
  return localStorage.getItem(TOKEN_KEYS[type]);
}

export function clearToken(type: keyof typeof TOKEN_KEYS) {
  localStorage.removeItem(TOKEN_KEYS[type]);
}