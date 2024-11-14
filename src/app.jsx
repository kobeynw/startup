import React from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Collection } from './collection/collection';
import { Filter } from './filter/filter';
import { Voting } from './voting/voting';

export default function App() {
    const [username, setUsername] = React.useState(localStorage.getItem('username') || '');
    const [password, setpassword] = React.useState('');
    const currentAuthState = username ? "authenticated" : "unauthenticated";
    const [authState, setAuthState] = React.useState(currentAuthState);

    function logoutUser() {
        fetch('/api/auth/logout', {
            method: 'delete'
        })
            .catch(() => {
                // Logout failed (User likely offline)
            })
            .finally(() => {
                localStorage.removeItem('username');
                setAuthState("unauthenticated");
            });
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
                                <img className="movieKnightTitle" src="/movieKnightTitle_01.png" height="50px"></img>
                                <img id="secondWord" className="movieKnightTitle" src="/movieKnightTitle_02.png" height="50px"></img>
                            </h1>
                        )}
                        {authState === "unauthenticated" && (
                            <h1>
                                <NavLink to="">
                                    <h1>
                                        <img className="movieKnightTitle" src="/movieKnightTitle_01.png" height="50px"></img>
                                        <img id="secondWord" className="movieKnightTitle" src="/movieKnightTitle_02.png" height="50px"></img>
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
                        <div className="userInfoDisplay">
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
                                    password={password}
                                    authState={authState}
                                    onAuthChange={(username, password, authState) => {
                                        setAuthState(authState);
                                        setUsername(username);
                                        setpassword(password);
                                    }}
                                />} exact 
                            />
                            <Route path='/collection' element={<Collection username={username} authState={authState} />} />
                        </>
                    )}
                    {authState === "authenticated" && (
                        <Route path='/' element={<Collection username={username} authState={authState} />} />
                    )}
                    <Route path='/collection' element={<Collection username={username} authState={authState} />} />
                    <Route path='/filter' element={<Filter username={username} authState={authState} />} />
                    <Route path='/voting' element={<Voting username={username} authState={authState} />} />
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