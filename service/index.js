const express = require('express');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;
const uuid = require('uuid');

let users = {};  // {username: username, password, token}
let movieCollections = {};  // {username: {movies: {id1: {Title, Director, Year, Genres, Metascore, Rated} } } }

app.use(express.json());

var apiRouter = express.Router();
app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});