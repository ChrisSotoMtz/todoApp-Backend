var express = require('express');
const bodyParser = require('body-parser');
var app = express.Router();
var cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid');
// Sample hardcoded data
let todos = [

];

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

// Middleware to log requests
app.use((req, res, next) => {
  const signedCookieValue = req.signedCookies.user;
  if (signedCookieValue) {
    console.log('Signed Cookie Value:', signedCookieValue);
  }
  next();
});

app.get('/', (req, res) => {
  res.cookie('user', 'Random User');

  // Set a signed cookie
  res.json({ message: 'Welcome to Todo App' });
});

// Endpoint to view all tasks
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
  const todoId = req.params.id;
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
  const todoId = (req.params.id);
  todos = todos.filter(todo => todo.id !== todoId);
  res.json({ message: 'Todo deleted successfully' + todoId });
});
app.delete('/todos', (req, res) => {

  todos = []
  res.json({ message: 'Todo deleted successfully' });
});


module.exports = app;
