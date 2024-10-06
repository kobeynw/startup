import React from 'react';

export function Collection() {
    return (
        <main id="collectionMain">
            <div id="collection" className="center">
                <h2>My Collection</h2>
                <table id="collectionList">
                    <tr>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Year</th>
                        <th>Options</th>
                    </tr>
                    <tr>
                        <td>Guardians of the Galaxy Vol. 1</td>
                        <td>James Gunn</td>
                        <td>2014</td>
                        <td><button className="collectionDeleteButton">Delete</button></td>
                    </tr>
                    <tr>
                        <td>Star Wars: A New Hope</td>
                        <td>George Lucas</td>
                        <td>1977</td>
                        <td><button className="collectionDeleteButton">Delete</button></td>
                    </tr>
                </table>
                <button className="button">Add Custom Movie</button>
            </div>
            <div id="database" className="center">
                <h2>Movie Database</h2>
                <input id="titleInput" placeholder="Search for a movie..." />
                <button id="titleSubmit" type="submit" className="button">Search</button>
                <table id="searchList">
                    <tr>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Year</th>
                    </tr>
                    <tr>
                        <td>Guardians of the Galaxy Vol. 1</td>
                        <td>James Gunn</td>
                        <td>2014</td>
                    </tr>
                    <tr>
                        <td>Star Wars: A New Hope</td>
                        <td>George Lucas</td>
                        <td>1977</td>
                    </tr>
                </table>
                <button className="button">Add to Collection</button>
            </div>
        </main>
    );
}