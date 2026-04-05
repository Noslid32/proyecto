const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allows your React app to send requests here
app.use(express.json()); // Allows the server to understand JSON data

// Your very first API Route!
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from the ROOMAI Backend!" });
});

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running beautifully on http://localhost:${PORT}`);
});