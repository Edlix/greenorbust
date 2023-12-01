import React, { useState } from 'react';

const ToDoList = () => {
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [todos, setTodos] = useState([
    { description: 'I need to pick up the kids', checked: true },
    { description: 'I need to go out with the garbage', checked: false },
  ]);

  const addItemToDo = () => {
    const newTodo = {
      description: newTodoDescription,
      checked: false,
    };
    setTodos([...todos, newTodo]);
    setNewTodoDescription('');
  };

  return (
    <div className="todo">
      <h1>Welcome to my awesome to do list</h1>

      <input
        type="text"
        value={newTodoDescription}
        onChange={(e) => setNewTodoDescription(e.target.value)}
      />
      <button onClick={addItemToDo}>Add Item</button>

      <ul>
        {todos.map((item, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={item.checked}
              readOnly
            /> {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
