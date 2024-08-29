# startup "Movie Knight"
A movie night movie selector app made with *HTML*, *CSS*, and *JS*, hosted through *AWS*.

> ## Specifications

### Pitch
Have you ever had a movie night where nobody could decide on a movie to watch? Do you wish it were easier to choose from so many movie options while making sure everyone gets a say? **Movie Knight** helps those looking to throw massive movie night extravaganzas, as well as the casual movie-watchers. Add movies to your personalized collection, then filter them by genre, director, release year, etc. Or host a room where other users can vote on their favorite movies to make the decision-making process a breeze.

### Key Features

- Login and user authentication
- Utilize https://www.omdbapi.com/ movie database API for movie information
- Create and customize a personal movie collection with movie search function or custom input
- Filter movies based on genre, rating, etc or get a random movie recommendation
- Create a movie night vote room where other users can join and vote on a movie from your collection or from the movie database
- Votes update in real time across devices

### Design

<img src="https://github.com/kobeynw/startup/blob/main/startupDesign_1.png" width="50%">
<img src="https://github.com/kobeynw/startup/blob/main/startupDesign_2.png" width="50%">
<img src="https://github.com/kobeynw/startup/blob/main/startupDesign_3.png" width="50%">
<img src="https://github.com/kobeynw/startup/blob/main/startupDesign_4.png" width="50%">

### Technologies

*HTML*
- Page 1: user login and authentication page
- Page 2: creating a personal movie collection from a search or by custom input
- Page 3: filtering movies based on criteria or by random selection
- Page 4: hosting or joining a room where users can vote on a movie to watch

*CSS*
- Medieval themed colors/styles
- Adaptive layout based on screen size and/or device setup

*JavaScript*
- Button functionality (e.g. login button or add to collection button)
- Populate tables with movie information
- Apply filters to movie database
- Display users and votes in voting room

*React*
- Updated page setup for modularity and simplicity via components

*Web Service*
- Access to movie database through https://www.omdbapi.com/
- Retrieve personal collection of movies
- Retrieve votes and submit votes
- Retrieve room name and room participants

*Authentication*
- Save and authenticate username and password for different users

*Database*
- Personal movie collections stored in a database
- Includes movie title, genre, director, release year, etc.

*Websocket*
- Movie votes are updated in real time across devices