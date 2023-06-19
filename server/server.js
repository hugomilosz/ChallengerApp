const express = require('express')
const path = require('path')
const mysql = require('mysql')
const multer = require('multer')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto')
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const session = require('express-session');

const SQLiteStore = require('connect-sqlite3')(session);

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

passport.use(new LocalStrategy(function verify(username, password, cb) {
  dbPool.query(`SELECT * FROM users WHERE username = ?`, [username], function (error, results, field) {
    if (error) {
      console.log(error);
      return cb(error);
    }
    if (results.length === 0) {
      return cb(null, false, { message: "Incorrect Username or Password" });
    }

    // Hashes the password and queries
    const row = results[0];
    crypto.pbkdf2(password, Buffer.from(row.salt, "hex"), 310000, 32, 'sha256', (err, derivedKey) => {
      if (err) {
        return cb(err);
      }
      if (!crypto.timingSafeEqual(Buffer.from(row.hashed_password, "hex"), derivedKey)) {
        return cb(null, false, { message: "Incorrect Username or Password" });
      }
      return cb(null, row);
    });
  });
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSIONSECRET || 'hello gordon!',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: '.' })
}));
app.use(passport.authenticate('session'));

// Create a GET route
app.get('/server/express_backend', (req, res) => {
  if (req.user) { res.send(req.user); }
  else { res.send("Nothin'") }
});

app.get('/server/isLoggedIn', (req, res) => {
  if (req.user) { res.status(200).send(req.user); }
  else { res.status(204).send("Not logged in"); }
});

app.get('/server/challenges', (req, res) => {
  dbPool.query('SELECT * FROM challenges LIMIT 20', function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching challenges');
    } else {
      res.json(results);
    }
  });
});

app.post('/server/logOut', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("Error logging out?");
      return;
    }
    res.redirect("/");
  });
});

// Return queries about challenges
app.get('/server/challenge/:chId', (req, res) => {
  const id = req.params.chId;
  dbPool.query(`SELECT * FROM challenges WHERE id= ?`, [id], function (error, results, fields) {
    if (error) {
      res.send(error);
      console.log(error);
    } else {
      res.json(results[0]);
    }
  })
});

// Return search queries for challenges
app.get('/server/search/:terms', (req, res) => {
  const terms = decodeURI(req.params.terms);
  const safeTerms = dbPool.escape(terms).slice(1, -1);
  dbPool.query(`
    SELECT * 
    FROM challenges 
    WHERE (MATCH(name, description, tags)
    AGAINST ('${safeTerms}' IN NATURAL LANGUAGE MODE))
    OR (name LIKE '%${safeTerms}%') 
    OR (description LIKE '%${safeTerms}%') 
    OR (tags LIKE '${safeTerms}');
  `, function (error, results, fields) {
    if (error) {
      res.send(error);
      console.log(error);
    } else {
      res.json(results);
    }
  })
})

// Create challenge when appropriate formdata is supplied
app.post('/server/createChallenge', multer().single('file'), (req, res) => {
  // console.log(req.file);
  // console.log(req.body);
  // console.log(req.body.name);
  // console.log(req.body.desc);

  dbPool.query("SELECT MAX(id) FROM challenges", function (error, results, fields) {
    if (error) {
      res.status(500);
      res.end("Error putting file");
    } else {
      const newId = Number((results[0][`MAX(id)`])) + 1;

      const fileName = `${newId}_0.` + req.file.originalname.split(".").pop();
      uploadFile(fileName, req.file.buffer);

      dbPool.query(`INSERT INTO challenges (\`id\`, \`name\`, \`subject\`, \`description\`, \`topic\`, \`entryNames\`, \`entryType\`, \`tags\`, \`date\`, \`username\`, \`archived\`) VALUES (?, ?, ?, ?, ?, '', 'Image', ?, ?, ?, FALSE);`, [newId, req.body.name, req.body.ctgr, req.body.desc, fileName, req.body.tags, req.body.date, req.body.username], function (error, results, fields) {
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
    const uploadPath = path.join("http://localhost:5000", "../uploads", filename)
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
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.send(url);
  }
});

// Uploads a file either locally or to S3
function uploadFile(newName, fileBuffer) {
  if (!(process.env.NODE_ENV === "production")) {
    const filepath = path.join(__dirname, '../uploads', newName);
    const fs = require('fs');
    fs.writeFile(filepath, fileBuffer, (err) => { });
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
      Key: newName,
      Body: fileBuffer
    };

    s3.send(new PutObjectCommand(params)).then(async (response) => {
      console.log(response);
    },
      (error) => {
        console.log(error);

        res.status(500);
        res.send("Error putting file");
      });
  }
}

// Handle POSTs to the upload of challenge submissions
app.post("/server/uploadImg", multer().single('file'), (req, res) => {
  // File buffer is req.file.buffer

  // Now to update the database
  dbPool.query(`SELECT entryNames FROM challenges WHERE id= ?`, [req.body.chId], function (error, results, fields) {
    if (error) {
      res.status(500);
      res.end("Error find challenge");
    } else {
      const numSubmissions = results[0].entryNames === "" ? 0 : results[0].entryNames.split(",").length;
      const fileName = `${req.body.chId}_${numSubmissions + 1}.` + req.file.originalname.split(".").pop();

      // The file name is ID_SUBMISSIONNUMBER.ext
      uploadFile(fileName, req.file.buffer);

      // insert fileName into submissions table
      dbPool.query(`INSERT INTO submissions (\`likeCount\`, \`hahaCount\`, \`smileCount\`, \`wowCount\`, \`sadCount\`, \`angryCount\`, \`username\`, \`filename\`, \`winner\`) VALUES (0, 0, 0, 0, 0, 0, ?, ?, FALSE);`, [req.user.username, fileName], function (error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500);
          res.send("Error updating DB");
        } else {
          res.status(200);
          res.send();
        }
      });


      const entryNames = results[0].entryNames === "" ? fileName : results[0].entryNames + "," + fileName;
      dbPool.query(`UPDATE challenges SET entryNames = "${entryNames}" WHERE id=${req.body.chId}`, function (error, results, fields) {
        if (error) {
          console.log(error);
          res.status(500);
          res.end("Error updating database");
        } else {
          res.status(200);
          res.send();
        }
      });
    }
  });
});

// Get category for a challenge (with ID chId)
app.get('/category/:chId', (req, res) => {
  const challId = req.params.chId;
  dbPool.query(`SELECT subject FROM challenges WHERE id=${challId}`, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500);
      res.end("Error getting category from database");
    } else {
      res.status(200);
      res.send(results[0]);
    }
  });
});

