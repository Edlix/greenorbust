import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

interface TodoItem {
  id: number;
  description: string;
  checked: boolean;
}

const DATA_FILE = path.join(__dirname, 'todos.json');

let todos: TodoItem[] = [];

const loadTodos = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    todos = JSON.parse(data);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, initialize with empty array
      todos = [];
      await saveTodos();
    } else {
      console.error('Error reading todos:', err);
    }
  }
};

const saveTodos = async () => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
  } catch (err) {
    console.error('Error saving todos:', err);
  }
};

app.get('/todos', (req: Request, res: Response) => {
  res.json(todos);
});

app.post('/todos', async (req: Request, res: Response) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: 'Description is required' });
  }
  const newTodo: TodoItem = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    description,
    checked: false,
  };
  todos.push(newTodo);
  await saveTodos();
  res.status(201).json(newTodo);
});

app.put('/todos/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { description, checked } = req.body;
  const todo = todos.find(t => t.id === id);
  if (todo) {
    if (description !== undefined) todo.description = description;
    if (checked !== undefined) todo.checked = checked;
    await saveTodos();
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    await saveTodos();
    res.json({ message: 'Todo deleted' });
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Start Server
const startServer = async () => {
  await loadTodos();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();