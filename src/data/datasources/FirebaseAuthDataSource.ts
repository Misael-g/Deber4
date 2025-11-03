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
import { auth, db } from "../../../FirebaseConfig";
import { User } from "../../domain/entities/User";

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

      // 4. Retornar usuario mapeado
      return {
        id: firebaseUser.uid,
        email,
        displayName,
        createdAt: new Date(),
      };
    } catch (error: any) {
      console.error("Error registering user:", error);
      // 🔥 Mensajes de error mejorados
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

      // 3. Retornar usuario completo
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: userData?.displayName || firebaseUser.displayName || "Usuario",
        createdAt: userData?.createdAt?.toDate() || new Date(),
      };
    } catch (error: any) {
      console.error("Error logging in:", error);
      // Mensajes de error más amigables
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
    } catch (error: any) {
      console.error("Error logging out:", error);
      throw new Error(error.message || "Error al cerrar sesión");
    }
  }

  // ===== OBTENER USUARIO ACTUAL =====
  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;
      return this.mapFirebaseUserToUser(firebaseUser);
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // ===== OBSERVAR CAMBIOS DE AUTENTICACIÓN =====
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    // Retorna función de desuscripción
    return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback(this.mapFirebaseUserToUser(firebaseUser));
      } else {
        callback(null);
      }
    });
  }

  // 🆕 ===== ACTUALIZAR PERFIL =====
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

      // 3. Retornar usuario actualizado
      return this.mapFirebaseUserToUser(firebaseUser);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      throw new Error(error.message || "Error al actualizar perfil");
    }
  }

  // 🆕 ===== ENVIAR EMAIL DE RECUPERACIÓN =====
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