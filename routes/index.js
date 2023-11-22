var express = require('express');
const bodyParser = require('body-parser');
var app = express.Router();
var cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moongoose = require('mongoose');
const todoSchema = require('../Models/todo');

const todom =  moongoose.model('todo',todoSchema);
// Sample hardcoded data
let todos = [];
clientUsername = '';
// temporary user data
let users = [
  { username: 'admin@admin.com', password: bcrypt.hashSync('password1', 10) },
  { username: 'user2@user.com', password: bcrypt.hashSync('password2', 10) },
];
const jwtkey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA53VzmIVVZZWyNm266l82mnoDc9g/snXklax5kChEhqK/WnTUvuXP4Gd4THj8rchxgUGKXd4PF3SUcKyn/qPmTet0idVHk2PwP//FOVgYo5Lb04js0pgZkbyB/WjuMp1w+yMuSn0NYAP7Q9U7DfTbjmox8OQt4tCB4m7UrJghGqT8jkPyZO/Ka6/XsyjTYPOUL3t3PD7JShVAgo1mAY6gSr4SORywIiuHsg+59ad7MXGy78LirhtqAcDECKF7VZpxMuEjMLg3o2yzNUeWI2MgIF+t0HbO1E387fvLcuSyai1yWbSr1PXyiB2aXyDpbD4u7d3ux4ahU2opH11lBqvx+wIDAQA'
// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

moongoose.connect('mongodb+srv://admin:njp9nvHPmhn9eNcB@cluster0.bhr49p2.mongodb.net/?retryWrites=true&w=majority')
// Middleware to log requests
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Todo App' });
});

/// Endpoint to login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  var userdata = user.username;
  if (user && bcrypt.compareSync(password, user.password)) {
    // create a token
    const token = jwt.sign({ username }, jwtkey, { expiresIn: '1h' });
  
    res.json({ token,userdata});
  } else {
    res.status(401).send('Unauthorized');
  }
});
app.use(authenticateJWT); 

// Endpoint to view all tasks
app.get('/todos', (req, res) => {
  const jwtToken = req.header('Authorization');

  const token = jwtToken.split(' ')[1];
  // verify the JWT token generated for the user
  jwt.verify(token, jwtkey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

     clientUsername = decoded.username;
    
    // filter the todos owned by the user who is making the request
    const userTodos = todos.filter(todo => todo.owner === clientUsername);
    console.log('DXDS',userTodos);
    res.json({ todos: userTodos });
  });
});

// Endpoint to add a new task
app.post('/todos', (req, res) => {
  const { task,owner } = req.body;
  const newTodo = { id: uuidv4(), task, done: false,owner:owner };
  const newDbTodo = createTodoScheme(newTodo);
  console.log('newDbTodo',newDbTodo);
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
  console.log('ID ',todoId)
  todos = todos.filter(todo => todo.id !== todoId);
  console.log('TODO ',todos);
  res.json({ message: 'Todo deleted successfully' + todoId });
});
app.delete('/todos', (req, res) => {

  var  filreredArray = todos.filter(task => task.owner !== clientUsername);
  todos = [...filreredArray];
  console.log('TODO ',filreredArray);
  res.json({ message: 'Todo deleted successfully' });
});

function authenticateJWT(req, res, next) {
  const jwtToken = req.header('Authorization');

  const token = jwtToken.split(' ')[1];
  console.log(token);
  if (!token) {
    console.log('No token');
    return res.status(401).send('Unauthorized');
  }

  jwt.verify(token, jwtkey, (err, user) => {
    if (err) {
      console.log('err', err);
      return res.status(403).send('Forbidden');
    }

    req.user = user;
    next();
  });
}


const createTodoScheme = async (Todo) => {
  const todo = await todom.create(Todo);
  console.log('ox',todo);
};
module.exports = app;
