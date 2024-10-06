import React from 'react';

export function Voting() {
    return (
        <main id="votingMain">
            <div id="roomDetailsColumn" className="center">
                <h2>Current Room Name/ID</h2>
                <ul id="partyList">
                    <li>Member 1</li>
                    <li>Member 2</li>
                    <li>Member 3</li>
                </ul>
                <button id="createRoomButton" type="submit" className="button">Create Room</button>
                <button id="joinRoomButton" type="submit" className="button">Join Room</button>
            </div>
            <div id="votingColumn" className="center">
                <h2>Movie Votes</h2>
                <div id="votingContainer">
                    <ul id="movieVotesList">
                        <li>
                            <ul className="movieVotes">
                                <li><h4>Movie 1</h4></li>
                                <li><button className="addVote button" type="submit">Add Vote</button></li>
                                <li><h4>Votes: 2</h4></li>
                            </ul>
                        </li>
                        <li>
                            <ul className="movieVotes">
                                <li><h4>Movie 2</h4></li>
                                <li><button className="addVote button" type="submit">Add Vote</button></li>
                                <li><h4>Votes: 1</h4></li>
                            </ul>
                        </li>
                        <li>
                            <ul className="movieVotes">
                                <li><h4>Movie 3</h4></li>
                                <li><button className="addVote button" type="submit">Add Vote</button></li>
                                <li><h4>Votes: 0</h4></li>
                            </ul>
                        </li>
                    </ul>
                    <input id="titleInput" placeholder="Enter Movie Title..." />
                    <button id="titleSubmit" type="submit" className="button">Add Movie Choice</button>
                </div>
            </div>
        </main>
    );
}