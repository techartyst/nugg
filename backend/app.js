const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    const db = await mongoose.connect("mongodb+srv://zamantony:dzKSYeHl5uFffI03@cluster0.nfnpude.mongodb.net/nuroapp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongodb connected ${db.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
connectDB();

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
});
const Item = mongoose.model("Item", ItemSchema);

app.get("/api", (req, res) => {
  res.status(200).send({ response: "api worked.." });
});

app.get("/api/items", async (req, res) => {
  try {
    await Item.find()
      .then((response) => {
        res.status(200).send({ response: response });
      })
      .catch((err) => {
        res.status(500).send({ response: err.message });
      });
  } catch (err) {
    res.status(500).send({ response: err.message });
  }
});


// Define a route to fetch a random item
app.get('/api/items/random', async (req, res) => {
  try {
    const count = await Item.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomItem = await Item.findOne().skip(randomIndex);
    res.json(randomItem);
    //res.status(200).send({ response: response });

  } catch (error) {
    console.error('Error fetching random item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post("/api/items", async (req, res) => {
  try {
    const newItem = new Item({
      name: req.body.name,
      position: req.body.position,
    });
    await newItem
      .save()
      .then((response) => {
        res.status(200).send({ response: response });
      })
      .catch((err) => {
        res.status(500).send({ response: err.message });
      });
  } catch (err) {
    res.status(500).send({ response: err.message });
  }
});

app.put("/api/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send({ response: updatedItem });
  } catch (err) {
    res.status(500).send({ response: err.message });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    await Item.findByIdAndRemove(req.params.id).then((response) => {
      res.status(200).send({ response: req.params.id });
    });
  } catch (err) {
    res.status(500).send({ response: err.message });
  }
});

app.listen(8000, () => {
  console.log(`Server is running on PORT ${8000}`);
});
