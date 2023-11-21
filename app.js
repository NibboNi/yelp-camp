const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");

const { campgroundSchema } = require("./schemas");

const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

const mongoose = require("mongoose");

const db = mongoose.connection;
const Campground = require("./models/campgroud");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/css")));

const validatesCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((error) => error.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.post(
  "/campgrounds",
  validatesCampground,
  catchAsync(async (req, res) => {
    const campgroud = new Campground(req.body.campground);
    await campgroud.save();
    res.redirect(`/campgrounds/${campgroud.id}`);
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  validatesCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id, {
      ...req.body.campground,
    });
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrog :/\nWomp Womp...";
  res.status(statusCode).render("error", { err });
});
