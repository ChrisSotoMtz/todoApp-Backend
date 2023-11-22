const moongoose = require('mongoose');

const userSchema = new moongoose.Schema({
    email: {
        type: String,
        unique:true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});