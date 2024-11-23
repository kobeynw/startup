import React from 'react';

export function Login(props) {
    const [username, setUsername] = React.useState(props.username);
    const [password, setPassword] = React.useState(props.password);
    const [isTaken, setIsTaken] = React.useState(false);
    const [isInvalid, setIsInvalid] = React.useState(false);

    async function authEndpoint(endpoint) {
        setIsInvalid(false);
        setIsTaken(false);
        const response = await fetch(endpoint, {
            method: 'post',
            body: JSON.stringify({ username: username, password: password }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });

        if (response?.status === 200) {
            props.onAuthChange(username, password, "authenticated");
        } else if (response?.status === 401) {
            setIsInvalid(true);
        } else if (response?.status === 409) {
            setIsTaken(true);
        }
    }

    async function loginUser(e) {
        e.preventDefault();
        authEndpoint('/api/auth/login');
    }

    async function createUser(e) {
        e.preventDefault();
        authEndpoint('/api/auth/create');
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
                        {isTaken &&
                            <h5>&#9888; Username Taken</h5>
                        }
                        {isInvalid &&
                            <h5>&#9888; Invalid Username or Password</h5>
                        }
                        <button id="loginButton" type="submit" onClick={(e) => loginUser(e)} disabled={!username || !password}>Login</button>
                        <button id="createAccountButton" type="submit" onClick={(e) => createUser(e)} disabled={!username || !password}>Create Account</button>
                    </div>
                </form>
            </div>
        </main>
    );
}