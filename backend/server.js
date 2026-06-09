const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const patientRoutes = require("./routes/patientRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.post("/test", (req, res) => {
  res.json({
    success: true,
    message: "Test Route Working"
  });
});

// ROUTES
app.use("/api/patients", patientRoutes);
app.use("/api/auth", authRoutes);

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// DEBUG
console.log("Trying MongoDB Connection...");
console.log(process.env.MONGO_URI);

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connected");

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });

})
.catch((err) => {

  console.log("MongoDB Error:");
  console.log(err);

});