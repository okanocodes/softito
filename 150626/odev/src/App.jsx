import { useState } from 'react'


function App() {
  const [todos, setTodos] = useState([])

  const [newTodo, setNewTodo] = useState("")

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    const todo = {
      id: Date.now(),
      title: newTodo,
      completed: false,
    };
    setTodos([...todos, todo]);


    setNewTodo("");


  }


  const removeTodo = (id) => setTodos(todos.filter(todo => todo.id !== id))


  const todoCompletedToggle = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };



  return (
    <>
      <div className='p-4 bg-indigo-500'>

        <div className='bg-white max-w-6xl m-auto rounded-2xl min-h-screen p-6 space-y-4'>
          <h1 className='text-xl'>Todo List</h1>


          <form onSubmit={addTodo} className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add new todo..."
              className="w-full rounded-md border-2 border-indigo-300 p-2 focus-within:border-transparent focus-within:outline-blue-600"
            />
            <button className="bg-indigo-700 p-2 rounded-md text-white" type="submit">
              Add
            </button>
          </form>

          <div className='todo-list border border-gray-500 rounded-md p-4'>
            {todos.length === 0 ? (
              <p className="text-gray-400">No todos yet.</p>
            ) : (
              <div className="todo-list-container space-y-5">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center'>
                      <input type="checkbox" checked={todo.completed}
                        onChange={() => todoCompletedToggle(todo.id)}
                        className="mr-4"
                      />

                      <span className={`${todo.completed ? "line-through text-gray-400" : ""}`}>{todo.title}</span>
                    </div>

                    <button
                      className="bg-red-500 text-white p-2 rounded-sm"
                      onClick={() => removeTodo(todo.id)}
                    >Delete</button>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </>
  )
}

export default App
