const express = require("express");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const { Card, Cart } = require('./mongo');  // Import the models from mongo.js

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


/////////////////////////////////////////////////////
/////      Get cards from db for display        /////
/////////////////////////////////////////////////////

app.get('/cards', async (req, res) => {
    try {
        const cards = await Card.find();  // Fetch all cards from the database
        res.status(200).json(cards);  // Return the cards in JSON format
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

////////////////////////////////////////////////////////////
/////     Handling of all routes POSTS and GETS        /////
////////////////////////////////////////////////////////////

app.post("/", async (req, res) => {
    const { email, password } = req.body

    try {
        const check = await collection.findOne({ email: email })

        if (check) {
            if (check.password === password) {
                res.json("exist");
            } else {
                res.json("wrongPassword")
            }

        }
        else {
            res.json("notexist")
        }

    }
    catch (e) {
        res.json("fail")
    }

})



app.post("/signup", async (req, res) => {
    const { email, password } = req.body

    const data = {
        email: email,
        password: password
    }

    try {
        const check = await collection.findOne({ email: email })

        if (check) {
            res.json("exist")
        }
        else {
            res.json("notexist")
            await collection.insertMany([data])
        }

    }
    catch (e) {
        res.json("fail")
    }

})


/////////////////////////////////////////////////////////
/////       Handling and storing Card Data          /////
/////////////////////////////////////////////////////////


// Serve the static images from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Save uploaded files to 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Ensure unique filenames with timestamp
    }
});

const upload = multer({ storage });

// Route to handle image upload, description, and price
app.post('/card', upload.single('image'), async (req, res) => {
    const { description, price, creatorEmail } = req.body;

    try {
        const newCard = new Card({
            imageUrl: `/uploads/${req.file.filename}`,
            description,
            price,
            creatorEmail
        });

        await newCard.save();
        res.status(201).json({ message: 'Card saved successfully!' });
    } catch (error) {
        console.error('Error saving card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


/////////////////////////////////////////////////////////
/////       Handling all of the cart routes         /////
/////////////////////////////////////////////////////////

// Route to add a card to the cart
app.post('/cart/add', async (req, res) => {
    const { email, cardId, price } = req.body;

    try {
        // Check if the cart exists for the user
        let cart = await Cart.findOne({ email });

        if (cart) {
            // Ensure `items` array exists
            if (!cart.items) {
                cart.items = [];
            }

            // Check if the card is already in the cart
            const itemIndex = cart.items.findIndex(item => item.cardId == cardId);

            if (itemIndex > -1) {
                // If the card is already in the cart, update its quantity
                cart.items[itemIndex].quantity += 1;
            } else {
                // If the card is not in the cart, add it
                cart.items.push({ cardId, quantity: 1, price });
            }
        } else {
            // If the user doesn't have a cart yet, create a new cart with the `items` array
            cart = new Cart({
                email,
                items: [{ cardId, quantity: 1, price }]  // Add the card to the cart
            });
        }

        // Save the cart back to the database
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to fetch the cart for a user
app.get('/cart/:email', async (req, res) => {
    const email = req.params.email;

    try {
        let cart = await Cart.findOne({ email }).populate('items.cardId');
        if (!cart) {
            return res.json({ items: [] });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to update quantity of a specific item in the cart
app.put('/cart/update', async (req, res) => {
    const { email, cardId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ email });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.cardId == cardId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;  // Update the quantity
                await cart.save();
                res.status(200).json(cart);
            } else {
                res.status(404).json({ message: 'Card not found in cart' });
            }
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to remove a specific item from the cart
app.delete('/cart/remove', async (req, res) => {
    const { email, cardId } = req.body;

    try {
        const cart = await Cart.findOne({ email });

        if (cart) {
            cart.items = cart.items.filter(item => item.cardId != cardId);  // Remove the card
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


/////////////////////////////
/////       Profile     /////
/////////////////////////////

// app.js (or backend routes file)
app.get('/profile/cards/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const userCards = await Card.find({ creatorEmail: email });
        res.json(userCards);
    } catch (error) {
        console.error('Error fetching user cards:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


/////////////////////////////////////////////////////////////////////
/////    Configuring and serving express server for docker      /////
/////////////////////////////////////////////////////////////////////     


// Serve static files from the React frontend build directory
app.use(express.static(path.join(__dirname, 'build')));

// Fallback route to serve React frontend for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});




app.listen(8000, () => {
    console.log("port connected");
})

