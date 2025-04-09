const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const countryRoutes = require('./routes/country');
const adminRoutes = require('./routes/admin');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

app.use('/auth', authRoutes);
app.use('/api', countryRoutes);
app.use('/admin', adminRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to server cw XD');
});

async function startServer() {
  try {
    // Disable foreign key checks
    await sequelize.query('PRAGMA foreign_keys = OFF;');

    // Sync the database
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    // Re-enable foreign key checks
    await sequelize.query('PRAGMA foreign_keys = ON;');

    // Start the server
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Database sync failed:', err);
  }
}

startServer();