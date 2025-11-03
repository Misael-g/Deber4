import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import "react-native-reanimated";
import { container } from "../src/di/container";
import { useAuth } from "../src/presentation/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [containerReady, setContainerReady] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const initContainer = async () => {
      try {
        await container.initialize();
        setContainerReady(true);
      } catch (error) {
        console.error("Error initializing container:", error);
      }
    };
    initContainer();
  }, []);

  // Protección de rutas
  useEffect(() => {
    if (!containerReady || authLoading) return;
    const inAuthGroup =
      segments[0] === "(tabs)" &&
      (segments[1] === "login" || segments[1] === "register");
    if (!user && !inAuthGroup) {
      router.replace("/(tabs)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)/todos");
    }
  }, [user, segments, containerReady, authLoading]);

  useEffect(() => {
    if (containerReady && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [containerReady, authLoading]);

  if (!containerReady || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)/login" />
        <Stack.Screen name="(tabs)/register" />
        <Stack.Screen name="(tabs)/todos" />
      </Stack>
    </ThemeProvider>
  );
}