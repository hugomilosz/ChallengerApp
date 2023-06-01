const express = require('express')
const path = require('path')
const mysql = require('mysql')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')

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
app.get('/uploads/*', async (req, res) => {
  const filename = req.url.split("/").slice(-1)[0]; // Gets the last part of the request
  if (!(process.env.NODE_ENV === "production")) {
    // Local
    const uploadPath = path.join(__dirname, "../uploads")

    console.log(filename);
    res.sendFile(filename, { root: uploadPath });
  } else {

    // Heroku / S3
    const s3 = new S3Client({
      region: "eu-west-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
      }
    });
    const params = { Bucket: process.env.S3_BUCKET_NAME || "challengerdrp", Key: filename };

    s3.send(new GetObjectCommand(params)).then((data) => {
      res.attachment(params.Key);
      res.type(data.ContentType);
      res.send(data.Body.transformToByteArray());
    },
      (error) => {
        console.log(error);

        res.status(200);
        res.end("Error fetching file");
      });
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
