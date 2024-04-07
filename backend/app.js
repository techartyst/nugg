const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
app.use(express.json());
app.use(cors());

// Set the global variable for the token
global.userId = '';


// Secret key for JWT signing (should be kept secret and not hard-coded)
const secretKey = 'UAE!f0und19-47@';


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
  topic: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  fileName1: {
    type: String,
    required: false,
  },
  fileName2: {
    type: String,
    required: false,
  },
  fileName1: {
    type: String,
    required: false,
  }
  , createdBy: { type: String, required: false, }
  , createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model("Nug", ItemSchema);


// Defining user schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },

});

const User = mongoose.model('User', userSchema);

app.get("/api", (req, res) => {
  res.status(200).send({ response: "api worked.." });
});


app.get("/api/items/:userId", async (req, res) => { // Add a route parameter for userId

  try {
    const userId = req.params.userId; // Extract userId from request parameters
    await Item.find({ createdBy: userId }) // Filter by createdBy field matching userId
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

app.get("/api/items/random/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Fetch the total count of nuggets for the user
    const totalNuggets = await Item.countDocuments({ createdBy: userId });

    // Generate a random index within the range of total nuggets
    const randomIndex = Math.floor(Math.random() * totalNuggets);

    // Find a random nugget for the user
    const randomNugget = await Item.findOne({ createdBy: userId }).skip(randomIndex).exec();

    // Send the random nugget as a response
    res.status(200).send({ response: randomNugget });
  } catch (err) {
    // Handle errors
    res.status(500).send({ response: err.message });
  }
});

app.post("/api/items", async (req, res) => {

  console.log(req.body);

  try {
    const newItem = new Item({
      topic: req.body.name,
      content: req.body.position,
      createdBy: req.body.sessionUser,
      fileName1:"",
      fileName2:"",
      
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
    const itemId = req.params.id;
    const { name, position } = req.body;

    // Construct the update object based on the schema
    const updateObject = {
      topic: name, // Map 'name' from request body to 'topic' in schema
      content: position, // Map 'position' from request body to 'content' in schema
    };

    // Find the document by ID and update it with the constructed update object
    const updatedItem = await Item.findByIdAndUpdate(itemId, updateObject, { new: true });

    if (!updatedItem) {
      return res.status(404).send({ response: "Item not found" });
    }

    // Send the updated document as response
    res.status(200).send({ response: updatedItem });
  } catch (err) {
    // Handle errors
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

app.post('/api/register', async (req, res) => {
  const { username, password, fullname } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, fullname });

    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    // If user not found, return an error
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password stored in the database
    const match = await bcrypt.compare(password, user.password);

    // If passwords don't match, return an error
    if (!match) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // If everything is correct, return a success message
    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
