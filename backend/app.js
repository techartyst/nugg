const express = require("express");
require('dotenv').config();

const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "duqniw9mo",
  api_key: process.env.CL_APIKEY,
  api_secret: process.env.CL_SECRET,
});

// Set up Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'nugg', // Specify the folder name in Cloudinary
      resource_type: 'auto'       // Automatically detect resource type
  },
});



const dbHost = process.env.DB_HOST;


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://nugg.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", cors());



// Set the global variable for the token
global.userId = '';

// Secret key for JWT signing (should be kept secret and not hard-coded)
const secretKey = process.env.NUGG_SALT;

const connectDB = async () => {
  try {
    const db = await mongoose.connect(dbHost, {
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
  fileName1: { type: String },
fileName2: { type: String }

  , createdBy: { type: String, required: false, }
  , createdUser: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  }
  , createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model("Nugap", ItemSchema);


// Defining user schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },

});

const User = mongoose.model('User', userSchema);


// Defining todo schema
const todoSchema = new mongoose.Schema({
  todo: { type: String, unique: true, required: true },
  date: { type: String, required: true },

});

const ToDo = mongoose.model('ToDo', todoSchema);


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



app.post("/api/items", async (req, res) => {

  const user = await User.findById(req.body.sessionUser);
  user.password = "<masked>";

  try {
    const newItem = new Item({
      topic: req.body.name,
      content: req.body.position,
      createdBy: req.body.sessionUser,
      fileName1: req.body.fileName1,
      fileName2: "",
      createdUser: user

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

app.post("/api/items/:id/archive", async (req, res) => {
  try {
    const { userId } = req.body;

    const deletedItem = await Item.findOneAndDelete({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found or unauthorized" });
    }

    res.status(200).json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});


app.post('/api/register', async (req, res) => {
  const { username, password, fullname } = req.body;


  const userExists = await User.findOne({ username });

  if (!userExists) {

    try {

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, fullname });

      await user.save();
      return res.status(200).json({ message: 'Successfull' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(500).json({ message: 'User exists' });

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
    const token = jwt.sign({ id: user.id, fullname: user.fullname }, secretKey);
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define allowed file types
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

// File filter for checking file types
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type.'), false);
    }
};

// Multer configuration using Cloudinary
const parser = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'nugg',
      resource_type: 'auto'
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: fileFilter
});

app.post('/api/upload', parser.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  

  res.send({
    message: 'File uploaded successfully',
    fileDetails: req.file,
    url: req.file.path // Assuming path is the URL where the file is stored in Cloudinary
  });
}, (error, req, res, next) => { // Error handling middleware for Multer
  if (error instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File size exceeds the 5MB limit.');
    }
    return res.status(500).send(error.message);
  } else if (error) {
    // An unknown error occurred when uploading.
    if (error.message === 'Invalid file type. (Jpeg, Png, Gif, Pdf accepted!') {
      return res.status(400).send('Invalid file type.');
    }
    return res.status(500).send('Unknown error during file upload.');
  }
});
