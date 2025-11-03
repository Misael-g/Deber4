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

export default function ProfileScreen() {
  const { user, updateUserProfile, logout, loading } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }

    const success = await updateUserProfile(displayName.trim());
    if (success) {
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setIsEditing(false);
    } else {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            const success = await logout();
            if (success) {
              router.replace("/(tabs)/login");
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No hay usuario autenticado</Text>
      </View>
    );
  }

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
          <View style={styles.header}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>
                {user.displayName?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Text style={styles.title}>Mi Perfil</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <Text style={styles.helperText}>El email no puede modificarse</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Nombre</Text>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Tu nombre"
                  autoFocus
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={() => {
                      setDisplayName(user.displayName || "");
                      setIsEditing(false);
                    }}
                  >
                    <Text style={styles.buttonSecondaryText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonPrimary]}
                    onPress={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Guardar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>{user.displayName}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.buttonText}>Editar Nombre</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Cuenta creada</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {user.createdAt.toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>

          <View style={styles.dangerZone}>
            <TouchableOpacity
              style={[styles.button, styles.buttonDanger]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
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
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarLargeText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#007AFF",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonPrimary: {
    backgroundColor: "#007AFF",
  },
  buttonSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonDanger: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondaryText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dangerZone: {
    marginTop: 30,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});