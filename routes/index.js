var express = require('express');
const bodyParser = require('body-parser');
var app = express.Router();
var cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Sample hardcoded data
let todos = [];
clientUsername = '';
// 

require('dotenv').config();
const todoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  task: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    required: true
  },
  owner: {
    type: String,
    required: true,
    ref: 'User'
  }
});

const task = mongoose.model('Todo', todoSchema);

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

mongoose.connect(`mongodb+srv://admin:${process.env.MONGOKEY}@cluster0.bhr49p2.mongodb.net/nombre-de-tu-base-de-datos`);
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

    res.json({ token, userdata });
  } else {
    res.status(401).send('Unauthorized');
  }
});
app.use(authenticateJWT);

// Endpoint to view all tasks
app.get('/todos', async (req, res) => {
  const jwtToken = req.header('Authorization');

  if (!jwtToken) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = jwtToken.split(' ')[1];

  // Verificar y decodificar el token
  jwt.verify(token, jwtkey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Almacena el nombre de usuario del cliente en la variable global
    const clientUsername = decoded.username;

    // Obtener tareas usando la función getTodos
    const userTodos = await getTodos(clientUsername);
    
    console.log('Tareas del usuario:', userTodos);
    res.json({ todos: userTodos });
  });
});

// Endpoint to add a new task
app.post('/todos', (req, res) => {
  const { task, owner } = req.body;

  const newTodo = { id: uuidv4(), task, done: false, owner: owner };
  createTodoScheme(newTodo);
  todos.push(newTodo);
  res.json({ message: 'Todo added successfully', todo: newTodo });
});

// Endpoint to update a task by ID
app.put('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const updatedTask = req.body.task;

  updateTodo(todoId, updatedTask);

  res.json({ message: 'Todo updated successfully' });
});

// Endpoint to delete a tasks by ID
app.delete('/todos/:id', (req, res) => {
  const todoId = (req.params.id);
  deleteTodo(todoId);
  console.log('TODO ', todos);
  res.json({ message: 'Todo deleted successfully' + todoId });
});
app.delete('/todos', (req, res) => {
  deleteAllTodos(clientUsername);
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
  const newTodo = new task(Todo);
  await newTodo.save();

};

const getTodos = async (username) => {
  const todos = await task.find({owner:username});
  return (todos);
}

const updateTodo = async (id, newtask) => {
  const todo = await task.findOneAndUpdate({ id: id }, { task: newtask });
  return (todo);
}
const deleteTodo = async (id) => {

  await task.deleteOne({id:id});

};  

const deleteAllTodos = async (user) => {
  
    await task.deleteMany({owner:user});
};
module.exports = app;
