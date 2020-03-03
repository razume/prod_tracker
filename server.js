const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.listen(port, () => console.log(`Listening on Port ${port}`));
