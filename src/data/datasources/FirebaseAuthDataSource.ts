import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../../FirebaseConfig";
import { User } from "../../domain/entities/User";

// 🔑 CONSTANTE PARA LA KEY DE ASYNCSTORAGE
const USER_STORAGE_KEY = "@TodoApp:user";

export class FirebaseAuthDataSource {
  // ===== MÉTODO PRIVADO: CONVERTIR FIREBASEUSER A USER =====
  private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "Usuario",
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
    };
  }

  // 🆕 ===== GUARDAR USUARIO EN ASYNCSTORAGE =====
  private async saveUserToStorage(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user to storage:", error);
    }
  }

  // 🆕 ===== OBTENER USUARIO DE ASYNCSTORAGE =====
  async getUserFromStorage(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (!userJson) return null;
      
      const userData = JSON.parse(userJson);
      // Convertir la fecha de string a Date
      return {
        ...userData,
        createdAt: new Date(userData.createdAt),
      };
    } catch (error) {
      console.error("Error reading user from storage:", error);
      return null;
    }
  }

  // 🆕 ===== ELIMINAR USUARIO DE ASYNCSTORAGE =====
  private async removeUserFromStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Error removing user from storage:", error);
    }
  }

  // ===== REGISTRO DE USUARIO =====
  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // 2. Actualizar perfil en Auth (displayName)
      await updateProfile(firebaseUser, {
        displayName,
      });

      // 3. Guardar datos adicionales en Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        email,
        displayName,
        createdAt: new Date(),
      });

      // 4. Crear objeto User
      const user: User = {
        id: firebaseUser.uid,
        email,
        displayName,
        createdAt: new Date(),
      };

      // 🆕 5. Guardar en AsyncStorage
      await this.saveUserToStorage(user);

      return user;
    } catch (error: any) {
      console.error("Error registering user:", error);
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Este email ya está registrado. Intenta iniciar sesión.");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("El formato del email no es válido");
      } else if (error.code === "auth/weak-password") {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }
      throw new Error(error.message || "Error al registrar usuario");
    }
  }

  // ===== LOGIN =====
  async login(email: string, password: string): Promise<User> {
    try {
      // 1. Autenticar con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // 2. Obtener datos adicionales de Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const userData = userDoc.data();

      // 3. Crear objeto User
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: userData?.displayName || firebaseUser.displayName || "Usuario",
        createdAt: userData?.createdAt?.toDate() || new Date(),
      };

      // 🆕 4. Guardar en AsyncStorage
      await this.saveUserToStorage(user);

      return user;
    } catch (error: any) {
      console.error("Error logging in:", error);
      if (error.code === "auth/user-not-found") {
        throw new Error("Usuario no encontrado");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Contraseña incorrecta");
      } else if (error.code === "auth/invalid-credential") {
        throw new Error("Email o contraseña incorrectos");
      }
      throw new Error(error.message || "Error al iniciar sesión");
    }
  }

  // ===== LOGOUT =====
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      // 🆕 Eliminar de AsyncStorage
      await this.removeUserFromStorage();
    } catch (error: any) {
      console.error("Error logging out:", error);
      throw new Error(error.message || "Error al cerrar sesión");
    }
  }

  // ===== OBTENER USUARIO ACTUAL =====
  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        // 🆕 Si no hay usuario en Firebase, intentar obtener de AsyncStorage
        return await this.getUserFromStorage();
      }
      
      const user = this.mapFirebaseUserToUser(firebaseUser);
      // 🆕 Actualizar AsyncStorage con los datos más recientes
      await this.saveUserToStorage(user);
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // ===== OBSERVAR CAMBIOS DE AUTENTICACIÓN =====
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = this.mapFirebaseUserToUser(firebaseUser);
        // 🆕 Guardar en AsyncStorage cuando hay cambios
        await this.saveUserToStorage(user);
        callback(user);
      } else {
        // 🆕 Limpiar AsyncStorage cuando se cierra sesión
        await this.removeUserFromStorage();
        callback(null);
      }
    });
  }

  // ===== ACTUALIZAR PERFIL =====
  async updateUserProfile(displayName: string): Promise<User> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error("No hay usuario autenticado");
      }

      // 1. Actualizar en Firebase Auth
      await updateProfile(firebaseUser, {
        displayName,
      });

      // 2. Actualizar en Firestore
      await updateDoc(doc(db, "users", firebaseUser.uid), {
        displayName,
      });

      // 3. Crear objeto User actualizado
      const user = this.mapFirebaseUserToUser(firebaseUser);

      // 🆕 4. Actualizar AsyncStorage
      await this.saveUserToStorage(user);

      return user;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      throw new Error(error.message || "Error al actualizar perfil");
    }
  }

  // ===== ENVIAR EMAIL DE RECUPERACIÓN =====
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      if (error.code === "auth/user-not-found") {
        throw new Error("No existe una cuenta con este email");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("El formato del email no es válido");
      }
      throw new Error(error.message || "Error al enviar email de recuperación");
    }
  }
}