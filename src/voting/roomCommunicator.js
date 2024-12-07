class EventMessage {
    constructor(from, type, value) {
        this.from = from;
        this.type = type;
        this.value = value;
    }
}

const RoomEvent = {
    System: 'system',
    Create: 'create',
    Join: 'join',
    AddMovie: 'addMovie',
    Vote: 'vote',
    Error: 'error',
};

class RoomCommunicator {
    responses = [];
    handlers = [];

    constructor() {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);

        this.socket.onopen = (e) => {
            this.receiveEvent(new EventMessage('System', RoomEvent.System, { msg: 'connected' }));
        }

        this.socket.onclose = (e) => {
            this.receiveEvent(new EventMessage('System', RoomEvent.System, { msg: 'disconnected' }));
        }

        this.socket.onmessage = async (msg) => {
            try {
                const event = JSON.parse(await msg.data);
                this.receiveEvent(event);
            } catch {
                console.log("ERROR PARSING");
            }
        };
    }

    broadcastEvent(request) {
        this.socket.send(JSON.stringify(request));
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }

    removeHandler(handler) {
        this.handlers.filter((toRemove) => toRemove !== handler);
    }

    receiveEvent(response) {
        this.responses.push(response);

        this.responses.forEach((res) => {
            this.handlers.forEach((handler) => {
                handler(res);
            });
        });
    }
}

const RoomComm = new RoomCommunicator();
export { RoomComm, RoomEvent };