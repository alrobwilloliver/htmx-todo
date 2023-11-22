const mongoose = require('mongoose');
const uuid = require('uuid').v4;

const subTaskSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuid(),
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
});

const SubTask = mongoose.model('SubTask', subTaskSchema);
module.exports = SubTask;