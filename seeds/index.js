const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const db = mongoose.connection;
const Campground = require("./../models/campgroud");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random].city}, ${cities[random].state}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
});
