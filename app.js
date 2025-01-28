
/*
// Importing necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/marriageHallBooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose Schema and Model
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fetch bookings for a specific date
app.get('/api/bookings/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const booking = await Booking.findOne({ date });

    if (booking) {
      res.json({ booked: true, booking });
    } else {
      res.json({ booked: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking information' });
  }
});

// Book the hall
app.post('/api/book', async (req, res) => {
  const { name, email, date } = req.body;

  try {
    const existingBooking = await Booking.findOne({ date });

    if (existingBooking) {
      return res.status(400).json({ error: 'The hall is already booked for this date' });
    }

    const booking = new Booking({
      name,
      email,
      date
    });

    await booking.save();
    res.json({ message: 'Hall booked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to book the hall' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});






*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/marriageHallBooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins temporarily
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose Schema and Model
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String
});
const Booking = mongoose.model('Booking', bookingSchema);

// API Routes
app.get('/api/bookings/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const booking = await Booking.findOne({ date });
    if (booking) {
      res.json({ booked: true, booking });
    } else {
      res.json({ booked: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking information' });
  }
});

app.post('/api/book', async (req, res) => {
  const { name, email, date } = req.body;
  try {
    const existingBooking = await Booking.findOne({ date });
    if (existingBooking) {
      return res.status(400).json({ error: 'The hall is already booked for this date' });
    }
    const booking = new Booking({ name, email, date });
    await booking.save();
    res.json({ message: 'Hall booked successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to book the hall' });
  }
});

// Serve Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server (not required for Vercel, but works locally)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app; // Required for Vercel

