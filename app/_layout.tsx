import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Ana hoşgeldin sayfası */}
      <Stack.Screen name="index" />
      
      {/* Auth grupları */}
      <Stack.Screen name="(auth)" />
      
      {/* Ana uygulama tabları */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}