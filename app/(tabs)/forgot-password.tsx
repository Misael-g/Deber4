import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuth } from "../../src/presentation/hooks/useAuth";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const { sendPasswordReset, loading, error } = useAuth();
  const router = useRouter();

  const handleSendReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingresa tu email");
      return;
    }

    const success = await sendPasswordReset(email.trim());
    if (success) {
      Alert.alert(
        "Email Enviado",
        "Se ha enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y spam.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert("Error", error || "No se pudo enviar el email de recuperación");
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔒</Text>
          </View>

          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            No te preocupes, te enviaremos instrucciones para recuperarla
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar Email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={goBack} style={styles.linkButton}>
            <Text style={styles.linkText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>💡 Información</Text>
            <Text style={styles.infoText}>
              • Recibirás un email con un enlace para restablecer tu contraseña
            </Text>
            <Text style={styles.infoText}>
              • El enlace es válido por 1 hora
            </Text>
            <Text style={styles.infoText}>
              • Si no recibes el email, revisa tu carpeta de spam
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 20,
    padding: 10,
  },
  linkText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#90CAF9",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#1565C0",
    marginBottom: 5,
  },
});