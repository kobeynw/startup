const { CreateResponse, JoinResponse, AddMovieResponse, VoteResponse, ErrorResponse } = require('./websocketResponse');

const { WebSocketServer } = require('ws');
const uuid = require('uuid');

let connections = [];
let roomCount = 100;
const roomInfo = {};  // EXAMPLE: {roomID1: {name: roomName, members: [user1, user2], votes: {title1: 3, title2: 4}}, roomID2: {members: [user3, user4], votes: {title1: 7, title2: 3}}}

const RoomEvent = {
    System: 'system',
    Create: 'create',
    Join: 'join',
    AddMovie: 'addMovie',
    Vote: 'vote',
    Error: 'error',
};

function notifyRoot(conn, data) {
    connections.forEach((c) => {
        if (c.id === conn.id) {
            c.ws.send(data);
        }
    });
}

function broadcast(conn, data) {
    connections.forEach((c) => {
        if (c.id !== conn.id && c.roomID !== null) {
            if (c.roomID == conn.roomID) {
                c.ws.send(data);
            }
        }
    });
}

function addMovieHandler(conn, msg) {
    const newMovie = msg.movieTitle;
    const addMovieRoomID = msg.roomID;
    const currentVotes = roomInfo[addMovieRoomID]["votes"] ?? {};

    roomInfo[addMovieRoomID]["votes"] = {...currentVotes, [newMovie]: 0};

    const newVoteCounts = roomInfo[addMovieRoomID]["votes"];
    const addMovieRes = new AddMovieResponse(RoomEvent.AddMovie, newVoteCounts);
    const addMovieData = JSON.stringify(addMovieRes);

    broadcast(conn, addMovieData);
}

function createHandler(conn, msg) {
    roomCount ++;
    const newRoomID = roomCount;
    const newRoomInfo = {
        name: msg.roomName,
        members: [msg.username],
        votes: {}
    };

    conn.roomID = newRoomID;
    roomInfo[newRoomID] = newRoomInfo;

    const createRes = new CreateResponse(RoomEvent.Create, newRoomID);
    const createResData = JSON.stringify(createRes);

    notifyRoot(conn, createResData);
}

function joinHandler(conn, msg) {
    const newUser = msg.username;
    const joinRoomID = msg.roomID;

    if (!(joinRoomID in roomInfo)) {
        const errorRes = new ErrorResponse(RoomEvent.Error, "Invalid Join ID");
        const errorData = JSON.stringify(errorRes);
        notifyRoot(conn, errorData);
    } else {
        conn.roomID = joinRoomID;

        const joinRoomName = roomInfo[joinRoomID]["name"];
        const joinVoteCounts = roomInfo[joinRoomID]["votes"];
        const currentMembers = roomInfo[joinRoomID]["members"];

        if (!(currentMembers.includes(newUser))) {
            const newMembers = [...currentMembers, newUser];
            roomInfo[joinRoomID]["members"] = newMembers;
        
            const joinRes = new JoinResponse(RoomEvent.Join, joinRoomID, joinRoomName, newMembers, joinVoteCounts);
            const joinResData = JSON.stringify(joinRes);
        
            notifyRoot(conn, joinResData);
            broadcast(conn, joinResData);
        } else {
            const joinRes = new JoinResponse(RoomEvent.Join, joinRoomID, joinRoomName, currentMembers, joinVoteCounts);
            const joinResData = JSON.stringify(joinRes);
        
            notifyRoot(conn, joinResData);
        }
    }
}

function voteHandler(conn, msg) {
    const voteRoomID = msg.roomID;
    const newVoteCounts = msg.voteCounts;
    roomInfo[voteRoomID]["votes"] = newVoteCounts;

    const voteRes = new VoteResponse(RoomEvent.Vote, newVoteCounts);
    const voteResData = JSON.stringify(voteRes);

    broadcast(conn, voteResData);
}

function peerProxy(httpServer) {
    const wss = new WebSocketServer({ noServer: true });

    httpServer.on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, function done(ws) {
            wss.emit('connection', ws, req);
        });
    });

    wss.on('connection', (ws) => {
        const conn = { id: uuid.v4(), roomID: null, alive: true, ws: ws };
        connections.push(conn);

        ws.on('message', function message(data) {
            const msg = JSON.parse(data);

            switch (msg.type) {
                case RoomEvent.AddMovie:
                    addMovieHandler(conn, msg);
                    break;
                case RoomEvent.Create:
                    createHandler(conn, msg);
                    break;
                case RoomEvent.Join:
                    joinHandler(conn, msg);
                    break;
                case RoomEvent.Vote:
                    voteHandler(conn, msg);
                    break;
                default:
                    console.log("INVALID REQUEST TYPE");
                    break;
            }
        });

        // remove the closed connection
        ws.on('close', () => {
            const pos = connections.findIndex((o, i) => o.id === connections.id);

            if (pos >= 0) {
                connections.splice(pos, 1);
            }
        });

        // respond with pong
        ws.on('pong', () => {
            conn.alive = true;
        });
    });

    // keep only active connections alive
    setInterval(() => {
        connections.forEach((c) => {
            if (!c.alive) {
                c.ws.terminate();
            } else {
                c.alive = false;
                c.ws.ping();
            }
        });
    }, 10000);
}

module.exports = { peerProxy };