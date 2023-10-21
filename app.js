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

mongoose.connect('mongodb://localhost:27017/HadesDB', {useNewUrlParser: true, useUnifiedTopology: true});


const itemsSchema = {
  name: String,
 
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Minimum of one task is required",
 
});




app.get("/", async (req, res) => {
  const foundItems = await Item.find({});
  if (foundItems.length === 0) {
    async function insertItems() {
      try {
        await Item.insertMany(item1);
        console.log("Successfully inserted all items from DB");
      } catch (err) {
        console.log(err);
      }
    }

    insertItems();
    res.redirect("/");
  } else {
    res.render("home", { tasks: foundItems });
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


//delete items when /increaseProgressAndDelete route is called

app.post("/increaseProgressAndDelete", async (req, res) => {
  const checkedItemId = req.body.checkbox;
  const foundItem = await Item.findByIdAndRemove(checkedItemId);
  console.log(foundItem);
  res.redirect("/");
});


app.listen(8001, () => {
  console.log("Server is running on port 8001");
});
