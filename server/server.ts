const express = require('express')
const path = require('path')
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

// Create a GET route
app.get('/server/express_backend', (req, res) => {
  console.log("Intercepted right!")
  res.send("BACKEND CONNECTED")
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("/*", (_, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.use(express.static("../build"));

app.get('*', (req, res) => {
  res.send(404);
});