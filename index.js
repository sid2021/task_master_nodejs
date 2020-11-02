const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const Todo = require("./models/Todo");

app.use(express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

mongoose.connect(
  process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to db");

    app.listen(3000, () => {
      console.log("Server up and running");
    });
  }
);

app.get("/", (req, res) => {
  Todo.find({}, (error, foundTodos) => {
    res.render("todo.ejs", { todos: foundTodos });
  });
});

app.post("/", async (req, res) => {
  let newTodo = new Todo({
    content: req.body.content,
  });
  try {
    await newTodo.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app
  .route("/update/:id")
  .get((req, res) => {
    const id = req.params.id;
    Todo.find({}, (error, foundTodos) => {
      res.render("todoUpdate.ejs", { todos: foundTodos, updateId: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    Todo.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

app.route("/delete/:id").get((req, res) => {
  const id = req.params.id;
  Todo.findByIdAndRemove(id, (error) => {
    if (error) return res.send(500, error);
    res.redirect("/");
  });
});
