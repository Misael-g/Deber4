import { AuthRepository } from "../domain/repositories/AuthRepository";
import { User } from "../domain/entities/User";

export class LoginUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    // 🟢 VALIDACIONES
    if (!email || !password) {
      throw new Error("Email y contraseña son requeridos");
    }

    if (!email.includes("@")) {
      throw new Error("Email inválido");
    }

    return this.authRepository.login(email, password);
  }
}