
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

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
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
    });
}

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

console.log("Password hashed successfully");

    res.status(201).json({
        success: true,
        message: "Registration input is valid"
    });
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