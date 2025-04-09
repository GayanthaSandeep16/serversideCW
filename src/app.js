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
    origin: 'http://localhost:3001', // change this to your frontend URL
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/auth', authRoutes);
app.use('/api', countryRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to server cw XD');
});

sequelize
  .sync({ alter: true }) // This updates the schema to match the model
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error('Database sync failed:', err));