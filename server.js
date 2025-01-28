const express = require('express');
const app = express();
const PORT = 3000; // Change this if needed

// Simulating a database for bookings
const bookings = {};

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to check if a hall is booked for a specific date
app.get('/api/bookings/:date', (req, res) => {
  const { date } = req.params;

  // Check if the hall is booked for the given date
  if (bookings[date]) {
    return res.json({
      booked: true,
      booking: bookings[date],
    });
  }

  // Hall is available
  res.json({ booked: false });
});

// Endpoint to book the hall
app.post('/api/book', (req, res) => {
  const { name, email, date } = req.body;

  // Validate inputs
  if (!name || !email || !date) {
    return res.status(400).json({ error: 'All fields are required: name, email, date' });
  }

  // Check if the date is already booked
  if (bookings[date]) {
    return res.status(400).json({ error: 'This date is already booked' });
  }

  // Save the booking
  bookings[date] = { name, email };
  res.json({ message: 'Hall booked successfully!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
