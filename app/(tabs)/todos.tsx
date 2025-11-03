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
  // ← NUEVAS LÍNEAS
  const { user, logout } = useAuth();
  const router = useRouter();

  // ← NUEVA FUNCIÓN
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.replace("/(tabs)/login");
    }
  };

  const handleAdd = async () => {
    if (!inputText.trim()) return;
    const ok = await addTodo(inputText.trim());
    if (ok) setInputText("");
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={() => toggleTodo(item.id)} style={styles.checkbox}>
        <Text style={{ color: item.completed ? "#fff" : "#000" }}>{item.completed ? "✓" : ""}</Text>
      </TouchableOpacity>
      <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>{item.title}</Text>
      <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* NUEVO HEADER CON INFO DE USUARIO */}
      <View style={styles.header}>
        <View style={styles.userAvatarPlaceholder}>
          <Text style={styles.userAvatarText}>{user?.displayName?.charAt(0) || "U"}</Text>
        </View>
        <Text style={styles.userName}>{user?.displayName || "Usuario"}</Text>
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
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList data={todos} keyExtractor={(t) => t.id} renderItem={renderItem} />
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
    borderRadius: 8,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
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
    flex: 1,
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
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 12,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: "#34C759",
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  loadingText: { textAlign: "center", marginTop: 20 },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  todoText: { flex: 1, fontSize: 16 },
  todoTextCompleted: { textDecorationLine: "line-through", color: "#999" },
  deleteButton: { padding: 8 },
  deleteText: { color: "#FF3B30", fontWeight: "600" },
});