// TO GET THE NUMBER OF THE CERTAIN REACTION
app.get('/viewReactions/:fileName/:reactionName', (req, res) => {
  const fileName = req.params.fileName;
  const reactionName = req.params.reactionName;
  dbPool.query(`SELECT ${reactionName} FROM submissions WHERE filename='${fileName}'`, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500);
      res.end("Error updating database (reaction numbers)");
    } else {
      res.status(200);
      res.send(results);
    }
  });
});

// For a certain challenge, get the list of submissions that the logged-in user has liked
app.get('/server/getLikes/:challengeId', (req, res) => {
  const id = req.params.challengeId;
  if (!req.user) {
    res.status(500).end("Must be logged in to view likes");
    return;
  }

  dbPool.query(`SELECT entryNames FROM challenges WHERE id = '${id}'`, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).end("Boogly moogly, what an error!");
      return;
    }

    if (results[0].entryNames.length === 0) {
      console.log("Sending empty list");
      res.status(200).json([]);
    } else {
      dbPool.query(`SELECT filename FROM likes WHERE username = '${req.user.username}' AND filename IN (${dbPool.escape(results[0].entryNames.split(','))})`,
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).end("Errar");
          }
          res.status(200).json(results.map((row) => { return row.filename }));
        });
    }
  });
});

// For a certain challenge, get the list of reactions for each post the logged-in user has reacted to
app.get('/server/getReacts/:challengeId', (req, res) => {
  const id = req.params.challengeId;
  if (!req.user) {
    res.status(500).end("Must be logged in to view likes");
    return;
  }

  dbPool.query(`SELECT entryNames FROM challenges WHERE id = '${id}'`, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).end("Holy Moly, what an error!");
      return;
    }

    if (results[0].entryNames.length === 0) {
      console.log("Sending empty list");
      res.status(200).json([]);
    } else {
      dbPool.query(`SELECT * FROM reactions WHERE username = '${req.user.username}' AND filename IN (${dbPool.escape(results[0].entryNames.split(','))})`,
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).end("Errarier");
          }
          res.status(200).json(results);
        });
    }
  });
});

// TO INCREMENT THE NUMBER OF THE REACTION
app.post('/updateReactions/inc/:fileName/:reactionName', (req, res) => {
  const fileName = req.params.fileName;
  const reactionName = req.params.reactionName;
  dbPool.query(`UPDATE submissions SET ${reactionName} = ${reactionName} + 1 WHERE filename = '${fileName}'`, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500);
      res.end("Error updating database (reaction numbers)");
    } else {
      if (req.params.reactionName === 'likeCount') {
        // Then add to the Likes DB
        dbPool.query(`INSERT INTO likes (\`username\`, \`filename\`) VALUES ('${req.user.username}', '${fileName}')`, function (error, results,) {
          if (error) {
            console.log(error);
            res.status(500);
          }
          res.status(200);
          res.send("Like count incremented successfully");
        });
      }
      else {
        // Add to the reactions DB
        dbPool.query(`INSERT INTO reactions (\`username\`, \`filename\`, \`reaction\`) VALUES ('${req.user.username}', '${fileName}', '${reactionName}')`, function (error, results,) {
          if (error) {
            console.log(error);
            res.status(500);
          }
          res.status(200);
          res.send(`${reactionName} count incremented successfully`);
        });
      }
    }
  });
});

