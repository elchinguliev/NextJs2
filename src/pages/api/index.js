import { useState, useEffect } from "react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [editingTodo, setEditingTodo] = useState(null); // Store the todo currently being edited

  // Fetch all todos on page load
  useEffect(() => {
    fetch("/api/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  // Add a new todo
  const addTodo = () => {
    fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((addedTodo) => setTodos([...todos, addedTodo]));
    setNewTodo({ title: "", description: "" }); // Reset new todo form
  };

  // Delete a todo
  const deleteTodo = (id) => {
    fetch(`/api/todos?id=${id}`, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  };

  // Update a todo (inline editing)
  const updateTodo = (todo) => {
    fetch(`/api/todos?id=${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        const updatedTodos = todos.map((t) =>
          t.id === updatedTodo.id ? updatedTodo : t
        );
        setTodos(updatedTodos);
        setEditingTodo(null); // Stop editing mode
      });
  };

  // Mark a todo as complete/incomplete
  const toggleComplete = (todo) => {
    updateTodo({ ...todo, status: !todo.status });
  };

  return (
    <div>
      <h1>Todo List</h1>

      {/* Add New Todo */}
      <div>
        <h2>Add New Todo</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      {/* Display Todos */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingTodo?.id === todo.id ? (
              <div>
                {/* Inline Edit Form */}
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) =>
                    setEditingTodo({ ...editingTodo, title: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editingTodo.description}
                  onChange={(e) =>
                    setEditingTodo({
                      ...editingTodo,
                      description: e.target.value,
                    })
                  }
                />
                <button onClick={() => updateTodo(editingTodo)}>Save</button>
                <button onClick={() => setEditingTodo(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {/* Display Todo */}
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
                <p>Status: {todo.status ? "Complete" : "Incomplete"}</p>
                <button onClick={() => toggleComplete(todo)}>
                  {todo.status ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                <button onClick={() => setEditingTodo(todo)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
