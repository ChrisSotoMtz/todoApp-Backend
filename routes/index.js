var express = require('express');
const bodyParser = require('body-parser');
var app = express.Router();
const { v4: uuidv4 } = require('uuid');/* GET home page. */
// Sample hardcoded data
let todos = [];

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to view all tasks
app.get('/', (req, res) => {
  res.json({ message: 'welcome to Todo App' });
});

app.get('/todos', (req, res) => {
  res.json({ todos });
});

// Endpoint to add a new task
app.post('/todos', (req, res) => {
  const { task } = req.body;
  const newTodo = { id: uuidv4(), task, done: false };
  todos.push(newTodo);
  res.json({ message: 'Todo added successfully', todo: newTodo });
});

// Endpoint to update a task by ID
app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const updatedTask = req.body.task;
  
  const todoIndex = todos.findIndex(todo => todo.id === todoId);

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todos[todoIndex].task = updatedTask;
  res.json({ message: 'Todo updated successfully', todo: todos[todoIndex] });
});

// Endpoint to delete a tasks by ID
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);

  todos = todos.filter(todo => todo.id !== todoId);
  res.json({ message: 'Todo deleted successfully' });
});
app.delete('/todos', (req, res) => {

  todos = []
  res.json({ message: 'Todo deleted successfully' });
});


module.exports = app;
