import React, { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator, View, useColorScheme } from "react-native";
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
    
    // Obtener la ruta actual de forma segura
    const currentRoute = segments.join("/");
    const isAuthRoute = 
      currentRoute.includes("login") || 
      currentRoute.includes("register") ||
      currentRoute.includes("forgot-password"); // 🆕 NUEVO
    
    if (!user && !isAuthRoute) {
      router.replace("/(tabs)/login");
    } else if (user && isAuthRoute) {
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
        <Stack.Screen name="(tabs)/forgot-password" /> {/* 🆕 NUEVO */}
        <Stack.Screen name="(tabs)/todos" />
        <Stack.Screen 
          name="(tabs)/profile" 
          options={{ 
            headerShown: true,
            title: "Mi Perfil",
            headerBackTitle: "Volver"
          }} 
        /> {/* 🆕 NUEVO */}
      </Stack>
    </ThemeProvider>
  );
}