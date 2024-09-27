// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize the Express app
const app = express();

// Use JSON middleware to parse the request body
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://<user>:<password>@cluster0.9u5cj.mongodb.net/<db-name>")
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log("Failed to connect to MongoDB", err);
});


/////////////////////////////////////////////////////////////////
/////       Creating and handling of the db's schemas       /////
/////////////////////////////////////////////////////////////////


    // Define the schema for users
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create the model
const User = mongoose.model("User", userSchema);

// Define the card schema
const cardSchema = new mongoose.Schema({
    imageUrl: String,    // URL for the image
    description: String, // Description for the card
    price: Number,        // Price of the card
    creatorEmail: {type: String, required: true} // Creator of the cards Email
});

const Card = mongoose.model('Card', cardSchema);


// Cart schema
const cartSchema = new mongoose.Schema({
    email: { type: String, required: true },  // User email to identify the cart owner
    items: [
        {
            cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Cart, Card };


////////////////////////////////////////////////////////////
/////   Routes that need information to and from db    /////
////////////////////////////////////////////////////////////


// route to handle the login
app.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email: email });
        if (user) {
            if (user.password === password) {
                return res.json("exist");
            } else {
                return res.json("wrongPassword");
            }
        } else {
            return res.json("notexist");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("An error occurred");
    }
});


// Route to handle the signup
app.post("/signup", async (req, res) => {
    console.log("Request received: ", req.body);

    const { email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists: ", email);
            return res.json("exist");
        }

        // If user doesn't exist, create a new user
        const newUser = new User({ email, password });
        await newUser.save();
        console.log("New user saved: ", newUser);

        res.json("notexist");
    } catch (err) {
        console.log("Error saving user: ", err);
        res.status(500).json("An error occurred");
    }
});


// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
