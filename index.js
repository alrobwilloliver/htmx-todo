const express = require("express");
const handlebars = require("express-handlebars").engine;
const mongoose = require("mongoose");
const Todo = require("./database/Todo");
const SubTask = require("./database/SubTask");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.use(express.static("public"));

const PORT = process.env.PORT || 9001;

app.engine("hbs", handlebars({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: [__dirname + "/views/partials"],
    extname: "hbs",
    defaultLayout: "index"
}));

app.get("/", async (req, res) => {
    const category = "personal";
    try {
        const categoryTodos = await Todo.find({ category }).lean();
        res.render("main", { todos: categoryTodos });
    } catch (err) {
        res.render("main", { todos: [], error: "Failed to get Todo list" });
    }
});

app.get("/todos", async (req, res) => {
    const { category } = req.query;

    try {
        const categoryTodos = await Todo.find({ category }).lean();
        res.render("partials/todos-list", { todos: categoryTodos });
    } catch (err) {
        res.render("main", { todos: [], error: "Failed to get Todo list" });
    }
});


app.post("/todos", async (req, res) => {
    const { category, title } = req.body;

    const newTodo = new Todo({
        task: title,
        category,
    });

    try {
        await newTodo.save();

        const todos = await Todo.find({ category }).lean();

        res.render("partials/todos-list", { todos });
    } catch (err) {
        res.render("main", { todos: [], error: "Failed to create Todo" });
    }
});

app.patch("/todos/:id/complete", async (req, res) => {

    const { id } = req.params;

    try {
        const updatedTodo = await Todo.findOneAndUpdate({ id }, [{ $set: { completed: { $not: "$completed" } } }], { new: true }).lean();
        res.render("partials/todos-item", updatedTodo);
    } catch (err) {
        console.log(err.message)
        res.render("main", { todos: [], error: "Failed to update todo"});
    }
});

app.post('/todos/:id/subtasks', async (req, res) => {
    try {
        const { title } = req.body;
        const todoId = req.params.id;

        // Create a new subtask
        const newSubTask = new SubTask({ title });

        // Save the subtask
        await newSubTask.save();

        // Find the todo and add the subtask
        const updatedTodo = await Todo.findByIdAndUpdate(todoId, {
            $push: { subTasks: newSubTask._id }
        });

        res.render("partials/todos-item", updatedTodo);
    } catch (error) {
        res.render("main", { todos: [], error: "Failed to update todo"});
    }
});

app.patch("/todos/:id/subtasks/:subtaskId/complete", async (req, res) => {

    const { subtaskId } = req.params;

    try {
        const updatedSubtask = await SubTask.findOneAndUpdate({ id: subtaskId }, [{ $set: { completed: { $not: "$completed" } } }], { new: true }).lean();
        res.render("partials/subtasks-item", updatedSubtask);
    } catch (err) {
        console.log(err.message)
        res.render("main", { todos: [], error: "Failed to update subtask"});
    }
});

app.delete("/todos", async (req, res) => {
    const { category } = req.body;

    try {
        await Todo.deleteMany({ category: category, completed: true });

        const categoryTodos = await Todo.find({ category: category }).lean();

        res.render("partials/todos-list", { todos: categoryTodos });
    } catch (err) {
        res.status(500).send("Error deleting todos");
    }
});

app.listen(PORT, () => {

    mongoose.connect('mongodb://localhost:27017/todo')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

    console.log(`Listening to server on port: ${PORT}`);
});