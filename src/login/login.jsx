import React from 'react';

export function Login() {
    return (
        <main>
            <div id="loginContainer" className="center">
                <h2 id="loginLabel">Account Login</h2>
                <form method="get">
                    <div>
                        <h3>Username:</h3>
                        <input id="username" type="text" />
                    </div>
                    <div>
                        <h3>Password:</h3>
                        <input id="password" type="password" />
                    </div>
                    <div>
                        <button id="loginButton" type="submit">Login</button>
                        <button id="createAccountButton" type="submit">Create Account</button>
                    </div>
                </form>
            </div>
        </main>
    );
}