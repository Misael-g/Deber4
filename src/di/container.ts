import { FirebaseTodoDataSource } from "../data/datasources/FirebaseTodoDataSource";
import { TodoRepositoryFirebaseImpl } from "../data/repositories/TodoRepositoryFirebaseImpl";
import { TodoRepository } from "../domain/repositories/TodoRepository";
import { CreateTodo } from "../usecases/CreateTodo"; 
import { DeleteTodo } from "../usecases/DeleteTodo";  
import { GetAllTodos } from "../usecases/GetAllTodos";  
import { UpdateTodo } from "../usecases/UpdateTodo";  
import { ToggleTodo } from "../usecases/ToggleTodo";

// ===== NUEVOS IMPORTS DE AUTH =====
import { FirebaseAuthDataSource } from "../data/datasources/FirebaseAuthDataSource";
import { AuthRepositoryImpl } from "../data/repositories/AuthRepositoryImpl";
import { RegisterUser } from "../usecases/RegisterUser";  
import { LoginUser } from "../usecases/LoginUser";  
import { LogoutUser } from "../usecases/LogoutUser";  
import { GetCurrentUser } from "../usecases/GetCurrentUser";  
import { AuthRepository } from "../domain/repositories/AuthRepository";

class DIContainer {
  private static instance: DIContainer;

  // Private constructor for Singleton
  private constructor() {}

  // Singleton getInstance method
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // ===== PROPIEDADES DE TODOS =====
  private _todoDataSource?: FirebaseTodoDataSource;
  private _todoRepository?: TodoRepository;
  private _createTodo?: CreateTodo;
  private _getAllTodos?: GetAllTodos;
  private _updateTodo?: UpdateTodo;
  private _deleteTodo?: DeleteTodo;
  private _toggleTodo?: ToggleTodo; // ← AGREGAR ESTA LÍNEA

  // ===== PROPIEDADES DE AUTH =====
  private _authDataSource?: FirebaseAuthDataSource;
  private _authRepository?: AuthRepository;
  private _registerUser?: RegisterUser;
  private _loginUser?: LoginUser;
  private _logoutUser?: LogoutUser;
  private _getCurrentUser?: GetCurrentUser;

  async initialize(): Promise<void> {
    // Initialize Firebase and other services if needed
    await this.todoDataSource.initialize();
  }

  // ===== GETTERS DE TODOS =====
  get todoDataSource(): FirebaseTodoDataSource {
    if (!this._todoDataSource) {
      this._todoDataSource = new FirebaseTodoDataSource();
    }
    return this._todoDataSource;
  }

  get todoRepository(): TodoRepository {
    if (!this._todoRepository) {
      this._todoRepository = new TodoRepositoryFirebaseImpl(this.todoDataSource);
    }
    return this._todoRepository;
  }

  get createTodo(): CreateTodo {
    if (!this._createTodo) {
      this._createTodo = new CreateTodo(this.todoRepository);
    }
    return this._createTodo;
  }

  get getAllTodos(): GetAllTodos {
    if (!this._getAllTodos) {
      this._getAllTodos = new GetAllTodos(this.todoRepository);
    }
    return this._getAllTodos;
  }

  get updateTodo(): UpdateTodo {
    if (!this._updateTodo) {
      this._updateTodo = new UpdateTodo(this.todoRepository);
    }
    return this._updateTodo;
  }

  get deleteTodo(): DeleteTodo {
    if (!this._deleteTodo) {
      this._deleteTodo = new DeleteTodo(this.todoRepository);
    }
    return this._deleteTodo;
  }

  get toggleTodo(): ToggleTodo {
    if (!this._toggleTodo) {
      this._toggleTodo = new ToggleTodo(this.todoRepository);
    }
    return this._toggleTodo;
  }

  // ===== GETTERS DE AUTH =====
  get authDataSource(): FirebaseAuthDataSource {
    if (!this._authDataSource) {
      this._authDataSource = new FirebaseAuthDataSource();
    }
    return this._authDataSource;
  }

  get authRepository(): AuthRepository {
    if (!this._authRepository) {
      this._authRepository = new AuthRepositoryImpl(this.authDataSource);
    }
    return this._authRepository;
  }

  get registerUser(): RegisterUser {
    if (!this._registerUser) {
      this._registerUser = new RegisterUser(this.authRepository);
    }
    return this._registerUser;
  }

  get loginUser(): LoginUser {
    if (!this._loginUser) {
      this._loginUser = new LoginUser(this.authRepository);
    }
    return this._loginUser;
  }

  get logoutUser(): LogoutUser {
    if (!this._logoutUser) {
      this._logoutUser = new LogoutUser(this.authRepository);
    }
    return this._logoutUser;
  }

  get getCurrentUser(): GetCurrentUser {
    if (!this._getCurrentUser) {
      this._getCurrentUser = new GetCurrentUser(this.authRepository);
    }
    return this._getCurrentUser;
  }
}

export const container = DIContainer.getInstance();