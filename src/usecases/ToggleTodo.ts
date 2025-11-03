import { Todo } from "../domain/entities/Todo";
import { TodoRepository } from "../domain/repositories/TodoRepository";

export class ToggleTodo {
  constructor(private repository: TodoRepository) {}

  async execute(id: string): Promise<Todo> {
    const todo = await this.repository.getById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    return await this.repository.update({
      id,
      completed: !todo.completed,
    });
  }
}