//jslint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { title } = require('process');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const tasks = []
let progressValue= 0;



app.get('/', (req, res) => {
  res.render('home', {tasks: tasks, barValue: progressValue});
 
});



app.post('/', (req, res) => {
  let getTask = req.body.taskTest
  

  tasks.push(getTask);

  res.redirect('/');
});

app.post('/increaseProgress', (req, res) => {

 if (progressValue > 100) {
   progressValue = 0;}
  else {
    progressValue += 10;
  }
  
  res.redirect('/');
});






app.listen(8000, () => {
    console.log('Server is running on port 8000'); // Update the port number here
});
