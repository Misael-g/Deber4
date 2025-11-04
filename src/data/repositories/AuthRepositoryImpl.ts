import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { User } from "../../domain/entities/User";
import { FirebaseAuthDataSource } from "../datasources/FirebaseAuthDataSource";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private dataSource: FirebaseAuthDataSource) {}

  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    return this.dataSource.register(email, password, displayName);
  }

  async login(email: string, password: string): Promise<User> {
    return this.dataSource.login(email, password);
  }

  async logout(): Promise<void> {
    return this.dataSource.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    // 🆕 Ahora también verifica AsyncStorage
    return this.dataSource.getCurrentUser();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.dataSource.onAuthStateChanged(callback);
  }

  async updateProfile(displayName: string): Promise<User> {
    return this.dataSource.updateUserProfile(displayName);
  }

  async sendPasswordReset(email: string): Promise<void> {
    return this.dataSource.sendPasswordReset(email);
  }
}