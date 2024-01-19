import React, { useState } from 'react';
import { TextField, Button, Checkbox, List, ListItem, ListItemText, ListItemIcon, Container, Typography, Paper, Tooltip } from '@mui/material';
import logoUrl from './logoApp.png';

interface TodoItem {
  description: string;
  checked: boolean;
}

interface UnfinishedTodosProps {
  todos: TodoItem[];
  toggleCheckbox: (index: number) => void;
  paperBackgroundColor: string;
}
const UnfinishedTodos: React.FC<UnfinishedTodosProps> = ({ todos, toggleCheckbox, paperBackgroundColor }) => {
  const listItemStyle = {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#333',
    padding: '8px 0',
  };

  return (
    <Paper style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', backgroundColor: paperBackgroundColor }}>
      <List>
        {todos.map((item, index) => (
          <ListItem key={index} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.checked}
                tabIndex={-1}
                disableRipple
                onChange={() => toggleCheckbox(index)}
              />
            </ListItemIcon>
            <ListItemText 
              primary={item.description}
              primaryTypographyProps={{ style: listItemStyle }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};


interface TodoControlsProps {
  newTodoDescription: string;
  setNewTodoDescription: React.Dispatch<React.SetStateAction<string>>;
  addItemToDo: () => void;
  deleteToDoItem: () => void;
  addItemButtonColor: string;
  deleteItemButtonColor: string;
}

const TodoControls: React.FC<TodoControlsProps> = ({ newTodoDescription, setNewTodoDescription, addItemToDo, deleteToDoItem, addItemButtonColor, deleteItemButtonColor }) => {
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
  const addItemButtonColor = '#a7c7e7';
  const deleteItemButtonColor = '#e7a7a7';

  const addItemToDo = () => {
    const newTodo: TodoItem = {
      description: newTodoDescription,
      checked: false,
    };
    setTodos([...todos, newTodo]);
    setNewTodoDescription('');
  };

  const toggleCheckbox = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].checked = !newTodos[index].checked;
    setTodos(newTodos);
  };

  const deleteToDoItem = () => {
    const remainingTodos = todos.filter(todo => !todo.checked);
    setTodos(remainingTodos);
  }
//
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
        paperBackgroundColor={paperBackgroundColor}
      />
    </Container>
  );
};

export default ToDoList;
