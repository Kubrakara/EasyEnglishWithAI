import { getTokens } from "@/utils/authTokens";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "@/theme";

export default function AppEntry() {
  const router = useRouter();

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        const { accessToken } = await getTokens();
        if (accessToken) {
          // User has a token, go to the main app
          router.replace("/(tabs)/home");
        } else {
          // User has no token, go to login
          router.replace("/(auth)/login");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        // In case of error, still go to login
        router.replace("/(auth)/login");
      }
    };

    checkTokenAndRedirect();
  }, []);

  // Show a loading indicator while the check is in progress
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}