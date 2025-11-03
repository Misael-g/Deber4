import { AuthRepository } from "../domain/repositories/AuthRepository";
import { User } from "../domain/entities/User";

export class RegisterUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    // 🟢 VALIDACIONES DE NEGOCIO MEJORADAS

    // 1. Validar campos vacíos
    if (!email || !password || !displayName) {
      throw new Error("Todos los campos son requeridos");
    }

    // 2. Validar formato de email con regex más estricto
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error("El formato del email no es válido");
    }

    // 3. Validar longitud de contraseña
    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // 4. Validar que la contraseña no sea muy débil
    if (password.toLowerCase() === "123456" || password.toLowerCase() === "password") {
      throw new Error("La contraseña es demasiado común. Elige una más segura");
    }

    // 5. Validar nombre
    if (displayName.trim().length < 2) {
      throw new Error("El nombre debe tener al menos 2 caracteres");
    }

    if (displayName.length > 50) {
      throw new Error("El nombre es demasiado largo (máximo 50 caracteres)");
    }

    // 6. Intentar registrar (el DataSource manejará el error de email duplicado)
    return this.authRepository.register(email.trim(), password, displayName.trim());
  }
}