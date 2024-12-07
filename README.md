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

<img src="https://github.com/kobeynw/startup/blob/main/pictures/startupDesign_1.png" width="50%">
<img src="https://github.com/kobeynw/startup/blob/main/pictures/startupDesign_2.png" width="50%">
<img src="https://github.com/kobeynw/startup/blob/main/pictures/startupDesign_3.png" width="50%">
<img src="https://github.com/kobeynw/startup/blob/main/pictures/startupDesign_4.png" width="50%">

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

> ## HTML Content

### HTML Pages
- Page 1: user login and authentication page
- Page 2: creating a personal movie collection from a search or by custom input
- Page 3: filtering movies based on criteria or by random selection
- Page 4: hosting or joining a room where users can vote on a movie to watch

### Tags
- Uses several different tags, including BODY, NAV, MAIN, HEADER, FOOTER

### Links
- Main page currently has the same navbar setup as the other pages, which contain links to the other pages in the site
- The main page navbar will eventually be replaced by functionality that will redirect the user to the collection page once they submit login credentials

### Textual Content
- Movie information is displayed in a table format, with filler information temporarily
- Button labels, table information, header and footer content, party information (also temporary) are all present

### Third Party Service Placeholders
- The Collection page will eventually have a search functionality that makes API calls to fetch movie information such as title, director, release year, etc.
- Currently there is a placeholder table with random movie information

### Images
- Knight helmet favicon icon
- Knight helmet logo for the top next to the navbar

### Login
- Username and password login and authentication on main page
- Username display and logout button on other pages

### Database
- The Collection page will eventually display the movies and information that the user has stored
- The collection table currently displays random placeholder movie info

### Websocket
- The Voting page will eventually display real-time movie votes from various users

> ## CSS Content

### Header, Footer, and Main content
- Header and footer styled in blocks with consistent link styles and spacing
- Main content styled as cards with consistent button and table styling

### Navigation
- Links styled with highlighting/scaling
- Current page link is disabled for clarity and simplicity

### Responsiveness
- Style and layout change as window is resized
- Certain elements are discarded with small sizes, such as the knight image in the header
- Card elements transition from row layout to column layout with smaller screen sizes

### Application Elements
- Uses card styling for separation of elements
- Styled tables consistently for collection, search functionality, and filter results functionality
- Consistent colors and spacing

### Application Text Content
- Uses custom font for app title in the header, and for room party members
- Uses sans-serif simple font for other text

### Application Images
- Includes logo image in the header
- Using icon images for the footer links
- Uses a favicon for tab display

> ## React Content

### Converting to React Framework
- Bundled using Vite and transpiled

### Components
- **Login** - (Login) - User can enter and submit a username and password, which logs in or registers the user and takes them to the collection page
- **Collection** - (API Service, Database) - Populates the user's collection with two initial mock movie entries; allows the user to search for any movie and calls the omdb API directly; allows the user to add or delete movies to and from their collection, but does not save data yet
- **Filter** - (Database) - Allows users to filter personal collection with certain criteria; currently only four mock movies are used as an example (these mock movies require at lease one of the following filters: "Action", "Adventure", "Sci-Fi", "Comedy", "Family", or "Animation" genres; and "Any" or "PG-13" ratings)
- **Voting** - (Websocket) - Will allow users to create or join a real-time voting room, but currently allows any Room ID to be entered to join, and uses two other mock usernames; allows users to add movies to be voted for, and vote for current movies

### Router
- Successfully routes login, collection, filter, and voting components

### Hooks
- Utilizes useState for every page for various state variables
- Utilizes useEffect on the collection page to re-render the page when necessary

> ## Service Content

### Node.js/Express HTTP service
- Successfully created and deployed

### Static middleware for frontend
- Front end served up using Express static middleware

### Calls to third party endpoints
- Makes calls to the OMDB third party API
- Searches movies to add to the user's collection
- Filters movies from the collection based on different criteria

### Backend service endpoints
- Register, Login, and Logout endpoints for authentication (will use database for persistence later)
- Get, Add, and Delete endpoints for user collection manipulation

### Frontend calls service endpoints
- Login component calls Register and Login endpoints
- App component calls Logout endpoint
- Collection component calls Get, Add, and Delete endpoints
- Filter component calls Get endpoint

> ## Database/Login Content

### User registration
- User registration endpoint updates MongoDB database for user data persistence

### User authentication and logout
- Authentication is required to store and update movie collections under a certain username
- Auth tokens are used during a session and deleted upon logout

### Stores data in MongoDB
- User information (username, password, auth token) are stored in a database for data persistence
- User movie collections are likewise stored in a database

### Stores and retrieves credentials in MongoDB
- User information and user movie collections are stored in MongoDB

### Restricted functionality based on authentication state
- Registration is restricted if username is already in use
- Login is restricted if username and password are not in the database
- All collection manipulation, voting, and 3rd party movie search calls are restricted unless a user is logged in

> ## WebSocket Content

### Backend listens for WebSocket communication
- Created a peer proxy to listen for incoming communications and to send outgoing responses
- Handles internal party separation for distinct connections and distinct parties holding certain connections

### Frontend makes WebSocket connection
- Created a room communicator to listen for incoming peer proxy responses and to send outgoing requests
- Handles different events sent to the voting page (create room, join room, add movie, add vote, system notifications, and error messages)

### Data sent over WebSocket connection
- Uses request and response classes to separate information into packages that are serialized and deserialized easily
- Classes hold information such as event type, usernames, room names, room IDs, etc

### WebSocket data displayed
- Party name, ID, and members displayed
- Movie candidates and votes displayed

### All visible elements are working
- Create Room (updates room name, room ID, and members)
- Join Room (updates room name, room ID, and members)
- Add Movie (updates movie candidates and initializes votes)
- Add Vote (updates vote for specific movie)