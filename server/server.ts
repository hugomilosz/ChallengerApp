const express = require('express')
const path = require('path')
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

// Create a GET route
app.get('/server/express_backend', (req, res) => {
  console.log("Intercepted right!")
  res.send("BINGUS CONNECTED")
});

const root = require('path').join(__dirname, '../build')
app.use(express.static(root));
app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
});

app.get('*', (req, res) => {
  res.send(404);
});
