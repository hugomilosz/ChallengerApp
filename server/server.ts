const express = require('express')
const path = require('path')
const mysql = require('mysql')
const aws = require('aws-sdk')

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

const database = process.env.DBNAME || 'challenger_db';

const dbPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DBHOST || 'localhost',
  user: process.env.DBUSER || 'dev',
  password: process.env.DBPASS || 'dev',
  database: process.env.DBNAME || 'challenger_db'
});

// Create a GET route
app.get('/server/express_backend', (req, res) => {
  dbPool.query(`SELECT entryNames FROM challenges WHERE id=1`, function (error, results, fields) {
    if (error) {
      res.send(error);
      console.log(error);

    } else {
      res.send("Beep beep");
    }
  });
});

// Serve up any accesses to the uploads folder
app.get('/uploads/*', (req, res) => {
  if (!process.env.PRODUCTION) {
    const uploadPath = path.join(__dirname, "../uploads")
    const filename = req.url.split("/").slice(-1); // Gets the last part of the request
    console.log(filename);
    res.sendFile(filename[0], { root: uploadPath });
  }
});

const root = path.join(__dirname, '../build')
app.use(express.static(root));
app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
});

app.get('*', (req, res) => {
  res.send(404);
});
