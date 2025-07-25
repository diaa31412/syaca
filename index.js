const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/db');
const dotenv= require('dotenv');
const cookieParser = require('cookie-parser');
const db = require('./models/indexModel');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const videoRoutes = require('./routes/videoRoutes');
const cardRoutes = require('./routes/cardRoutes');
const subscribeRoutes = require('./routes/subscriberRoutes');
const path = require('path');
dotenv.config();

app.use(cors({
 origin:  ['http://localhost:8080', 'http://127.0.0.1:5173', 'https://syaca.onrender.com'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/videos', express.static('uploads/videos'));
app.use('/images', express.static('uploads/images'));


  






// Sync models (optional during development)
db.sequelize.sync({ alter: true }) // or { force: true } to drop & recreate tables
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });


  const session = require('express-session');

app.use(
  session({
    secret: process.env.JWT_SECRET , // use .env in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);


// Use router users
app.use('/api/users', userRoutes);
// Use router Courses
app.use('/api/courses', courseRoutes);
// Use router Videos
app.use('/api/videos', videoRoutes);
//Use router Card
app.use('/api/cards', cardRoutes);

// Use router subscriber
app.use('/api/subscriptions', subscribeRoutes)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
