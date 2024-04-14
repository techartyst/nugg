const express = require("express");
require('dotenv').config();

const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const dbHost = process.env.DB_HOST;


const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());


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

 const user = await User.findById(req.body.sessionUser );
 user.password = "<masked>";

  try {
    const newItem = new Item({
      topic: req.body.name,
      content: req.body.position,
      createdBy: req.body.sessionUser,
      fileName1:req.body.fileName1,
      fileName2:"",
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


  const userExists = await User.findOne({ username });

  if(!userExists)
{
  
  try {

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, fullname });

    await user.save();
    return res.status(200).json({ message: 'Successfull' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}else{
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

// Handle file upload
app.post('/api/upload', (req, res) => {
  


  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).send('Invalid file type.');
  }

  if (file.size > 5 * 1024 * 1024) {
    return res.status(400).send('File size exceeds the limit.');
  }
  
  const fileName = `${Date.now()}-${file.name}`;

const uploadPath = path.join(__dirname, '..', 'frontend', 'resources', fileName);

file.mv(uploadPath, (err) => {
  if (err) {
    return res.status(500).send(err);
  }

  const renamedFileName = fileName.replace(/\s/g, '_'); // Replace spaces with underscore
  const renamedFilePath = path.join(__dirname, '..', 'frontend', 'resources', renamedFileName);

  fs.rename(uploadPath, renamedFilePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    const fileUrl = `/${renamedFileName}`;
    res.json({ url: fileUrl });
  });
});

});