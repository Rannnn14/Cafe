import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/lib/AuthContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function InitialLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const first = (segments?.[0] as string) ?? "";
    const inTabsGroup = first === "(tabs)";
    const inAuthGroup = first === "(auth)";

    // ✅ Route yang boleh diakses saat SUDAH login, walau bukan tabs
    const allowedAuthed = new Set([
      "(tabs)",
      "editProfil",
      "checkout",
      "orderHistory",
      "deliveryAddresses",
      "modal",
    ]);

    const inAllowedAuthedRoute = allowedAuthed.has(first);

    // ✅ Kalau sudah login tapi lagi di auth pages -> lempar ke tabs
    if (session && inAuthGroup) {
      router.replace("/(tabs)");
      return;
    }

    // ✅ Kalau sudah login, tapi masuk route aneh (bukan tabs & bukan allowed) -> lempar ke tabs
    if (session && !inAllowedAuthedRoute) {
      router.replace("/(tabs)");
      return;
    }

    // ✅ Kalau belum login dan bukan di auth -> lempar ke sign in
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/sign-in" as any);
      return;
    }
  }, [session, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Groups */}
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />

      {/* ✅ Screens di luar tabs yang kamu butuhin */}
      <Stack.Screen name="editProfil" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="orderHistory" />
      <Stack.Screen name="deliveryAddresses" />
      

      {/* modal */}
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <InitialLayout />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
