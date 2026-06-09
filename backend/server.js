const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

const patientRoutes = require("./routes/patientRoutes");
const authRoutes = require("./routes/authRoutes");

const PORT = process.env.PORT || 5000;
const { MONGO_URI, JWT_SECRET } = process.env;

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

const invalidEnv = [];

if (!MONGO_URI || MONGO_URI === "your_mongodb_connection_string") {
  invalidEnv.push("MONGO_URI");
}

if (!JWT_SECRET || JWT_SECRET === "replace_with_a_long_random_secret") {
  invalidEnv.push("JWT_SECRET");
}

if (invalidEnv.length > 0) {
  console.error(`Missing or placeholder environment value(s): ${invalidEnv.join(", ")}`);
  console.error("Add real values to backend/.env before starting the server.");
  process.exit(1);
}

console.log("Trying MongoDB Connection...");

// DATABASE CONNECTION
mongoose.connect(MONGO_URI)
.then(() => {

  console.log("MongoDB Connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

})
.catch((err) => {

  console.log("MongoDB Error:");
  console.log(err.message);

});
