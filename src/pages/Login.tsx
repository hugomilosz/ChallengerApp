import React from "react";

const Login = () => {
    return (
        <div className="auth">
            <h1>Login</h1>
            <form>
                <input type="text" placeholder='username' />
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login