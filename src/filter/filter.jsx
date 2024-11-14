import React from 'react';
import { useState } from 'react';

const RATING_ORDER = {
    "G": 1,
    "PG": 2,
    "PG-13": 3,
    "R": 4,
    "Any": 5
};

export function Filter(props) {
    const username = props.username;
    const [resultsRows, setResultsRows] = useState([]);
    const [resultsError, setResultsError] = useState("");
    const [userCollection, setUserCollection] = useState(null);
    fetchUserCollection();

    const [genres, setGenres] = useState([]);
    const [minYear, setMinYear] = useState(1900);
    const [maxYear, setMaxYear] = useState(2024);
    const [minScore, setMinScore] = useState(0);
    const [rating, setRating] = useState("");

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
                setUserCollection(body.collection);
            }
        }
    }

    function followsCriteria(movie) {
        if (genres.length === 0) {
            setResultsError("Please choose at least one genre");
            return false;
        } else if (rating === "") {
            setResultsError("Please choose a rating");
            return false;
        } else {
            setResultsError(null);
        }

        const categories = [movie.Genres ?? "N/A", movie.Year ?? "N/A", movie.Metascore ?? "N/A", movie.Rated ?? "N/A"];
        categories.map((value, index) => {
            if (value == "N/A") {
                if (index === 1) {
                    return [];
                } else if (index === 2) {
                    return maxYear;
                } else if (index === 3) {
                    return minScore;
                } else {
                    return rating;
                }
            } else {
                return value;
            }
        })

        const currentGenres = movie.Genres ? movie.Genres.split(", ") : [];
        const intersectingGenres = currentGenres.filter(value => genres.includes(value));
        const hasMatchingGenres = intersectingGenres.length > 0;

        const inYearRange = movie.Year ? (movie.Year >= minYear && movie.Year <= maxYear) : false;
        const greaterThanMinScore = movie.Metascore ? movie.Metascore >= minScore : false;
        const lessThanRating = movie.Rated ? RATING_ORDER[movie.Rated] <= RATING_ORDER[rating] : false;

        return (hasMatchingGenres && inYearRange && greaterThanMinScore && lessThanRating);
    }

    function filterCollection() {
        const searchResults = {movies: {}};

        if (userCollection && userCollection.movies) {
            for (const [id, movie] of Object.entries(userCollection.movies)) {
                if (followsCriteria(movie)) {
                    searchResults.movies[id] = movie;
                }
            }
        }

        return searchResults;
    }

    function updateResultsRows(results) {
        const newResultsRows = [];

        for (const [i, movie] of Object.entries(results.movies)) {
            newResultsRows.push(
                <tr key={i}>
                    <td>{movie.Title}</td>
                    <td>{movie.Director}</td>
                    <td>{movie.Year}</td>
                </tr>
            );
        }

        setResultsRows(newResultsRows);
    }

    function updateSearch(e) {
        e.preventDefault();
        const searchResults = filterCollection();
        updateResultsRows(searchResults);
    }

    function handleGenreChange(genreValue) {
        if (genres.includes(genreValue)) {
            genres.splice(genres.indexOf(genreValue), 1);
        } else {
            setGenres([...genres, genreValue]);
        }
    }

    function getRandomMovie(e) {
        e.preventDefault();

        if (userCollection && userCollection.movies) {
            const movieKeys = Object.keys(userCollection.movies);
            const randomKey = movieKeys[Math.floor(Math.random() * movieKeys.length)];
            
            const randomMovie = userCollection.movies[randomKey];
            const randomMovieObj = {randomKey: randomMovie};
            const randomResults = {movies: randomMovieObj};
    
            updateResultsRows(randomResults);
        }
    }

    return (
        <main id="filterMain">
            <div id="filter" className="center">
                <h2 id="filterLabel">My Collection Filters</h2>
                <div id="genreFilter">
                    <h3>Genre</h3>
                    <fieldset id="genreFieldset">
                        <legend id="ig">Included Genres</legend>
                        <label>Action</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Action" onChange={() => handleGenreChange("Action")} />
                        <label>Adventure</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Adventure" onChange={() => handleGenreChange("Adventure")} />
                        <label>Fantasy</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Fantasy" onChange={() => handleGenreChange("Fantasy")} />
                        <label>Sci-Fi</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Sci-Fi" onChange={() => handleGenreChange("Sci-Fi")} />
                        <label>Crime</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Crime" onChange={() => handleGenreChange("Crime")} />
                        <label>Comedy</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Comedy" onChange={() => handleGenreChange("Comedy")} />
                        <label>Drama</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Drama" onChange={() => handleGenreChange("Drama")} />
                        <label>Romance</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Romance" onChange={() => handleGenreChange("Romance")}  />
                        <label>Horror</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Horror" onChange={() => handleGenreChange("Horror")} />
                        <label>Musical</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Musical" onChange={() => handleGenreChange("Musical")} />
                        <label>Mystery</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Mystery" onChange={() => handleGenreChange("Mystery")} />
                        <label>Thriller</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Thriller" onChange={() => handleGenreChange("Thriller")} />
                        <label>Family</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Family" onChange={() => handleGenreChange("Family")} />
                        <label>Animation</label>
                        <input type="checkbox" name="varGenreCheckbox" value="Animation" onChange={() => handleGenreChange("Animation")} />
                        <label>History</label>
                        <input type="checkbox" name="varGenreCheckbox" value="History" onChange={() => handleGenreChange("History")} />
                    </fieldset>
                </div>
                <div id="yearFilter">
                    <h3>Release Year</h3>
                    <fieldset>
                        <legend>Min. Year</legend>
                        <input id="minYearRange" type="range" name="varMinYearRange" min="1900" max="2024" step="1" value={minYear} onChange={(e) => setMinYear(e.target.value)} />
                        <output id="minYearOutput">{minYear}</output>
                    </fieldset>
                    <fieldset>
                        <legend>Max. Year</legend>
                        <input id="maxYearRange" type="range" name="varMaxYearRange" min="1900" max="2024" step="1" value={maxYear} onChange={(e) => setMaxYear(e.target.value)} />
                        <output id="maxYearOutput">{maxYear}</output>
                    </fieldset>
                </div>
                <div id="scoreFilter">
                    <h3>Score</h3>
                    <fieldset>
                        <legend>Min. Score</legend>
                        <input id="scoreRange" type="range" name="varScoreRange" min="0" max="10" step="0.5" value={minScore} onChange={(e) => setMinScore(e.target.value)} />
                        <output id="scoreOutput">{minScore}</output>
                    </fieldset>
                </div>
                <div id="ratingFilter">
                    <h3>Rating</h3>
                    <div>
                        <fieldset>
                            <legend>Max. Rating</legend>
                            <input type="radio" id="anyRating" name="varRating" value="anyRating" onChange={() => setRating("Any")} />
                            <label>Any</label>
                            <input type="radio" id="gRating" name="varRating" value="gRating" onChange={() => setRating("G")} />
                            <label>G</label>
                            <input type="radio" id="pgRating" name="varRating" value="pgRating" onChange={() => setRating("PG")} />
                            <label>PG</label>
                            <input type="radio" id="pg13Rating" name="varRating" value="pg13Rating" onChange={() => setRating("PG-13")} />
                            <label>PG-13</label>
                            <input type="radio" id="rRating" name="varRating" value="rRating" onChange={() => setRating("R")} />
                            <label>R</label>
                          </fieldset>
                    </div>
                </div>
                <div id="applyFilters">
                {props.authState === "unauthenticated" &&
                    <h5>&#9888; Please Log In to Use This Feature</h5>
                }
                <button type="submit" className="button" onClick={(e) => updateSearch(e)} disabled={props.authState === "unauthenticated"}>Apply Filters</button>
                </div>
            </div>
            <div id="results" className="center">
                <h2>Results</h2>
                <table id="resultsList">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>{resultsRows}</tbody>
                </table>
                {resultsRows.length === 0 && (
                    <>
                        <h5>No Results Found</h5>
                        {resultsError && <h5>&#9888; {resultsError}</h5>}
                    </>
                )}
                <button id="randomButton" type="submit" className="button" onClick={(e) => getRandomMovie(e)} disabled={props.authState === "unauthenticated"}>Random Movie</button>
            </div>
        </main>
    );
}