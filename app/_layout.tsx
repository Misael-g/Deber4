import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator, View } from "react-native";
import { container } from "../src/di/container";
import { useAuth } from "../src/presentation/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [containerReady, setContainerReady] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Inicializar contenedor
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
    
    const currentRoute = segments.join("/");
    const isAuthRoute = 
      currentRoute.includes("login") || 
      currentRoute.includes("register") ||
      currentRoute.includes("forgot-password");
    
    // Si NO hay usuario y NO está en ruta de auth → ir a login
    if (!user && !isAuthRoute) {
      router.replace("/(tabs)/login");
    } 
    // Si HAY usuario y está en ruta de auth → ir a todos
    else if (user && isAuthRoute) {
      router.replace("/(tabs)/todos");
    }
  }, [user, segments, containerReady, authLoading]);

  // Ocultar splash screen cuando todo esté listo
  useEffect(() => {
    if (containerReady && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [containerReady, authLoading]);

  // Mostrar loading mientras se inicializa
  if (!containerReady || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)/login" />
      <Stack.Screen name="(tabs)/register" />
      <Stack.Screen name="(tabs)/forgot-password" />
      <Stack.Screen name="(tabs)/todos" />
      <Stack.Screen 
        name="(tabs)/profile" 
        options={{ 
          headerShown: true,
          title: "Mi Perfil",
          headerBackTitle: "Volver"
        }} 
      />
    </Stack>
  );
}