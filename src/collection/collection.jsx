import React from 'react';
import { useState, useEffect } from 'react';

export function Collection(props) {
    const username = props.username;

    const [collectionRows, setCollectionRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [resultsRows, setResultsRows] = useState([]);
    const [networkError, setNetworkError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getCollection() {
            const collection = await fetchUserCollection();
            updateCollection(collection);
            return collection;
        }

        getCollection();
    }, []);

    async function saveToCollection(id, newTitle, newDirector, newYear, newGenres, newMetascore, newRated) {
        const newMovie ={};
        newMovie[id] = {
            Title: newTitle,
            Director: newDirector,
            Year: newYear,
            Genres: newGenres,
            Metascore: newMetascore,
            Rated: newRated
        };
        
        const response = await fetch(`/api/collection/add/${username}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ username: username, movie: newMovie})
        });

        const body = await response.json();
        const newCollection = body.collection;

        updateCollection(newCollection);
    }

    async function deleteFromCollection(id) {
        const response = await fetch(`/api/collection/delete/${username}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ username: username, id: id })
        });

        const body = await response.json();
        const newCollection = body.collection;

        updateCollection(newCollection);
    }

    async function fetchUserCollection() {
        if (username != '' && username != null) {
            const response = await fetch(`/api/collection/get/${username}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            });
    
            const body = await response.json();
    
            if (body != null) {
                return body.collection;
            }
        }

        return null;
    }

    function updateCollection(newCollection) {
        if (newCollection && newCollection.movies) {
            const newCollectionRows = [];

            for (const [id, movie] of Object.entries(newCollection.movies)) {
                newCollectionRows.push(
                    <tr key={id}>
                        <td>{movie.Title}</td>
                        <td>{movie.Director}</td>
                        <td>{movie.Year}</td>
                        <td><button className="collectionButton" onClick={() => deleteFromCollection(id)}>Delete</button></td>
                    </tr>
                );
            }

            setCollectionRows(newCollectionRows);
        }
    }

    async function fetchMovieInfo(movieId) {
        setNetworkError(null);
        const apiUrl = `https://www.omdbapi.com/?i=${movieId}&apikey=4ce31389`;
    
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            setNetworkError('Network Error');
            console.error('Error:', error);
            return null;
        }
    }

    async function fetchSearchResults(movieTitle) {
        setNetworkError(null);
        setIsLoading(true);

        const searchResults = {
            movies: {}
        };

        const apiUrl = `https://www.omdbapi.com/?s=${movieTitle}&type=movie&apikey=4ce31389`;

        try {
            if (movieTitle.length < 3) {
                setNetworkError('Title length too short');
                return null;
            }

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
            setNetworkError('Network Error');
            console.error('Error:', error);
            return null;
        } finally {
            setIsLoading(false);
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
                        <td><button className="collectionButton" onClick={() => saveToCollection(i, movie.Title, movie.Director, movie.Year, movie.Genre, movie.Metascore, movie.Rated)}>Add</button></td>
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
                    <tbody>{!isLoading && !networkError && 
                        resultsRows
                    }</tbody>
                </table>
                {isLoading &&
                    <h4>Fetching Movies...</h4>
                }
                {networkError &&
                    <h5>&#9888; {networkError}</h5>
                }
            </div>
        </main>
    );
}