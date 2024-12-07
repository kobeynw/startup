import React from 'react';
import { useState } from 'react';

import { RoomComm, RoomEvent } from './roomCommunicator';
import { CreateRequest, JoinRequest, AddMovieRequest, VoteRequest } from './websocketRequest';

export function Voting(props) {
    const [newMovie, setNewMovie] = useState("");
    const [listError, setListError] = useState(null);
    const [voteCounts, setVoteCounts] = useState({}); // websocket
    const [currentVote, setCurrentVote] = useState("");
    const [inParty, setInParty] = useState(false);
    const [joinError, setJoinError] = useState(null); // websocket
    const [renderKey, setRenderKey] = useState(0);

    const [creatingRoom, setCreatingRoom] = useState(false);
    const [roomName, setRoomName] = useState("My Voting Room"); // websocket
    const [joiningRoom, setJoiningRoom] = useState(false);
    const [roomID, setRoomID] = useState(0); // websocket
    const [members, setMembers] = useState([props.username]); // websocket
    const [responses, setResponses] = React.useState([]);

    // websocket
    React.useEffect(() => {
        RoomComm.addHandler(handleRoomResponse);

        return () => {
            RoomComm.removeHandler(handleRoomResponse);
        };
    }, [responses]);

    function handleRoomResponse(response) {
        setResponses((prevResponses) => [...prevResponses, response]);
        updateRoom(response);
    }

    function updateRoom(response) {
        if (response.type === RoomEvent.AddMovie) {
            setVoteCounts(response.voteCounts);
        } else if (response.type === RoomEvent.Create) {
            setRoomID(response.roomID);
            setMembers([props.username]);

            setInParty(true);
        } else if (response.type === RoomEvent.Join) {
            setRoomID(response.roomID);
            setRoomName(response.roomName);
            setMembers(response.members);
            setVoteCounts(response.voteCounts);

            setInParty(true);
        } else if (response.type === RoomEvent.Vote) {
            setVoteCounts(response.voteCounts);
        } else if (response.type === RoomEvent.System) {
            console.log(response.value.msg);
        } else if (response.type === RoomEvent.Error) {
            setJoinError(response.message);
        }

        setRenderKey((prevKey) => prevKey + 1);
    }

    const membersList = members.map(username => (
        <li key={username}>⚔️&nbsp;&nbsp;&nbsp;{username}</li>
    ));

    const votesList = Object.entries(voteCounts).map(([movie, voteCount]) => (
        <li key={movie}>
            <ul className="movieVotes">
                <li><h4>{movie}</h4></li>
                <li><input type="radio" name="addVote" onChange={() => addVote(movie, true)} checked={movie === currentVote} /></li>
                <li><h4>Votes: {voteCount}</h4></li>
            </ul>
        </li>
    ));

    function addVote(movie, isMyVote=false) {
        const newVoteCounts = structuredClone(voteCounts);

        if (newVoteCounts[currentVote] > 0) {
            newVoteCounts[currentVote] -= 1;
        }
        newVoteCounts[movie] += 1;
        
        setCurrentVote(movie);
        setVoteCounts(newVoteCounts);

        if (isMyVote && inParty) {
            // Broadcast Vote Event
            const request = new VoteRequest(RoomEvent.Vote, roomID, newVoteCounts);
            RoomComm.broadcastEvent(request);
        }
    }

    function updateVoteCounts() {
        if (!(newMovie in voteCounts)) {
            const newVoteCounts = structuredClone(voteCounts);
            newVoteCounts[newMovie] = 0;
            setVoteCounts(newVoteCounts);

            // Broadcast AddMovie Event
            if (inParty) {
                const request = new AddMovieRequest(RoomEvent.AddMovie, roomID, newMovie);
                RoomComm.broadcastEvent(request);
            }

            setListError(null);
        } else {
            setListError("Movie Already In Voting List");
        }
    }

    function handleCreateRoom(e) {
        if (e.keyCode === 13) {
            setCreatingRoom(false);

            // Broadcast Create Event
            const request = new CreateRequest(RoomEvent.Create, props.username, roomName);
            RoomComm.broadcastEvent(request);
        }
    }

    function handleJoinRoom(e) {
        if (e.keyCode === 13) {
            setJoiningRoom(false);

            // Broadcast Join Event
            const request = new JoinRequest(RoomEvent.Join, roomID, props.username);
            RoomComm.broadcastEvent(request);
        }
    }

    return (
        <main id="votingMain" key={renderKey}>
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
                        <input id="createRoomInput" value={roomName !== "My Voting Room" ? roomName : ""} onChange={(e) => setRoomName(e.target.value)} onKeyDown={handleCreateRoom} placeholder="Voting Room Name..." />
                    </>
                }
                <button id="joinRoomButton" type="submit" className="button" onClick={() => setJoiningRoom(true)} disabled={creatingRoom || props.authState === "unauthenticated"} >Join Room</button>
                {joiningRoom &&
                    <>
                        <h4>Type the Room ID and press 'Enter':</h4>
                        <input id="joinRoomInput" value={roomID > 0 ? roomID : ""} onChange={(e) => setRoomID(e.target.value)} onKeyDown={handleJoinRoom} placeholder="Voting Room ID..." />
                    </>
                }
                {joinError && <h5>{joinError}</h5>}
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