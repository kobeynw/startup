import React from 'react';

export function Login(props) {
    const [userName, setUserName] = React.useState(props.userName);
    const [password, setPassword] = React.useState('');

    function loginUser() {
        localStorage.setItem('userName', userName);
        props.onAuthChange(userName, "authenticated");
    }

    return (
        <main>
            <div id="loginContainer" className="center">
                <h2 id="loginLabel">Account Login</h2>
                <form method="get">
                    <div>
                        <h3>Username:</h3>
                        <input id="username" type="text" onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div>
                        <h3>Password:</h3>
                        <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <button id="loginButton" type="submit" onClick={() => loginUser()} disabled={!userName || !password}>Login</button>
                        <button id="createAccountButton" type="submit" onClick={() => loginUser()} disabled={!userName || !password}>Create Account</button>
                    </div>
                </form>
            </div>
        </main>
    );
}