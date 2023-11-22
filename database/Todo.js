const mongoose = require('mongoose');
const uuid = require('uuid').v4;

// Define the schema
const todoSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuid(),
        unique: true
    },
    task: String,
    completed: {
        type: Boolean,
        default: false
    },
    category: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    subTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTask'
    }]
});

// Create the model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;