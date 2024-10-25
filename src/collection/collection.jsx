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

    function saveToCollection(id, newTitle, newDirector, newYear) {
        const newMovie ={};
        newMovie[id] = {
            title: newTitle,
            director: newDirector,
            year: newYear
        };

        const newMovies = { ...userCollection.movies, ...newMovie };
        userCollection.movies = newMovies;

        setUserCollection(userCollection);
        updateCollection();
    }

    function deleteFromCollection(titleToDelete, directorToDelete, yearToDelete) {
        for (const [id, movie] of Object.entries(userCollection.movies)) {
            if (movie.title === titleToDelete && movie.director === directorToDelete && movie.year === yearToDelete) {
                delete userCollection.movies[id];
            }
        }

        setUserCollection(userCollection);
        updateCollection();
    }

    function fetchUserCollection() {
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

    async function fetchMovieInfo(movieId) {
        const apiUrl = `http://www.omdbapi.com/?i=${movieId}&apikey=4ce31389`;
    
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

        const apiUrl = `http://www.omdbapi.com/?s=${movieTitle}&type=movie&apikey=4ce31389`;

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

            console.log(searchResults);
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