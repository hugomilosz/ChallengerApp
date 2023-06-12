import React from "react";

const Login = () => {
    return (
        <div className="auth">
            <h1>Login</h1>
            <form action="/login/password" method="post">
                <input type="text" id="username" name="username" placeholder='username' autoComplete="username" required autoFocus />
                <br />
                <input type="password" placeholder="password" id="password" name="password" autoComplete="current-password" required />
                <br />
                <button type="submit">Login</button>
            </form>
            <h1>Don't have an account?</h1>
            <h2>Sign up!</h2>
            <form action="/signup" method="post">
                <input type="text" id="usernameSignup" name="username" placeholder='username' autoComplete="username" required />
                <br />
                <input type="password" placeholder="password" id="passwordSignup" name="password" autoComplete="current-password" required />
                <br />
                <button type="submit">Signup</button>
            </form>
        </div>
    )
}

export default Login