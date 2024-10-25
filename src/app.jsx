import React from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Collection } from './collection/collection';
import { Filter } from './filter/filter';
import { Voting } from './voting/voting';

export default function App() {
    const [username, setUsername] = React.useState(localStorage.getItem('username') || '');
    const currentAuthState = username ? "authenticated" : "unauthenticated";
    const [authState, setAuthState] = React.useState(currentAuthState);

    function logoutUser() {
        localStorage.removeItem('userName');
        setAuthState("unauthenticated");
    }

    return (
        <BrowserRouter>
            <div className='body'>
                <header>
                    <nav>
                        <div><img id="logo" src="/movieKnightLogo.png" width="50px"></img></div>
                        <div>
                        {authState === "authenticated" && (
                            <h1>
                                <img class="movieKnightTitle" src="/movieKnightTitle_01.png" height="50px"></img>
                                <img id="secondWord" class="movieKnightTitle" src="/movieKnightTitle_02.png" height="50px"></img>
                            </h1>
                        )}
                        {authState === "unauthenticated" && (
                            <h1>
                                <NavLink to="">
                                    <h1>
                                        <img class="movieKnightTitle" src="/movieKnightTitle_01.png" height="50px"></img>
                                        <img id="secondWord" class="movieKnightTitle" src="/movieKnightTitle_02.png" height="50px"></img>
                                    </h1>
                                </NavLink>
                            </h1>
                        )}
                        </div>
                        <div>
                            <ul>
                                <li><NavLink to="collection"><b>My Collection</b></NavLink></li>
                                <li><NavLink to="filter"><b>Movie Filter</b></NavLink></li>
                                <li><NavLink to="voting"><b>Voting Room</b></NavLink></li>
                            </ul>
                        </div>
                        <div class="userInfoDisplay">
                            <button className="button" onClick={() => logoutUser()} disabled={authState === "unauthenticated"}>Logout</button>
                        </div>
                    </nav>
                </header>

                <Routes>
                    {authState === "unauthenticated" && (
                        <>
                            <Route path='/' element={
                                <Login 
                                    username={username}
                                    authState={authState}
                                    onAuthChange={(username, authState) => {
                                        setAuthState(authState);
                                        setUsername(username);
                                    }}
                                />} exact 
                            />
                            <Route path='/collection' element={<Collection />} />
                        </>
                    )}
                    {authState === "authenticated" && (
                        <Route path='/' element={<Collection />} />
                    )}
                    <Route path='/collection' element={<Collection />} />
                    <Route path='/filter' element={<Filter />} />
                    <Route path='/voting' element={<Voting />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>

                <footer>
                    <ul>
                        <li><b>Kobey Workman</b></li>
                        <li><a className="icon" href="https://github.com/kobeynw/startup" target="_blank"><img src="/github_icon.png" width="40px"></img></a></li>
                        <li><a className="icon" href="https://www.linkedin.com/in/kobey-workman/" target="_blank"><img src="/linkedin_icon.png" width="40px"></img></a></li>
                        <li><a className="icon" href="mailto: kobeyworkman1@gmail.com"><img src="/email_icon.png" width="40px"></img></a></li>
                    </ul>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main id="notFound">404: Return to sender. Address unknown.</main>;
}