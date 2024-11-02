const express = require('express');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;
const uuid = require('uuid');

let users = {};  // {username: username, password, token}
let movieCollections = {};  // {username: {movies: {id1: {Title, Director, Year, Genres, Metascore, Rated} } } }

app.use(express.json());

var apiRouter = express.Router();
app.use('/api', apiRouter);

// CREATE NEW USER
apiRouter.post('/auth/create', async (req, res) => {
    const user = users[req.body.username];

    if (user) {
        res.status(409).send({ msg: 'Username Taken' });
    } else {
        user = { username: req.body.username, password: req.body.password, token: uuid.v4() };
        users[user.username] = user;

        res.send({ token: user.token });
    }
});

// LOGIN EXISTING USER
apiRouter.post('/auth/login', async (req, res) => {
    const user = users[req.body.username];

    if (user) {
        if (req.body.password === user.password) {
            user.token = uuid.v4();
            res.send({ token: user.token });
        }
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// LOGOUT USER
apiRouter.post('/auth/logout', async (req, res) => {
    const user = Object.values(users).find((u) => u.token === req.body.token);

    if (user) {
        delete user.token;
    } else {
        res.status(204).end();
    }
});

// GET MOVIE COLLECTION
apiRouter.get('/collection', (req, res) => {
    const movieCollection = movieCollections[req.body.username];

    if (movieCollection) {
        res.send({ collection: movieCollection });
    } else {
        res.send({ collection: {movies: {}} });
    }
});

// UPDATE MOVIE COLLECTION
apiRouter.post('/movie', (req, res) => {
    const username = req.body.username;
    let userCollection = movieCollections[username];
    const newMovie = req.body.movie;

    if (userCollection) {
        const newMovies = { ...userCollection.movies, ...newMovie };
        userCollection.movies = newMovies;
        movieCollections[username] = userCollection;

        res.send({ collection: userCollection});
    } else {
        const newCollection = {movies: {newMovie}}
        movieCollections[username] = newCollection;

        res.send({ collection: newCollection});
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});