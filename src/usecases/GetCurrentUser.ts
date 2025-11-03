import { AuthRepository } from "../domain/repositories/AuthRepository";
import { User } from "../domain/entities/User";

export class GetCurrentUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}