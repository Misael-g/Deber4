import { AuthRepository } from "../domain/repositories/AuthRepository";
import { User } from "../domain/entities/User";

export class UpdateProfile {
  constructor(private authRepository: AuthRepository) {}

  async execute(displayName: string): Promise<User> {
    // 🟢 VALIDACIONES DE NEGOCIO
    if (!displayName || !displayName.trim()) {
      throw new Error("El nombre no puede estar vacío");
    }

    if (displayName.trim().length < 2) {
      throw new Error("El nombre debe tener al menos 2 caracteres");
    }

    if (displayName.length > 50) {
      throw new Error("El nombre es demasiado largo (máximo 50 caracteres)");
    }

    return this.authRepository.updateProfile(displayName.trim());
  }
}