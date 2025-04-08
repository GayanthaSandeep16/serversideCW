const express = require('express');
const session = require("express-session");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const countryRoutes = require("./routes/country");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

//Routes
app.use("/auth", authRoutes);
app.use("/api", countryRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to server cw XD");
});


sequelize.sync({ force: false }).then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  }).catch(err => console.error('Database sync failed:', err));