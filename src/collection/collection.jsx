import React from 'react';
import { useState, useEffect } from 'react';

export function Collection(props) {
    const username = props.username;

    const [userCollection, setUserCollection] = useState(fetchUserCollection());
    const [collectionRows, setCollectionRows] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [resultsRows, setResultsRows] = useState([]);

    useEffect(() => {
        updateCollection();
    }, []);

    async function saveToCollection(id, newTitle, newDirector, newYear) {
        const newMovie ={};
        newMovie[id] = {
            title: newTitle,
            director: newDirector,
            year: newYear
        };

        const response = await fetch('/collection/add', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ username: username, movie: newMovie})
        });

        const body = await response.json();
        const newCollection = body.collection;

        setUserCollection(newCollection);
        updateCollection();
    }

    async function deleteFromCollection(id) {
        const response = await fetch('/collection/delete', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ id: id })
        });

        const body = await response.json();
        const newCollection = body.collection;

        setUserCollection(newCollection);
        updateCollection();
    }

    async function fetchUserCollection() {
        const response = await fetch('/collection/get', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ username: username })
        });

        const body = await response.json();
        return body.collection;
    }

    function updateCollection() {
        const newCollectionRows = [];

        for (const [id, movie] of Object.entries(userCollection.movies)) {
            newCollectionRows.push(
                <tr key={id}>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.year}</td>
                    <td><button className="collectionButton" onClick={() => deleteFromCollection(id)}>Delete</button></td>
                </tr>
            );
        }

        setCollectionRows(newCollectionRows);
    }

    async function fetchMovieInfo(movieId) {
        const apiUrl = `https://www.omdbapi.com/?i=${movieId}&apikey=4ce31389`;
    
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    async function fetchSearchResults(movieTitle) {
        const searchResults = {
            movies: {}
        };

        const apiUrl = `https://www.omdbapi.com/?s=${movieTitle}&type=movie&apikey=4ce31389`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            const search = data.Search;

            const moviePromises = search.map(movie => fetchMovieInfo(movie.imdbID));
            const movieArray = await Promise.all(moviePromises);
            
            movieArray.forEach(newMovie => {
                if (newMovie) {
                    searchResults.movies[newMovie.imdbID] = newMovie;
                }
            });

            return searchResults;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    async function updateSearch(movieTitle) {
        try {
            const searchResults = await fetchSearchResults(movieTitle);
            const newResultsRows = [];
        
            for (const [i, movie] of Object.entries(searchResults.movies)) {
                newResultsRows.push(
                    <tr key={i}>
                        <td>{movie.Title}</td>
                        <td>{movie.Director}</td>
                        <td>{movie.Year}</td>
                        <td><button className="collectionButton" onClick={() => saveToCollection(i, movie.Title, movie.Director, movie.Year)}>Add</button></td>
                    </tr>
                );
            }

            setResultsRows(newResultsRows);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleSearchQuery = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <main id="collectionMain">
            <div id="collection" className="center">
                <h2>My Collection</h2>
                <table id="collectionList">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Year</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>{collectionRows}</tbody>
                </table>
            </div>
            <div id="database" className="center">
                <h2>Movie Database</h2>
                {props.authState === "unauthenticated" &&
                    <h5>&#9888; Please Log In to Use This Feature</h5>
                }
                <input id="titleInput" placeholder="Search for a movie..." value={searchQuery} onChange={handleSearchQuery} />
                <button id="titleSubmit" className="button" type="submit" onClick={() => updateSearch(searchQuery)} disabled={!searchQuery || props.authState === "unauthenticated"}>Search</button>
                <table id="searchList">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Year</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>{resultsRows}</tbody>
                </table>
            </div>
        </main>
    );
}