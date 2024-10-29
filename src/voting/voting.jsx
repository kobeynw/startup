import React from 'react';
import { useState } from 'react';

export function Voting(props) {
    const [newMovie, setNewMovie] = useState("");
    const [listError, setListError] = useState(null);
    const [voteCounts, setVoteCounts] = useState({});
    const [currentVote, setCurrentVote] = useState("");

    const [creatingRoom, setCreatingRoom] = useState(false);
    const [roomName, setRoomName] = useState("My Voting Room");
    const [joiningRoom, setJoiningRoom] = useState(false);
    const [roomID, setRoomID] = useState(0);
    const [members, setMembers] = useState([props.username]);

    const membersList = members.map(username => (
        <li>⚔️&nbsp;&nbsp;&nbsp;{username}</li>
    ));

    const votesList = Object.entries(voteCounts).map(([movie, voteCount]) => (
        <li key={movie}>
            <ul className="movieVotes">
                <li><h4>{movie}</h4></li>
                {/* <li><button className="addVote button" type="submit" onClick={() => addVote(movie)}>Add Vote</button></li> */}
                <li><input type="radio" name="addVote" onChange={() => addVote(movie)} /></li>
                <li><h4>Votes: {voteCount}</h4></li>
            </ul>
        </li>
    ));

    function addVote(movie) {
        const newVoteCounts = structuredClone(voteCounts);

        if (newVoteCounts[currentVote] > 0) {
            newVoteCounts[currentVote] -= 1;
        }
        newVoteCounts[movie] += 1;
        
        setCurrentVote(movie);
        setVoteCounts(newVoteCounts);
    }

    function updateVoteCounts() {
        if (!(newMovie in voteCounts)) {
            const newVoteCounts = structuredClone(voteCounts);
            newVoteCounts[newMovie] = 0;
            setVoteCounts(newVoteCounts);

            setListError(null);
        } else {
            setListError("Movie Already In Voting List");
        }
    }

    function generateRoomID() {
        // TEST CODE
        return 101;
        // TEST CODE
    }

    function getRoomNameByID() {
        // TEST CODE
        return "Super Rad Voting Room";
        // TEST CODE
    }

    function handleCreateRoom(e) {
        if (e.keyCode === 13) {
            setCreatingRoom(false);
            setRoomID(generateRoomID());
        }
    }

    function getPartyMembers() {
        const partyMembers = [];
        partyMembers.push(props.username);
        partyMembers.push("CoolCat264");
        partyMembers.push("SpongeBob555");

        setMembers(partyMembers);
    }

    function handleJoinRoom(e) {
        if (e.keyCode === 13) {
            setJoiningRoom(false);
            setRoomName(getRoomNameByID());
            getPartyMembers();
        }
    }

    return (
        <main id="votingMain">
            <div id="roomDetailsColumn" className="center">
                <h2>{roomName}</h2>
                {roomID > 0 && <h2>Room ID: {roomID}</h2>}
                {roomID > 0 && 
                    <ul id="partyList">
                        {membersList}
                    </ul>
                }
                {props.authState === "unauthenticated" &&
                    <h5>&#9888; Please Log In to Use This Feature</h5>
                }
                <button id="createRoomButton" type="submit" className="button" onClick={() => setCreatingRoom(true)} disabled={joiningRoom || props.authState === "unauthenticated"} >Create Room</button>
                {creatingRoom && 
                    <>
                        <h4>Name your new room and press 'Enter':</h4>
                        <input id="createRoomInput" value={roomName !== "My Voting Room" ? roomName : null} onChange={(e) => setRoomName(e.target.value)} onKeyDown={handleCreateRoom} placeholder="Voting Room Name..." />
                    </>
                }
                <button id="joinRoomButton" type="submit" className="button" onClick={() => setJoiningRoom(true)} disabled={creatingRoom || props.authState === "unauthenticated"} >Join Room</button>
                {joiningRoom &&
                    <>
                        <h4>Type the Room ID and press 'Enter':</h4>
                        <input id="joinRoomInput" value={roomID > 0 ? roomID : null} onChange={(e) => setRoomID(e.target.value)} onKeyDown={handleJoinRoom} placeholder="Voting Room ID..." />
                    </>
                }
            </div>
            <div id="votingColumn" className="center">
                <h2>Movie Votes</h2>
                <div id="votingContainer">
                    <ul id="movieVotesList">
                        {votesList}
                    </ul>
                    {listError && <h5>{listError}</h5>}
                    <input id="titleInput" value={newMovie} onChange={(e) => setNewMovie(e.target.value)} placeholder="Enter Movie Title..." />
                    <button id="titleSubmit" type="submit" className="button" onClick={() => updateVoteCounts()} disabled={!newMovie}>Add Movie Choice</button>
                </div>
            </div>
        </main>
    );
}