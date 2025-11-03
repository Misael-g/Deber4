import { useState, useEffect } from "react";
import { container } from "../../di/container";
import { User } from "../../domain/entities/User";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Observar cambios de autenticación
  useEffect(() => {
    const unsubscribe = container.authRepository.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await container.registerUser.execute(
        email,
        password,
        displayName
      );
      setUser(newUser);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const loggedUser = await container.loginUser.execute(email, password);
      setUser(loggedUser);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await container.logoutUser.execute();
      setUser(null);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🆕 NUEVO: Actualizar perfil
  const updateUserProfile = async (displayName: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await container.updateProfile.execute(displayName);
      setUser(updatedUser);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🆕 NUEVO: Enviar email de recuperación
  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await container.sendPasswordReset.execute(email);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUserProfile, // 🆕 NUEVO
    sendPasswordReset, // 🆕 NUEVO
    isAuthenticated: !!user,
  };
};