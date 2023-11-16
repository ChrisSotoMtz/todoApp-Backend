# ToDo App with Express
## Domain Provided by Vercel: https://todo-app-backend-eight.vercel.app/
This is a simple Todo App built using Express.js. It provides basic CRUD (Create, Read, Update, Delete) operations for managing tasks.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Endpoints](#endpoints)
- [Sample Requests](#sample-requests)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node.js package manager)

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project folder:

    ```bash
    cd todo-express-app
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Usage

### Endpoints

#### 1. `GET /`

- Description: Welcome message to Todo App.

#### 2. `GET /todos`

- Description: Get a list of all tasks.

#### 3. `POST /todos`

- Description: Add a new task.
- Request Body:
  ```json
  {
    "task": "Your task description"
  }
- Response:
  ```json
   {
  "message": "Todo added successfully",
  "todo": {
    "id": "generated-uuid",
    "task": "Your task description",
    "done": false
  }

#### 4. `PUT /todos/:id`
- Description: Get a list of all tasks.
- Request Parameters:
  id: ID of the task to update.
  Request Body:
    ```json
    {
    "task": "Updated task description"
    }
- Reponse:
  ```json
  {
  "message": "Todo updated successfully",
  "todo": {
    "id": "updated-uuid",
    "task": "Updated task description",
    "done": false
    }
  }
#### 5. `DELETE /todos/:id`
- Description: Delete a task by ID.
- Request Parameters:
  id: ID of the task to delete.
- Response
    ```json
    {
  "message": "All Todos deleted successfully"
    }
#### 6. `DELETE /todos`
- Description: Delete all tasks.
- Response:
  
    ```json
        {
        " message": "All Todos deleted successfully"
        }

# Sample Requests
You can use tools like Postman to interact with the API.
## Adding a new task:
  -Method: POST
  -URL: http://localhost:3000/todos
- Body:
  
    ```json
        {
        " task": "Finish README"
        }



## Updating a task:
- Method: PUT
- URL: http://localhost:3000/todos/{id}
- Body:
  
    ```json
        {
        " task": "Update  README"
        }


