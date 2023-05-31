const express = require('express')
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

// Create a GET route
app.get('/server/express_backend', (req, res) => {
  res.send("BACKEND CONNECTED")
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("/*", (_, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.get('/*', (req, res) => {
  console.log(req.originalUrl)
  res.send("A heckin error")
})
