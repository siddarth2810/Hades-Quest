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


//data for todolist1
const itemsSchema = {
  name: String,
};

const progressSchema = {
  progress: {
    type: Number,
    default: 0,
  },
};
const levelSchema = {
  level: {
    type: Number,
    default: 0,
  },
};




//create progress model and save it to the database
const Progress = mongoose.model("Progress", progressSchema);
const level = mongoose.model("level", levelSchema);

const Item = mongoose.model("Item", itemsSchema);

const secondItem = mongoose.model("secondItem", itemsSchema);

const secondProgress = mongoose.model("secondProgress", progressSchema);

const thirdItem = mongoose.model("thirdItem", itemsSchema);

const thirdProgress = mongoose.model("thirdProgress", progressSchema);


const item1 = new Item({
  name: "Minimum of one task is required",
});

const item2 = new secondItem({
  name: "task in the second list",
});

const item3 = new thirdItem({
  name: "task in the third list",
});



//create a progress object and save it to the database
const progress1 = new Progress({
  Number: 0,
});
progress1.save();

const progress2 = new secondProgress({
  Number: 0,
});
progress2.save();

const progress3 = new thirdProgress({
  Number: 0,
});
progress3.save();

const level1 = new level({
  Number: 0,
});
level1.save();

let currentProgress;
let currentProgressValue;
let currentProgress2;
let currentProgressValue2;
let currentProgress3;
let currentProgressValue3;

//render the home page and check whether the database is empty or not
app.get("/", async (req, res) => {
  const foundItems = await Item.find({});
  const secondFoundItems = await secondItem.find({});
  const thirdFoundItems = await thirdItem.find({});
  const levelFound = await level.findOne({});

  //check for first todolist
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

    //check for second todolist
    if (secondFoundItems.length === 0) {
      async function insertItems2() {
        try {
          await secondItem.insertMany(item2);
          console.log("Successfully inserted all items to collections of second todolist");
        } catch (err) {
          console.log(err);
        }
      }
  insertItems2();
    }

    //check for third todolist
    if (thirdFoundItems.length === 0) {
      async function insertItems3() {
        try {
          await thirdItem.insertMany(item3);
          console.log("Successfully inserted all items to collections of third todolist");
        } catch (err) {
          console.log(err);
        }
      }
  insertItems3();
    }


    res.redirect("/");
  } else {
    res.render("home", { tasks: foundItems,
       tasks2: secondFoundItems,
        tasks3: thirdFoundItems, 
      barValue: currentProgressValue, 
      barValue2: currentProgressValue2, 
      barValue3: currentProgressValue3, 
    levelDisplay: levelFound.level });
  }
});

app.get("/gods-page", (req, res) => {
  res.render("gods-page");
})

//post the task into the database when / route is called
app.post("/", async (req, res) => {

  //get the new item from the form for todolist1
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });
  await item.save();



  res.redirect("/");
});


app.post("/secondList", async (req, res) => {
  //get the new item from the form for todolist 2
  const secondItemName = req.body.newItem2;
  const secondPostedItem = new secondItem({
    name: secondItemName,
  });
  await secondPostedItem.save();

  res.redirect("/");
});

app.post("/thirdList", async (req, res) => {
  //get the new item from the form for todolist 3
  const thirdItemName = req.body.newItem3;
  const thirdPostedItem = new thirdItem({
    name: thirdItemName,
  });
  await thirdPostedItem.save();

  res.redirect("/");
}
);

//delete items when /increaseProgressAndDelete route is called and increase the progress bar

app.post("/increaseProgressAndDelete", async (req, res) => {
  //delete the checked item
  const checkedItemId = req.body.checkbox;
 

  //increase the progress value
  currentProgress = await Progress.findOne({});
  currentProgressValue = currentProgress.progress;
  if (currentProgressValue < 100) {
    await Progress.findOneAndUpdate(
      {},
      { $inc: { progress: 10 } },
      { new: true }
    );
    await Item.findByIdAndRemove(checkedItemId);
  }
  
  //if currentprogressvalue, currentprogressvalue2 and currentprogressvalue3 are all 100, then increase the level and reset progress value to 0
  else if (currentProgressValue >= 100 && currentProgressValue2 >= 100 && currentProgressValue3 >= 100) {
    await Progress.findOneAndUpdate({}, { progress: 0 }, { new: true });
    await secondProgress.findOneAndUpdate({}, { progress: 0 }, { new: true });
    await thirdProgress.findOneAndUpdate({}, { progress: 0 }, { new: true });
    await level.findOneAndUpdate({}, { $inc: { level: 1 } }, { new: true });
  }



  res.redirect("/");
});


//second todolist

app.post("/increaseProgressAndDelete2", async (req, res) => {
  //delete the checked item
  const checkedItemId2 = req.body.checkbox2;


  //increase the progress value
  currentProgress2 = await secondProgress.findOne({});
  currentProgressValue2 = currentProgress2.progress;
  if (currentProgressValue2 < 100) {
    await secondProgress.findOneAndUpdate(
      {},
      { $inc: { progress: 10 } },
      { new: true }
    );
    await secondItem.findByIdAndRemove(checkedItemId2);
  }  //if currentprogressvalue, currentprogressvalue2 and currentprogressvalue3 are all 100, then increase the level and reset progress value to 0
  else if (currentProgressValue >= 100 && currentProgressValue2 >= 100 && currentProgressValue3 >= 100) {
    await Progress.findOneAndUpdate({}, { progress: 0 }, { new: true });
    await secondProgress.findOneAndUpdate({}, { progress: 0 }, { new: true });
    await thirdProgress.findOneAndUpdate({}, { progress: 0 }, { new: true });
    await level.findOneAndUpdate({}, { $inc: { level: 1 } }, { new: true });
  }


  res.redirect("/");
})

//third todolist
  app.post("/increaseProgressAndDelete3", async (req, res) => {
    const checkedItemId3 = req.body.checkbox3;
    

    //increase the progress value
    currentProgress3 = await thirdProgress.findOne({});
    currentProgressValue3 = currentProgress3.progress;
    if (currentProgressValue3 < 100) {
      await thirdProgress.findOneAndUpdate(
        {},
        { $inc: { progress: 10 } },
        { new: true }
      );
      await thirdItem.findByIdAndRemove(checkedItemId3);
    } 
     //if currentprogressvalue, currentprogressvalue2 and currentprogressvalue3 are all 100, then increase the level and reset progress value to 0
  else if (currentProgressValue >= 100 && currentProgressValue2 >= 100 && currentProgressValue3 >= 100) {
    await Progress.findOneAndUpdate({}, { progress: 0 }, { new: true });
    await secondProgress.findOneAndUpdate({}, { progress: 0 }, { new: true });
    await thirdProgress.findOneAndUpdate({}, { progress: 0 }, { new: true });
    await level.findOneAndUpdate({}, { $inc: { level: 1 } }, { new: true });
  }
 

    res.redirect("/");
  }
  );

//listen to port 8001
app.listen(8001, () => {
  console.log("Server is running on port 8001");
});
