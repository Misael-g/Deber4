import { Todo, UpdateTodoDTO } from "../domain/entities/Todo";
import { TodoRepository } from "../domain/repositories/TodoRepository";

export class UpdateTodo {
  constructor(private repository: TodoRepository) {}

  async execute(data: UpdateTodoDTO): Promise<Todo> {
    // Validaciones de negocio
    if (!data.id) {
      throw new Error("ID de tarea requerido");
    }

    if (data.title !== undefined && !data.title.trim()) {
      throw new Error("El título no puede estar vacío");
    }

    if (data.title && data.title.length > 200) {
      throw new Error("El título es demasiado largo");
    }

    return await this.repository.update(data);
  }
}