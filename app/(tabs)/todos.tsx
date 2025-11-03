import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { useTodos } from "../../src/presentation/hooks/useTodos";
import { useAuth } from "../../src/presentation/hooks/useAuth";
import { useRouter } from "expo-router";

export default function TodosScreenClean() {
  const [inputText, setInputText] = useState("");
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useTodos();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.replace("/(tabs)/login");
    }
  };

  // 🆕 NUEVO: Navegar a perfil
  const goToProfile = () => {
    router.push("/(tabs)/profile");
  };

  const handleAdd = async () => {
    if (!inputText.trim()) return;
    const ok = await addTodo(inputText.trim());
    if (ok) setInputText("");
  };

  // 🆕 MODIFICADO: Confirmación antes de eliminar
  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Confirmar Eliminación",
      `¿Estás seguro que deseas eliminar "${title}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteTodo(id),
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.todoItem}>
      <TouchableOpacity 
        onPress={() => toggleTodo(item.id)} 
        style={[
          styles.checkbox,
          item.completed && styles.checkboxCompleted
        ]}
      >
        <Text style={styles.checkboxText}>
          {item.completed ? "✓" : ""}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
        {item.title}
      </Text>
      {/* 🔴 MODIFICADO: Pasar título a la función */}
      <TouchableOpacity 
        onPress={() => handleDelete(item.id, item.title)} 
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER CON INFO DE USUARIO */}
      <View style={styles.header}>
        {/* 🆕 MODIFICADO: Header clickeable para ir a perfil */}
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={goToProfile}
          activeOpacity={0.7}
        >
          <View style={styles.userAvatarPlaceholder}>
            <Text style={styles.userAvatarText}>
              {user?.displayName?.charAt(0) || "U"}
            </Text>
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>{user?.displayName || "Usuario"}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Mis Tareas</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nueva tarea"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>➕</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : todos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>📝</Text>
          <Text style={styles.emptyStateText}>No hay tareas</Text>
          <Text style={styles.emptyStateSubtext}>
            ¡Agrega tu primera tarea arriba!
          </Text>
        </View>
      ) : (
        <FlatList 
          data={todos} 
          keyExtractor={(t) => t.id} 
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#007AFF",
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // 🆕 NUEVOS ESTILOS
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  userTextContainer: {
    flex: 1,
  },
  userEmail: {
    color: "#B3D9FF",
    fontSize: 12,
    marginTop: 2,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#0055CC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 10,
    backgroundColor: "#0055CC",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 12,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#34C759",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    minWidth: 60,
  },
  addButtonText: { 
    fontSize: 24,
  },
  loadingText: { 
    textAlign: "center", 
    marginTop: 20,
    color: "#999",
  },
  listContent: {
    paddingBottom: 20,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  checkboxText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  todoText: { 
    flex: 1, 
    fontSize: 16,
    color: "#333",
  },
  todoTextCompleted: { 
    textDecorationLine: "line-through", 
    color: "#999",
  },
  deleteButton: { 
    padding: 8,
    marginLeft: 8,
  },
  deleteText: { 
    fontSize: 20,
  },
  // 🆕 NUEVOS ESTILOS: Empty state
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#999",
  },
});