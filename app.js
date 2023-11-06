const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const mongoose = require("mongoose");

const db = mongoose.connection;
const Campground = require("./models/campgroud");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.post("/campgrounds", async (req, res) => {
  const campgroud = new Campground(req.body.campground);
  await campgroud.save();
  res.redirect(`/campgrounds/${campgroud.id}`);
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});
