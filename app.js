const express = require('express');
const session = require('express-session');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const countryRoutes = require('./routes/country');
const adminRoutes = require('./routes/admin');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
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

// Add login page route
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.get('/', (req, res) => {
  res.send('Welcome to server cw XD');
});

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error('Database sync failed:', err));