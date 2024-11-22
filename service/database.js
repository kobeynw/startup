const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('movie_knight');
const users = db.collection('users');
const movieCollections = db.collection('movie_collections');

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

function getUserByUsername(username) {
    return users.findOne({ username: username });
}

function getUserByToken(authToken) {
    return users.findOne({ authToken: authToken });
}

async function createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        username: username,
        password: hashedPassword,
        authToken: uuid.v4()
    };
    await users.insertOne(user);

    return user;
}

function getMovieCollection(usernameParam) {
    const query = { username: usernameParam };
    const cursor = movieCollections.findOne(query);

    return cursor ? cursor : null;
}

async function updateCollection(usernameParam, newID, newInfo) {
    const cursor = await movieCollections.findOneAndUpdate(
        { username: usernameParam },
        { $set: { [`movies.${newID}`]: newInfo } },
        { returnDocument: 'after' }
    );

    return cursor.value.movies;
}

async function deleteFromCollection(usernameParam, idToDelete) {
    const cursor = await movieCollections.findOneAndUpdate(
        { username: usernameParam },
        { $unset: { [`movies.${idToDelete}`]: '' } },
        { returnDocument: 'after' }
    );

    return cursor.value.movies;
}

module.exports = {
    getUserByUsername,
    getUserByToken,
    createUser,
    getMovieCollection,
    updateCollection,
    deleteFromCollection
};