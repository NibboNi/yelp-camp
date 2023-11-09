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
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      price: price,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore, cumque! Sequi unde id similique fugiat ratione minima corporis hic blanditiis, non est culpa at tempore. Asperiores, nihil consequatur. Deleniti blanditiis aut distinctio, necessitatibus veritatis corrupti ea aliquam facere optio beatae delectus, molestias nam quidem vero debitis consectetur numquam doloremque ducimus.",
      location: `${cities[random].city}, ${cities[random].state}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
});
