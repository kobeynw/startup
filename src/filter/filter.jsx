import React from 'react';

export function Filter() {
    return (
        <main id="filterMain">
            <div id="filter" className="center">
                <h2 id="filterLabel">Filters</h2>
                <div id="genreFilter">
                    <h3>Genre</h3>
                    <fieldset>
                        <legend>Included Genres</legend>
                        <label for="genre1">Genre 1</label>
                        <input type="checkbox" name="varGenreCheckbox" value="genre1" checked />
                        <label for="genre2">Genre 2</label>
                        <input type="checkbox" name="varGenreCheckbox" value="genre2" />
                        <label for="genre3">Genre 3</label>
                        <input type="checkbox" name="varGenreCheckbox" value="genre3" />
                    </fieldset>
                </div>
                <div id="scoreFilter">
                    <h3>Score</h3>
                    <fieldset>
                        <legend>Min. Score</legend>
                        <input id="scoreRange" type="range" name="varScoreRange" min="0" max="10" step="0.5" value="0" />
                        <output id="scoreOutput" for="scoreRange">0</output>
                    </fieldset>
                </div>
                <div id="yearFilter">
                    <h3>Release Year</h3>
                    <fieldset>
                        <legend>Min. Year</legend>
                        <input id="minYearRange" type="range" name="varMinYearRange" min="1900" max="2024" step="1" value="1900" />
                        <output id="minYearOutput" for="minYearRange">1900</output>
                    </fieldset>
                    <fieldset>
                        <legend>Max. Year</legend>
                        <input id="maxYearRange" type="range" name="varMaxYearRange" min="1900" max="2024" step="1" value="2024" />
                        <output id="maxYearOutput" for="maxYearRange">2024</output>
                    </fieldset>
                </div>
                <div id="ratingFilter">
                    <h3>Rating</h3>
                    <div>
                        <fieldset>
                            <legend>Max. Rating</legend>
                            <label for="anyRating">Any</label>
                            <input type="radio" id="anyRating" name="varRating" value="anyRating" checked />
                            <label for="gRating">G</label>
                            <input type="radio" id="gRating" name="varRating" value="gRating" />
                            <label for="pgRating">PG</label>
                            <input type="radio" id="pgRating" name="varRating" value="pgRating" />
                            <label for="pg13Rating">PG-13</label>
                            <input type="radio" id="pg13Rating" name="varRating" value="pg13Rating" />
                            <label for="rRating">R</label>
                            <input type="radio" id="rRating" name="varRating" value="rRating" />
                          </fieldset>
                    </div>
                </div>
                <button id="applyFilters" type="submit" className="button">Apply Filters</button>
            </div>
            <div id="results" className="center">
                <h2>Results</h2>
                <table id="resultsList">
                    <tr>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Year</th>
                    </tr>
                    <tr>
                        <td>Title 1</td>
                        <td>Director 1</td>
                        <td>Year 1</td>
                    </tr>
                    <tr>
                        <td>Title 2</td>
                        <td>Director 2</td>
                        <td>Year 2</td>
                    </tr>
                </table>
                <button id="randomButton" type="submit" className="button">Random Movie</button>
            </div>
        </main>
    );
}