import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Checkbox, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Container, 
  Paper, 
  Tooltip, 
  Snackbar, 
  Alert, 
  SnackbarCloseReason 
} from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './animations.css';
import logoUrl from './logoApp.png';
import Clock from './Clock';

interface TodoItem {
  id: number;
  description: string;
  checked: boolean;
  deadline: string;
}

const UnfinishedTodos: React.FC<{ 
  todos: TodoItem[]; 
  toggleCheckbox: (id: number) => void; 
  updateTodoDescription: (id: number, description: string, deadline?: string) => void;
  paperBackgroundColor: string; 
}> = ({ todos, toggleCheckbox, updateTodoDescription, paperBackgroundColor }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDescription, setNewDescription] = useState<string>('');
  const [newDeadline, setNewDeadline] = useState<string>('');

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
    updateTodoDescription(id, newDescription, newDeadline); 
    setEditingId(null);
    setNewDescription('');
    setNewDeadline('');
  };
  const isOverdue = (deadline: string) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    return dueDate < now && !todos.find(t => t.id === undefined)?.checked;
  };

  return (
    <Paper style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', backgroundColor: paperBackgroundColor }}>
    <List>
      <TransitionGroup>
        {todos.map((item) => (
          <CSSTransition key={item.id} timeout={500} classNames="fade">
            <ListItem dense className={isOverdue(item.deadline) ? 'overdue' : ''}>
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
              <>
                <TextField
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  variant="standard"
                  fullWidth
                />
                <TextField
                  type="datetime-local"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  variant="standard"
                  fullWidth
                  style={{ marginTop: '8px' }}
                />
              </>
            ) : (
                  <div style={{ width: '100%' }}>
                    <ListItemText 
                      primary={item.description}
                      secondary={`Deadline: ${new Date(item.deadline).toLocaleString('en-US', { timeZone: 'Europe/Berlin' })}`}
                      primaryTypographyProps={{ 
                        style: listItemStyle,
                        className: `line-through ${item.checked ? 'checked' : ''}`
                      }}
                    />
                  </div>
                )}
                {editingId === item.id ? (
                  <Button onClick={() => handleSave(item.id)}>Save</Button>
                ) : (
                  <Button onClick={() => handleEdit(item.id, item.description)}>Edit</Button>
                )}
                {!item.checked && (
                  <Button 
                    onClick={() => alert('You wish, do it yourself')} 
                    style={{ marginLeft: '10px', fontSize: '10px' }}
                  >
                    Send to your partner
                  </Button>
                )}
              </ListItem>
            </CSSTransition>
          ))}
        </TransitionGroup>
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
  newTodoDeadline: string;
  setNewTodoDeadline: React.Dispatch<React.SetStateAction<string>>;
}> = ({ 
  newTodoDescription, 
  setNewTodoDescription, 
  addItemToDo, 
  deleteToDoItem, 
  addItemButtonColor, 
  deleteItemButtonColor,
  newTodoDeadline,
  setNewTodoDeadline
}) => {
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
      <TextField
        label="Deadline"
        type="datetime-local"
        variant="outlined"
        fullWidth
        value={newTodoDeadline}
        onChange={(e) => setNewTodoDeadline(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
      <div style={{ marginTop: '10px' }}>
        <Tooltip title="Add items to the todo list">
          <Button 
            variant="contained" 
            style={{ backgroundColor: addItemButtonColor, color: 'white', marginRight: 8 }} 
            onClick={addItemToDo}
          >
            Add Item
          </Button>
        </Tooltip>

        <Tooltip title="Deletes all checked todos">
          <Button 
            variant="contained" 
            style={{ backgroundColor: deleteItemButtonColor, color: 'white' }} 
            onClick={deleteToDoItem}
          >
            Delete Items
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

const ToDoList: React.FC = () => {
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDeadline, setNewTodoDeadline] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const paperBackgroundColor = '#e8f5e9';
  const addItemButtonColor = '#4CAF50';
  const deleteItemButtonColor = '#F44336';

  useEffect(() => {
    fetch('http://localhost:5000/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addItemToDo = () => {
    if (!newTodoDescription.trim() || !newTodoDeadline.trim()) return;
    fetch('http://localhost:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        description: newTodoDescription, 
        deadline: newTodoDeadline 
      }),
    })
      .then(response => response.json())
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setNewTodoDescription('');
        setNewTodoDeadline('');
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
        if (!todo.checked && updatedTodo.checked) {
          setSnackbarMessage('Well done, you went green!');
          setOpenSnackbar(true);
        }
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  const updateTodoDescription = (id: number, description: string, deadline?: string) => {
    const body: any = { description };
    if (deadline) body.deadline = deadline;
  
    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCloseAlert = (
    event: React.SyntheticEvent<Element, Event>
  ) => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" style={{ backgroundColor: '#c8e6c9', minHeight: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <img src={logoUrl} alt="Green or Bust Logo" style={{ maxWidth: '33%', height: 'auto' }} />
      </div>

      <Clock />

      <TodoControls
        newTodoDescription={newTodoDescription}
        setNewTodoDescription={setNewTodoDescription}
        addItemToDo={addItemToDo}
        deleteToDoItem={deleteToDoItem}
        addItemButtonColor={addItemButtonColor}
        deleteItemButtonColor={deleteItemButtonColor}
        newTodoDeadline={newTodoDeadline}
        setNewTodoDeadline={setNewTodoDeadline}
      />

      <UnfinishedTodos
        todos={todos}
        toggleCheckbox={toggleCheckbox}
        updateTodoDescription={updateTodoDescription}
        paperBackgroundColor={paperBackgroundColor}
      />
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ToDoList;