import { create } from "zustand";
import api from "@/lib/axios";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  loading: boolean;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  updateTodo: (id: number, payload: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  loading: false,

  fetchTodos: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/todos");
      set({ todos: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  addTodo: async (title) => {
    try {
      const res = await api.post("/todos", { title });
      set({ todos: [res.data, ...get().todos] });
    } catch (err) {}
  },

  updateTodo: async (id, payload) => {
    try {
      const res = await api.put(`/todos/${id}`, payload);
      set({ todos: get().todos.map((t) => (t.id === id ? res.data : t)) });
    } catch (err) {}
  },

  deleteTodo: async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      set({ todos: get().todos.filter((t) => t.id !== id) });
    } catch (err) {}
  },
}));
