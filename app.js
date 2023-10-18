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

const tasks = [];
const tasks2 = [];
let progressValue = 0;
let levelValue = 0;

let progressValue2 = 0;


app.get("/", (req, res) => {
  res.render("home", {
    tasks: tasks,
    tasks2: tasks2,
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
  if ((progressValue >= 100) && (progressValue2 >= 100)) {
    
    levelValue += 1;
    progressValue = 0;
    progressValue2 = 0;
  
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
  if ((progressValue >= 100) && (progressValue2 >= 100)) {
    
    levelValue += 1;
    progressValue = 0;
    progressValue2 = 0;
  
  }
  else if (progressValue >= 100) {
 
   }
   else if (progressValue2 >= 100) {
   
   }
  
  else {
    progressValue2 += 20;
    let removeTask2 = req.body.task2;
    tasks2.splice(tasks2.indexOf(removeTask2), 1);
  }



  res.redirect("/");
});

app.listen(8001, () => {
  console.log("Server is running on port 8001"); // Update the port number here
});
