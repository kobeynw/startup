import React from 'react';

export function Login(props) {
    const [username, setUsername] = React.useState(props.username);
    const [password, setPassword] = React.useState(props.password);

    function loginUser() {
        localStorage.setItem('username', username);
        props.onAuthChange(username, password, "authenticated");
    }

    return (
        <main>
            <div id="loginContainer" className="center">
                <h2 id="loginLabel">Account Login</h2>
                <form method="get">
                    <div>
                        <h3>Username:</h3>
                        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <h3>Password:</h3>
                        <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <button id="loginButton" type="submit" onClick={() => loginUser()} disabled={!username || !password}>Login</button>
                        <button id="createAccountButton" type="submit" onClick={() => loginUser()} disabled={!username || !password}>Create Account</button>
                    </div>
                </form>
            </div>
        </main>
    );
}