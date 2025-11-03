import { TodoRepository } from "../domain/repositories/TodoRepository";

export class DeleteTodo {
  constructor(private repository: TodoRepository) {}

  async execute(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}