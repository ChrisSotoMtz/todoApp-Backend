const moongoose = require('mongoose');

const todoSchema = new moongoose.Schema({   
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