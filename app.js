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

const mongoose = require("mongoose");
const { type } = require("os");

mongoose.connect("mongodb://localhost:27017/HadesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = {
  name: String,
};

const progressSchema = {
  progress: {
    type: Number,
    default: 0,
  },
};

//create progress model and save it to the database
const Progress = mongoose.model("Progress", progressSchema);

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Minimum of one task is required",
});

//create a progress object and save it to the database
const progress1 = new Progress({
  Number: 0,
});
progress1.save();

let currentProgress;
let currentProgressValue;

//render the home page and check whether the database is empty or not
app.get("/", async (req, res) => {
  const foundItems = await Item.find({});
  if (foundItems.length === 0) {
    async function insertItems() {
      try {
        await Item.insertMany(item1);
        console.log("Successfully inserted all items to collections");
      } catch (err) {
        console.log(err);
      }
    }

    insertItems();
    res.redirect("/");
  } else {
    res.render("home", { tasks: foundItems, barValue: currentProgressValue });
  }
});

//post the task into the database when / route is called
app.post("/", async (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });
  await item.save();
  res.redirect("/");
});

//delete items when /increaseProgressAndDelete route is called and increase the progress bar

app.post("/increaseProgressAndDelete", async (req, res) => {
  //delete the checked item
  const checkedItemId = req.body.checkbox;
  const foundItem = await Item.findByIdAndRemove(checkedItemId);

  //increase the progress value
  currentProgress = await Progress.findOne({});
  currentProgressValue = currentProgress.progress;
  if (currentProgressValue < 100) {
    await Progress.findOneAndUpdate(
      {},
      { $inc: { progress: 10 } },
      { new: true }
    );
  } else {
    await Progress.findOneAndUpdate({}, { progress: 0 }, { new: true });
  }

  res.redirect("/");
});

//listen to port 8001
app.listen(8001, () => {
  console.log("Server is running on port 8001");
});