// TO DECREMENT THE NUMBER OF THE REACTION
app.post('/updateReactions/dec/:fileName/:reactionName', (req, res) => {
  const fileName = req.params.fileName;
  const reactionName = req.params.reactionName;
  dbPool.query(`UPDATE submissions SET ${reactionName} = ${reactionName} - 1 WHERE filename = '${fileName}'`, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500);
      res.end("Error updating database (reaction numbers)");
    } else {
      if (req.params.reactionName === 'likeCount') {
        // Then remove from the Likes DB
        dbPool.query(`DELETE FROM likes WHERE username = '${req.user.username}' AND filename = '${fileName}'`, function (error, results,) {
          if (error) {
            console.log(error);
            res.status(500);
          }
          res.status(200);
          res.send("Like count decremented successfully");
        });
      }
      else {
        // Remove from the reactions DB
        dbPool.query(`DELETE FROM reactions WHERE username = '${req.user.username}' AND filename = '${fileName}'`, function (error, results,) {
          if (error) {
            console.log(error);
            res.status(500);
          }
          res.status(200);
          res.send(`${reactionName} count decremented successfully`);
        });
      }
    }
  });
});

// Setting the winner of the challenge
app.post('/selectWinner/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  dbPool.query(`UPDATE submissions SET winner = TRUE WHERE filename = '${fileName}'`, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500);
      res.end("Error updating database (setting winner)");
    } else {
      res.status(200);
      res.send("Successfully chosen winner!");
    }
  });
});

app.get('/server/isOwner/:challengeId', (req, res) => {
  dbPool.query(`SELECT username FROM challenges WHERE id = '${req.params.challengeId}'`, (error, results, fields) => {
    if (error || !req.user || req.user.username !== results[0].username) {
      res.send('../winnerPending');
    } else {
      res.send('../chooseWinner')
    }
  });
});

app.get('/server/isOwner/:challengeId/empty', (req, res) => {
  dbPool.query(`SELECT username FROM challenges WHERE id = '${req.params.challengeId}'`, (error, results, fields) => {
    if (error || !req.user || req.user.username !== results[0].username) {
      res.send('../noSubsPending');
    } else {
      res.send('../noSubmissions')
    }
  });
});

// Get the winner of a challenge
app.get('/getWinner/:challengeId', (req, res) => {
  const challengeId = req.params.challengeId;

  dbPool.query(`
    SELECT * 
    FROM submissions 
    WHERE 
      winner = 1 
      AND 
      FIND_IN_SET(filename, (SELECT entryNames
                             FROM challenges
                             WHERE id = ${challengeId}))
    `, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500);
      res.end("Error getting winner from database");
    } else {
      res.status(200);
      console.log("This is the DB result: " + results[0]);
      res.send(results[0]);
    }
  });
});

app.post('/extendDeadline/:challengeId/:newDeadline', (req, res) => {
  const challengeId = req.params.challengeId;
  const newDeadline = req.params.newDeadline;

  dbPool.query(`UPDATE challenges SET date="${newDeadline}" WHERE id=${challengeId}`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500);
        res.end("Error updating database (extending the deadline)");
      } else {
        res.status(200);
        res.send("Successfully extended the deadline!");
      }
    });
});

app.post('/deleteChallenge/:challengeId/', (req, res) => {
  const challengeId = req.params.challengeId;

  dbPool.query(`DELETE FROM challenges WHERE id=${challengeId}`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500);
        res.end("Error deleting the challenge");
      } else {
        res.status(200);
        res.send("Successfully deleted the challenge!");
      }
    });
});

// Mark a challenge as archived
app.post('/setArchived/:challengeId', (req, res) => {
  const chId = req.params.challengeId;
  dbPool.query(`UPDATE challenges SET archived=TRUE WHERE id=${chId}`, function (error, results, fields) {
    if (error) {
      res.send(error);
      console.log(error);
    } else {
      res.json(results);
    }
  })
});

// Check if a challenge is archived
app.get('/checkArchived/:challengeId', (req, res) => {
  const chId = req.params.challengeId;
  dbPool.query(`SELECT archived FROM challenges WHERE id=${chId}`, function (error, results, fields) {
    if (error) {
      res.send(error);
      console.log(error);
    } else {
      res.json(results[0]);
    }
  })
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

app.post("/login/password", passport.authenticate("local"), (req, res) => {
  res.json({ success: true });
});


app.post("/signup", (req, res, next) => {
  dbPool.query(`SELECT * FROM users WHERE username='${req.body.username}'`, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500);
      res.end("Error accessing user table");
      return;
    }
    if (results.length !== 0) {
      res.status(500);
      res.end("Username already taken!");
      return;
    }

    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, "sha256", (error, hashed_password) => {
      if (error) {
        console.log(error);
        res.status(500);
        res.end("Error in Crypto function");
        return;
      }
      dbPool.query(`INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)`, [req.body.username, hashed_password.toString("hex"), salt.toString("hex")], (error, results) => {
        if (error) {
          console.log(error);
          res.status(500);
          res.end("Error updating DB!");
          return;
        }
        const user = {
          id: this.lastID,
          username: req.body.username
        };
        req.login(user, (err) => {
          if (err) {
            console.log(error);
            res.status(500);
            res.end("Failed to login!");
            return;
          }
          res.redirect("/");
        })
      });
    });
  });
});

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});