const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const cookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.set('trust proxy', true);

var apiRouter = express.Router();
app.use('/api', apiRouter);

// CREATE NEW USER
apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUserByUsername(req.body.username)) {
        res.status(409).send({ msg: 'Username Taken' });
    } else {
        const user = await DB.createUser(req.body.username, req.body.password);
        setAuthCookie(res, user.authToken);
        res.send({ token: user.authToken });
    }
});

// LOGIN EXISTING USER
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUserByUsername(req.body.username);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.authToken);
            res.send({ token: user.authToken });
            return
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

// LOGOUT USER
apiRouter.delete('/auth/logout', async (req, res) => {
    res.clearCookie(cookieName);
    res.status(204).end();
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
secureApiRouter.get('/collection/get/:username', async (req, res) => {
    const movieCollection = await DB.getMovieCollection(req.params.username);

    if (movieCollection) {
        res.send({ collection: movieCollection });
    } else {
        res.send({ collection: {movies: {}} });
    }
});

// ADD TO MOVIE COLLECTION
secureApiRouter.post('/collection/add/:username', async (req, res) => {
    const username = req.params.username;
    const newMovie = req.body.movie;
    const newID = Object.keys(newMovie)[0];
    const newInfo = newMovie[newID];

    const updatedMovies = await DB.updateCollection(username, newID, newInfo);
    const updatedCollection = { movies: updatedMovies };
    res.send({ collection: updatedCollection });
});

// DELETE FROM MOVIE COLLECTION
secureApiRouter.post('/collection/delete/:username', async (req, res) => {
    const username = req.params.username;
    const movieIDToDelete = req.body.id;

    const updatedMovies = await DB.deleteFromCollection(username, movieIDToDelete);
    const updatedCollection = { movies: updatedMovies };
    res.send({ collection: updatedCollection });
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