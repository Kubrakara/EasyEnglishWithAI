import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./apiConfig";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getTokens() {
  const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  return { accessToken, refreshToken };
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function refreshAccessToken() {
  const { refreshToken } = await getTokens();
  if (!refreshToken) throw new Error("Refresh token bulunamadı");

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Refresh token geçersiz");
    }

    const data = await response.json();
    
    // Eğer yeni refresh token gelirse onu da kaydet
    if (data.refreshToken) {
      await saveTokens(data.accessToken, data.refreshToken);
    } else {
      // Sadece access token güncelle
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.accessToken);
    }
    
    return data.accessToken;
  } catch (error) {
    console.error("Token yenileme hatası:", error);
    throw error;
  }
}
