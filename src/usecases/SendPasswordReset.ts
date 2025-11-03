import { AuthRepository } from "../domain/repositories/AuthRepository";

export class SendPasswordReset {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string): Promise<void> {
    // 🟢 VALIDACIONES DE NEGOCIO
    if (!email || !email.trim()) {
      throw new Error("El email es requerido");
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("El formato del email no es válido");
    }

    return this.authRepository.sendPasswordReset(email.trim());
  }
}
