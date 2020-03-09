const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();

app.use(express.json());

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.get('/api/users', (req, res, next) => {
  db.readUsers()
    .then(response => res.send(response))
    .catch(next);
});

app.get('/api/activities', (req, res, next) => {
  db.readActivities()
    .then(response => res.send(response))
    .catch(next);
});

app.post('/api/activities', (req, res, next) => {
  db.createActivity(req.body)
    .then(activity => res.send(activity))
    .catch(next);
});

app.put('/api/activities/:id', (req, res, next) => {
  db.updateActivity(req.body)
    .then(activity => res.send(activity))
    .catch(next);
});

app.delete('/api/activities/:id', (req, res, next) => {
  db.deleteActivity(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

const port = process.env.PORT || 3000;

db.sync()
  .then(() => app.listen(port, () => console.log(`Listening on Port ${port}`)))
  .catch(ex => console.log(ex));
