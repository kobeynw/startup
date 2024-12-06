class CreateRequest {
    constructor(type, username, roomName) {
        this.type = type;
        this.username = username;
        this.roomName = roomName;
    }
}

class JoinRequest {
    constructor(type, roomID) {
        this.type = type;
        this.roomID = roomID;
    }
}

class AddMovieRequest {
    constructor(type, movieTitle) {
        this.type = type;
        this.movieTitle = movieTitle;
    }
}

class VoteRequest {
    constructor(type, voteCounts) {
        this.type = type;
        this.voteCounts = voteCounts;
    }
}
