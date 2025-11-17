
"use client"

import { useEffect, useState } from "react";
import { useTodoStore } from "@/store/useTodoStore";
export default function App() {

  const { todos, fetchTodos, addTodo, updateTodo, deleteTodo, loading } = useTodoStore();
  const [newTitle, setNewTitle] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null)
  useEffect(() => {
    fetchTodos()
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (editId) {
      await updateTodo(editId, {title:newTitle.trim()})
    } else {
      await addTodo(newTitle.trim())

    }
    setNewTitle("")
    setEditId(null)
  }

  const updateTigger = (id: number, title: string)=>{
    setEditId(id)
    setNewTitle(title)
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Todo — Nice UI</h1>

        <form onSubmit={submit} className="flex gap-2 mb-4">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Add new todo..."
            className="flex-1 p-3 border rounded-lg focus:outline-none"
            data-testid="todo-title"
          />
          <button data-testid={editId ? "edit-todo-btn" : "add-todo-btn"} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editId ? "update" : "add"}</button>
        </form>

        {loading ? <div>Loading...</div> : (
          <ul className="space-y-2">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => updateTodo(todo.id, { completed: !todo.completed })}
                    className="w-5 h-5"
                  />
                  <span className={todo.completed ? 'line-through text-gray-400' : ''}>{todo.title}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateTigger(todo.id, todo.title)}
                    className="text-sm px-2 py-1 border rounded">Edit</button>
                  <button data-testid="deleteBtn" onClick={() => deleteTodo(todo.id)} className="text-sm px-2 py-1 bg-red-500 text-white rounded">Del</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
