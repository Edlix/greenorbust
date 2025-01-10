import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, List, ListItem, ListItemText, ListItemIcon, Container, Paper, Tooltip } from '@mui/material';
import logoUrl from './logoApp.png';

interface TodoItem {
  id: number;
  description: string;
  checked: boolean;
}

const UnfinishedTodos: React.FC<{ 
  todos: TodoItem[]; 
  toggleCheckbox: (id: number) => void; 
  updateTodoDescription: (id: number, description: string) => void;
  paperBackgroundColor: string; 
}> = ({ todos, toggleCheckbox, updateTodoDescription, paperBackgroundColor }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDescription, setNewDescription] = useState<string>('');

  const listItemStyle = {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#333',
    padding: '8px 0',
  };

  const handleEdit = (id: number, currentDescription: string) => {
    setEditingId(id);
    setNewDescription(currentDescription);
  };

  const handleSave = (id: number) => {
    updateTodoDescription(id, newDescription);
    setEditingId(null);
    setNewDescription('');
  };

  return (
    <Paper style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', backgroundColor: paperBackgroundColor }}>
      <List>
        {todos.map((item) => (
          <ListItem key={item.id} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.checked}
                tabIndex={-1}
                disableRipple
                onChange={() => toggleCheckbox(item.id)}
              />
            </ListItemIcon>
            {editingId === item.id ? (
              <TextField
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                variant="standard"
                fullWidth
              />
            ) : (
              <ListItemText 
                primary={item.description}
                primaryTypographyProps={{ style: listItemStyle }}
              />
            )}
            {editingId === item.id ? (
              <Button onClick={() => handleSave(item.id)}>Save</Button>
            ) : (
              <Button onClick={() => handleEdit(item.id, item.description)}>Edit</Button>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

const TodoControls: React.FC<{ 
  newTodoDescription: string; 
  setNewTodoDescription: React.Dispatch<React.SetStateAction<string>>; 
  addItemToDo: () => void; 
  deleteToDoItem: () => void; 
  addItemButtonColor: string; 
  deleteItemButtonColor: string; 
}> = ({ newTodoDescription, setNewTodoDescription, addItemToDo, deleteToDoItem, addItemButtonColor, deleteItemButtonColor }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <TextField
        label="New Todo"
        variant="outlined"
        fullWidth
        value={newTodoDescription}
        onChange={(e) => setNewTodoDescription(e.target.value)}
        margin="normal"
      />
      <div style={{ marginTop: '10px' }}>
        <Tooltip title="Add items to the todo list">
          <Button variant="contained" style={{ backgroundColor: addItemButtonColor, color: 'white', marginRight: 8 }} onClick={addItemToDo}>
            Add Item
          </Button>
        </Tooltip>

        <Tooltip title="Deletes all checked todos">
          <Button variant="contained" style={{ backgroundColor: deleteItemButtonColor, color: 'white' }} onClick={deleteToDoItem}>
            Delete Items
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

const ToDoList: React.FC = () => {
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const paperBackgroundColor = '#e8f5e9';
  const addItemButtonColor = '#4CAF50'; // Brighter green
  const deleteItemButtonColor = '#F44336'; // Brighter red

  useEffect(() => {
    fetch('http://localhost:5000/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addItemToDo = () => {
    if (!newTodoDescription.trim()) return;
    fetch('http://localhost:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: newTodoDescription }),
    })
      .then(response => response.json())
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setNewTodoDescription('');
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  const toggleCheckbox = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked: !todo.checked }),
    })
      .then(response => response.json())
      .then(updatedTodo => {
        setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  const updateTodoDescription = (id: number, description: string) => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    })
      .then(response => response.json())
      .then(updatedTodo => {
        setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  const deleteToDoItem = () => {
    const checkedTodos = todos.filter(t => t.checked);
    checkedTodos.forEach(todo => {
      fetch(`http://localhost:5000/todos/${todo.id}`, { method: 'DELETE' })
        .then(() => {
          setTodos(todos.filter(t => t.id !== todo.id));
        })
        .catch(error => console.error('Error deleting todo:', error));
    });
  };

  return (
    <Container maxWidth="sm" style={{ backgroundColor: '#c8e6c9', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <img src={logoUrl} alt="Green or Bust Logo" style={{ maxWidth: '33%', height: 'auto' }} />
      </div>

      <TodoControls
        newTodoDescription={newTodoDescription}
        setNewTodoDescription={setNewTodoDescription}
        addItemToDo={addItemToDo}
        deleteToDoItem={deleteToDoItem}
        addItemButtonColor={addItemButtonColor}
        deleteItemButtonColor={deleteItemButtonColor}
      />

      <UnfinishedTodos
        todos={todos}
        toggleCheckbox={toggleCheckbox}
        updateTodoDescription={updateTodoDescription}
        paperBackgroundColor={paperBackgroundColor}
      />
    </Container>
  );
};

export default ToDoList;
