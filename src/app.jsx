import React from 'react';
import './app.css';

export default function App() {
    return (
        <div className='body'>
            <header>
                <nav>
                    <div><img id="logo" src="/movieKnightLogo.PNG" width="100px"></img></div>
                    <div><h1>Movie Knight</h1></div>
                    <div>
                        <ul>
                            <li><a href="./collection.html"><b>My Collection</b></a></li>
                            <li><a href="./filter.html"><b>Movie Filter</b></a></li>
                            <li><a href="./voting.html"><b>Voting Room</b></a></li>
                        </ul>
                    </div>
                    <div>
                        <button id="user" className="icon"><img src="/userIcon.png" width="50px"></img></button>
                    </div>
                </nav>
            </header>

            <main>App Components Here</main>

            <footer>
                <ul>
                    <li><b>Kobey Workman</b></li>
                    <li><a className="icon" href="https://github.com/kobeynw/startup" target="_blank"><img src="/github_icon.png" width="40px"></img></a></li>
                    <li><a className="icon" href="https://www.linkedin.com/in/kobey-workman/" target="_blank"><img src="/linkedin_icon.png" width="40px"></img></a></li>
                    <li><a className="icon" href="mailto: kobeyworkman1@gmail.com"><img src="/email_icon.png" width="40px"></img></a></li>
                </ul>
            </footer>
        </div>
    );
}