
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./models/User");

const mongoose = require("mongoose");
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Authentication API is running!");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API is healthy"
    });
});

app.get("/api/about", (req, res) => {
    res.json({
        "project": "Authentication API using JWT",
        "status": "In development"
    }
    )
});

app.post("/api/test", (req, res) => {
    console.log(req.body);

    res.json({
    success: true,
    message: "Data received successfully",
    receivedData: req.body
});
});


app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Step 1: Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Step 2: Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Step 3: Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Step 4: Check whether email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        // Step 5: Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 6: Create a new user in MongoDB
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Step 7: Send a safe response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        // Handle duplicate email index errors
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });