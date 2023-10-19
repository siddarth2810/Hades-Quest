//jslint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { title } = require("process");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

let levelValue = 0;
const tasks = [];
const tasks2 = [];
const tasks3 = [];
let progressValue = 0;
let progressValue2 = 0;
let progressValue3 = 0;


app.get("/", (req, res) => {
  res.render("home", {
    tasks: tasks,
    tasks2: tasks2,
    tasks3: tasks3,
    barValue3: progressValue3,
    barValue2: progressValue2,
    barValue: progressValue,
    levelDisplay: levelValue,
  });
});

//todolist 1
app.post("/", (req, res) => {
  let getTask = req.body.taskTest;

  tasks.push(getTask);
  res.redirect("/");
});

app.post("/increaseProgress", (req, res) => {
  if (progressValue >= 100 && progressValue2 >= 100  && progressValue3 >= 100) {
    levelValue += 1;
    progressValue = 0;
    progressValue2 = 0;
    progressValue3 = 0;
    let removeTask = req.body.task;
    tasks.splice(tasks.indexOf(removeTask, 1));
  } else if (progressValue >= 100) {
    console.log("complete task 2 first");
  } else {
    progressValue += 20;
    let removeTask = req.body.task;
    tasks.splice(tasks.indexOf(removeTask), 1);
  }
  res.redirect("/");
});

//todolist 2
app.post("/addTask2", (req, res) => {
  let getTask2 = req.body.taskTest2;

  tasks2.push(getTask2);
  res.redirect("/");
});

app.post("/increaseProgress2", (req, res) => {
  if (progressValue >= 100 && progressValue2 >= 100  && progressValue3 >= 100) {
    levelValue += 1;
    progressValue = 0;
    progressValue2 = 0;
    progressValue3 = 0;
    let removeTask2 = req.body.task2;
    tasks2.splice(tasks2.indexOf(removeTask2), 1);
  } else if (progressValue2 >= 100) {
    console.log("complete task 1 first");
  } else {
    progressValue2 += 20;
    let removeTask2 = req.body.task2;
    tasks2.splice(tasks2.indexOf(removeTask2), 1);
  }
  res.redirect("/");
});

//todolist 3
app.post("/addTask3", (req, res) => {
  let getTask3 = req.body.taskTest3;

  tasks3.push(getTask3);
  res.redirect("/");
});

app.post("/increaseProgress3", (req, res) => {
  if (progressValue >= 100 && progressValue2 >= 100 && progressValue3 >= 100) {
    levelValue += 1;
    progressValue = 0;
    progressValue2 = 0;
    progressValue3 = 0;

    let removeTask3 = req.body.task3;
    tasks3.splice(tasks3.indexOf(removeTask3), 1);
  } else if (progressValue3 >= 100 ) {
    console.log("complete task 1 first");
  } else {
    progressValue3 += 20;
    let removeTask3 = req.body.task3;
    tasks3.splice(tasks3.indexOf(removeTask3), 1);
  }
  res.redirect("/");
});


app.listen(8001, () => {
  console.log("Server is running on port 8001");
});
