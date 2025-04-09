const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});


db.all("SELECT * FROM Users", [], (err, rows) => {
  if (err) {
    console.error("Error querying data:", err.message);
  } else {
    console.log("User data:", rows);
  }
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    }
  });
});