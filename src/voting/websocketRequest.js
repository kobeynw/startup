export class CreateRequest {
    constructor(type, username, roomName) {
        this.type = type;
        this.username = username;
        this.roomName = roomName;
    }
}

export class JoinRequest {
    constructor(type, roomID, username) {
        this.type = type;
        this.roomID = roomID;
        this.username = username;
    }
}

export class AddMovieRequest {
    constructor(type, roomID, movieTitle) {
        this.type = type;
        this.roomID = roomID;
        this.movieTitle = movieTitle;
    }
}

export class VoteRequest {
    constructor(type, roomID, voteCounts) {
        this.type = type;
        this.roomID = roomID;
        this.voteCounts = voteCounts;
    }
}
