import { getTokens, refreshAccessToken, clearTokens } from "./authTokens";
import { Alert } from "react-native";
import { router } from "expo-router";

export async function fetchWithToken(url: string, options: RequestInit = {}) {
  let { accessToken } = await getTokens();

  if (!accessToken) {
    await handleLogout();
    throw new Error("Kullanıcı giriş yapmamış");
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      response = await fetch(url, options);
    } catch (e) {
      await handleLogout();
      throw e;
    }
  }

  return response;
}

async function handleLogout() {
  await clearTokens();
  Alert.alert("Oturum Sonlandı", "Lütfen tekrar giriş yapınız.");
  router.replace("/login");
}
