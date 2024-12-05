const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function peerProxy(httpServer) {
    const wss = new WebSocketServer({ noServer: true });

    httpServer.on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, function done(ws) {
            wss.emit('connection', ws, req);
        });
    });

    let connections = [];

    wss.on('connection', (ws) => {
        const conn = { id: uuid.v4(), alive: true, ws: ws };
        connections.push(conn);

        // forward messages to everyone except the sender
        ws.on('message', function message(data) {
            connections.forEach((c) => {
                if (c.id !== conn.id) {
                    c.ws.send(data);
                }
            });
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