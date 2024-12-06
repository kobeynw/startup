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
    constructor(type, movieTitle) {
        this.type = type;
        this.movieTitle = movieTitle;
    }
}

class VoteResponse {
    constructor(type, voteCounts) {
        this.type = type;
        this.voteCounts = voteCounts;
    }
}