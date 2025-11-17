import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./page";
import api from "@/lib/axios";

// Mock the axios instance
jest.mock("@/lib/axios");

describe("Todo App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input box", async () => {
    const mockedApi = api as jest.Mocked<typeof api>;
    mockedApi.get.mockResolvedValueOnce({ data: [] });

    await act(async () => {
      render(<App />);
    });

    const input = screen.getByTestId("todo-title");
    expect(input).toBeInTheDocument();
  });

  it("add, update and delete a todo", async () => {
    const mockedApi = api as jest.Mocked<typeof api>;

    // Mock API responses
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    mockedApi.post.mockResolvedValueOnce({
      data: { id: 1, title: "My test todo", completed: false },
    });
    mockedApi.put.mockResolvedValueOnce({
      data: { id: 1, title: "My updated test todo", completed: false },
    });
    mockedApi.delete.mockResolvedValueOnce({ data: {} });

    // Render component
    await act(async () => {
      render(<App />);
    });

    // --- ADD TODO ---
    const input = screen.getByTestId("todo-title");
    const addBtn = screen.getByTestId("add-todo-btn");

    await act(async () => {
      fireEvent.change(input, { target: { value: "My test todo" } });
      fireEvent.click(addBtn);
    });

    // Wait for the todo to appear
    const todo = await screen.findByText("My test todo");
    expect(todo).toBeInTheDocument();

    // --- UPDATE TODO ---
    await act(async () => {
      const editButton = screen.getByText("Edit");
      fireEvent.click(editButton);
    });

    // Wait for input to appear for editing
    const editInput = await screen.findByDisplayValue("My test todo");

    await act(async () => {
      const updateBtn = screen.getByTestId("edit-todo-btn");
      fireEvent.change(editInput, { target: { value: "My updated test todo" } });
      fireEvent.click(updateBtn);
    });

    // Wait for updated todo to appear
    const updatedTodo = await screen.findByText("My updated test todo");
    expect(updatedTodo).toBeInTheDocument();

    // --- DELETE TODO ---
    const deleteBtn = screen.getByTestId("deleteBtn");
    await act(async () => {
      fireEvent.click(deleteBtn);
    });

    // Confirm todo is removed
    expect(screen.queryByText("My updated test todo")).toBeNull();
  });
});
