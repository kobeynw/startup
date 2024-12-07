class CreateResponse {
    constructor(type, roomID) {
        this.type = type;
        this.roomID = roomID;
    }
}

class JoinResponse {
    constructor(type, roomID, roomName, members, voteCounts) {
        this.type = type;
        this.roomID = roomID;
        this.roomName = roomName;
        this.members = members;
        this.voteCounts = voteCounts;
    }
}

class AddMovieResponse {
    constructor(type, voteCounts) {
        this.type = type;
        this.voteCounts = voteCounts;
    }
}

class VoteResponse {
    constructor(type, voteCounts) {
        this.type = type;
        this.voteCounts = voteCounts;
    }
}

class ErrorResponse {
    constructor(type, message) {
        this.type = type;
        this.message = message;
    }
}

module.exports = { CreateResponse, JoinResponse, AddMovieResponse, VoteResponse, ErrorResponse };