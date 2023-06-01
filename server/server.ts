const express = require('express')
const path = require('path')
const mysql = require('mysql')

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

const database = process.env.DBNAME || 'challenger_db';

const db = mysql.createConnection({
  host: process.env.DBHOST || 'localhost',
  user: process.env.DBUSER || 'dev',
  password: process.env.DBPASS || 'dev',
  database: process.env.DBNAME || 'challenger_db'
});
db.connect();

// Create a GET route
app.get('/server/express_backend', (req, res) => {
  db.query(`SELECT topic FROM challenges WHERE id=1`, function (error, results, fields) {
    if (error) {
      res.send(error);
      console.log(error);

    } else {
      res.send(String(results[0].topic));
    }
  });
});

const root = require('path').join(__dirname, '../build')
app.use(express.static(root));
app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
});

app.get('*', (req, res) => {
  res.send(404);
});
