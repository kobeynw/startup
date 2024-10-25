import React from 'react';
import { useState, useEffect } from 'react';

export function Collection(props) {
    const username = props.username;
    const password = props.password;

    const [userCollection, setUserCollection] = useState(fetchUserCollection());
    const [collectionRows, setCollectionRows] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [resultsRows, setResultsRows] = useState([]);

    useEffect(() => {
        updateCollection();
    }, []);

    function saveToCollection(newTitle, newDirector, newYear) {
        // TEST CODE
        // NOTE: MAKE SURE TO USE A UNIQUE ID
        const newMovie = {
            id3: {
                title: newTitle,
                director: newDirector,
                year: newYear
            }
        };

        const newMovies = { ...userCollection.movies, ...newMovie };
        userCollection.movies = newMovies;

        setUserCollection(userCollection);
        updateCollection();
        // TEST CODE
    }

    function deleteFromCollection(titleToDelete, directorToDelete, yearToDelete) {
        // TEST CODE
        for (const [id, movie] of Object.entries(userCollection.movies)) {
            if (movie.title === titleToDelete && movie.director === directorToDelete && movie.year === yearToDelete) {
                delete userCollection.movies[id];
            }
        }

        setUserCollection(userCollection);
        updateCollection();
        // TEST CODE
    }

    function fetchUserCollection() {
        // TEST CODE
        const userCollection = {
            movies: {
                id1: {
                    title: "Guardians of the Galaxy Vol. 1",
                    director: "James Gunn",
                    year: 2014
                },
                id2: {
                    title: "Star Wars: A New Hope",
                    director: "George Lucas",
                    year: 1977
                }
            }
        };
        // TEST CODE

        return userCollection;
    }

    function updateCollection() {
        const newCollectionRows = [];

        for (const [i, movie] of Object.entries(userCollection.movies)) {
            newCollectionRows.push(
                <tr key={i}>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.year}</td>
                    <td><button className="collectionButton" onClick={() => deleteFromCollection(movie.title, movie.director, movie.year)}>Delete</button></td>
                </tr>
            );
        }

        setCollectionRows(newCollectionRows);
    }

    function fetchSearchResults(movieTitle) {
        // TEST CODE
        const searchResults = {
            movies: {
                id1: {
                    title: `${movieTitle}`,
                    director: "Some Director",
                    year: 2000
                },
                id2: {
                    title: "Knives Out",
                    director: "Rian Johnson",
                    year: 2019
                }
            }
        };
        // TEST CODE

        return searchResults;
    }

    function updateSearch(movieTitle) {
        const searchResults = fetchSearchResults(movieTitle);
        const newResultsRows = [];
    
        for (const [i, movie] of Object.entries(searchResults.movies)) {
            newResultsRows.push(
                <tr key={i}>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.year}</td>
                    <td><button className="collectionButton" onClick={() => saveToCollection(movie.title, movie.director, movie.year)}>Add</button></td>
                </tr>
            );
        }

        setResultsRows(newResultsRows);
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
                {/* <button className="button">Add Custom Movie</button> */}
            </div>
            <div id="database" className="center">
                <h2>Movie Database</h2>
                <input id="titleInput" placeholder="Search for a movie..." value={searchQuery} onChange={handleSearchQuery} />
                <button id="titleSubmit" className="button" type="submit" onClick={() => updateSearch(searchQuery)} disabled={!searchQuery}>Search</button>
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