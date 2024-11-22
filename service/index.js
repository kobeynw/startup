const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const cookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const uuid = require('uuid');

let users = {};  // {username: username, password, token}
let movieCollections = {};  // {username: {movies: {id1: {Title, Director, Year, Genres, Metascore, Rated} } } }

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.set('trust proxy', true);

var apiRouter = express.Router();
app.use('/api', apiRouter);

// CREATE NEW USER
apiRouter.post('/auth/create', async (req, res) => {
    // const user = users[req.body.username];
    if (await DB.getUserByUsername(req.body.username)) {
        res.status(409).send({ msg: 'Username Taken' });
    } else {
        const user = await DB.createUser(req.body.username, req.body.password);

        setAuthCookie(res, user.token);

        res.send({ token: newUser.token });
    }

    // if (user) {
    //     res.status(409).send({ msg: 'Username Taken' });
    // } else {
    //     const newUser = { username: req.body.username, password: req.body.password, token: uuid.v4() };
    //     users[newUser.username] = newUser;

    //     res.send({ token: newUser.token });
    // }
});

// LOGIN EXISTING USER
apiRouter.post('/auth/login', async (req, res) => {
    // const user = users[req.body.username];
    const user = await DB.getUserByUsername(req.body.username);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.authToken);
            res.send({ token: user.token });
            return
        }
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }

    // if (user) {
    //     if (req.body.password === user.password) {
    //         user.token = uuid.v4();
    //         res.send({ token: user.token });
    //     }
    // } else {
    //     res.status(401).send({ msg: 'Unauthorized' });
    // }
});

// LOGOUT USER
apiRouter.delete('/auth/logout', async (req, res) => {
    // const user = Object.values(users).find((u) => u.token === req.body.token);
    res.clearCookie(cookieName);
    res.status(204).end();

    // if (user) {
    //     delete user.token;
    // } else {
    //     res.status(204).end();
    // }
});

// SECURE API ROUTER FOR VERIFYING CREDENTIALS
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    const authToken = req.cookies[cookieName];
    const user = await DB.getUserByToken(authToken);

    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// GET MOVIE COLLECTION
apiRouter.get('/collection/get/:username', (req, res) => {
    const movieCollection = movieCollections[req.params.username];

    if (movieCollection) {
        res.send({ collection: movieCollection });
    } else {
        res.send({ collection: {movies: {}} });
    }
});

// ADD TO MOVIE COLLECTION
apiRouter.post('/collection/add', (req, res) => {
    const username = req.body.username;
    let userCollection = movieCollections[username];
    const newMovie = req.body.movie;

    if (userCollection) {
        const newMovies = { ...userCollection.movies, ...newMovie };
        userCollection.movies = newMovies;
        movieCollections[username] = userCollection;

        res.send({ collection: userCollection});
    } else {
        const newCollection = {movies: newMovie}
        movieCollections[username] = newCollection;

        res.send({ collection: newCollection});
    }
});

// DELETE FROM MOVIE COLLECTION
apiRouter.post('/collection/delete', (req, res) => {
    const username = req.body.username;
    const movieIDToDelete = req.body.id;

    if (movieCollections[username]) {
        delete (movieCollections[username].movies[movieIDToDelete]);

        res.send({ collection: movieCollections[username] })
    } else {
        const newCollection = {movies: {newMovie}}
        movieCollections[username] = newCollection;

        res.send({ collection: newCollection});
    }
});

app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

function setAuthCookie(res, authToken) {
    res.cookie(cookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});