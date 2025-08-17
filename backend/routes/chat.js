const express = require("express");
const axios = require("axios"); // <-- ADD THIS LINE
const router = express.Router();

router.post("/", async (req, res) => {
  const { message, userProfile } = req.body;

  try {
    const mlResponse = await axios.post("http://localhost:5001/chat", { 
      message,
      userProfile
    });

    res.json({ reply: mlResponse.data.reply });
  } catch (error) {
    console.error("Error calling ML service:", error.message);
    res.status(500).json({ reply: "Sorry, I couldn’t process your request." });
  }
});

module.exports = router;
