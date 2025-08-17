const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/Auth.js");
const profileRoutes = require("./routes/profile.js");
const chatRoutes = require("./routes/chat.js");

dotenv.config();


dotenv.config(); // load .env variables

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api/chat", chatRoutes);

// MongoDB Atlas connection
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB, MONGO_CLUSTER, PORT } = process.env;
const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Atlas connected"))
.catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT || 5000, () => console.log(`Server running on port ${PORT || 5000}`));
