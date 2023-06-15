import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const response = await fetch("/login/password", {
                method: "POST",
                body: JSON.stringify({
                username: event.currentTarget.username.value,
                password: event.currentTarget.password.value,
                }),
                headers: {
                "Content-Type": "application/json",
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // If success, go back to the previous page
                    navigate(-1);
                }
                else {
                    // Login unsuccessful
                    alert("Login unsuccessful");
                    window.location.reload();
                }
             }
            else {
                alert("Invalid username or password");
                window.location.reload();
            }
        } catch (error) {
            console.log("Error occurred during login:", error);
            window.location.reload();
        }
      };
    
      const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const form = event.target as HTMLFormElement;
        const username = form.username.value;
        const password = form.password.value;
    
        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                username: username,
                password: password,
                }),
            });
    
            if (response.ok) {
                // Signup successful
                navigate(-1);
            } else {
                // Signup unsuccessful
                console.log("Error occurred during signup:", await response.text());
                window.location.reload();
            }
        } 
        catch (error) {
            console.log("Error occurred during signup:", error);
            window.location.reload();
        }
      };




    return (
        <div className="auth">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="text" id="username" name="username" placeholder='username' autoComplete="username" required autoFocus />
                <br />
                <input type="password" placeholder="password" id="password" name="password" autoComplete="current-password" required />
                <br />
                <button type="submit">Login</button>
            </form>
            <h1>Don't have an account?</h1>
            <h2>Sign up!</h2>
            <form onSubmit={handleSignup}>
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