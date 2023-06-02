const express = require('express')
const path = require('path')
const mysql = require('mysql')
const multer = require('multer')
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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

app.get('/server/challenges', (req, res) => {
  dbPool.query('SELECT * FROM challenges LIMIT 10', function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching challenges');
    } else {
      res.json(results);
    }
  });
});

// Return queries about challenges
app.get('/server/challenge/:chId', (req, res) => {
  const id = req.params.chId;
  dbPool.query(`SELECT * FROM challenges WHERE id=${id}`, function (error, results, fields) {
    if (error) {
      res.send(error);
      console.log(error);
    } else {
      res.json(results[0]);
    }
  })
});

// Create challenge when appropriate formdata is supplied
app.post('/server/createChallenge', multer().single('file'), (req, res) => {
  // console.log(req.file);
  // console.log(req.body);
  // console.log(req.body.name);
  // console.log(req.body.desc);

  // Quick bodge: upload the file, put its name in the Topic part of the db
  if (!(process.env.NODE_ENV === "production")) {
    const filepath = path.join(__dirname, '../uploads', req.file.originalname);
    const fs = require('fs');
    fs.writeFile(filepath, req.file.buffer, (err) => { });
  } else {
    // Heroku / S3
    const s3 = new S3Client({
      region: "eu-west-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
      }
    });
    const params = {
      Bucket: process.env.S3_BUCKET_NAME || "challengerdrp",
      Key: req.file.originalname,
      Body: req.file.buffer
    };

    s3.send(new PutObjectCommand(params)).then(async (response) => {
      console.log(response);
    },
      (error) => {
        console.log(error);

        res.status(200);
        res.send("Error putting file");
      });
  }
  // Now to update the database
  dbPool.query("SELECT COUNT(*) FROM challenges", function (error, results, fields) {
    if (error) {
      res.status(200);
      res.end("Error putting file");
    } else {
      const newId = Number(results[0][`COUNT(*)`]) + 1;
      dbPool.query(`INSERT INTO challenges (\`id\`, \`name\`, \`description\`, \`topic\`, \`entryNames\`, \`entryType\`) VALUES ('${newId}', '${req.body.name}', '${req.body.desc}', '${req.file.originalname}', '', 'Image');`, function (error, results, fields) {
        if (error) {
          console.log(error);

          res.status(500);
          res.send("Error updating DB");
        } else {
          res.status(200);
          res.send();
        }
      });
    }
  })

})

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

    s3.send(new GetObjectCommand(params)).then(async (data) => {
      res.attachment(params.Key);
      res.type(data.ContentType);
      await data.Body.pipe(res);
    },
      (error) => {
        console.log(error);

        res.status(200);
        res.end("Error fetching file");
      });
  }
});

// Serve up the URL of uploads
app.get('/uploadsURL/*', async (req, res) => {
  const filename = req.url.split("/").slice(-1)[0]; // Gets the last part of the request
  if (!(process.env.NODE_ENV === "production")) {
    // Local
    const uploadPath = path.join(__dirname, "../uploads", filename)

    console.log(filename);
    res.send(uploadPath);
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

    s3.send(new GetObjectCommand(params)).then(async (data) => {
      res.send(await getSignedUrl(s3, data, { expiresIn: 3600 }));
    },
      (error) => {
        console.log(error);

        res.status(200);
        res.end("Error fetching file");
      });
  }
});

// Handle POSTs to the upload of challenge submissions
app.post("/uploadImg", (req, res) => {
  //
});

const root = path.join(__dirname, '../build')
app.use(express.static(root));

// app.get('/login', (req, res) => {
//   res.sendFile(__dirname + '../src/index.html');
// });
app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
});

app.get('*', (req, res) => {
  res.send(404);
});
