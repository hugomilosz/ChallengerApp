import React from "react";

const Login = () => {
    return (
        <div className="auth">
            <h1>Login</h1>
            <form>
                <input type="text" id="username" name="username" placeholder='username' autoComplete="username" required autoFocus />
                <br />
                <input type="password" placeholder="password" id="password" name="password" autoComplete="current-password" />
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login