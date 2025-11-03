import { AuthRepository } from "../domain/repositories/AuthRepository";

export class LogoutUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepository.logout();
  }
}