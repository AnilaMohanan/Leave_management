const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const leaveRequestRoutes = require("./routes/leaveRequestRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Make uploaded images accessible
app.use("/images", express.static("images"));

app.use("/api/users", userRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);


// Test route
app.get("/", (req, res) => {
    res.send("Leave Management API is running");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});