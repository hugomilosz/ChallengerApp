import { Button, TextField, styled } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";

const CustomTextField = styled(TextField)(({ theme }: any) => {   
    return {
        'label.Mui-focused': {
            color: tokens(theme.palette.mode).yellow[500]
        },
        /* focused */
        '.MuiInput-underline:after': {
            borderBottom: `2px solid ${tokens(theme.palette.mode).yellow[500]}`
        }
    }
});

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
                <CustomTextField
                    required
                    type="text"
                    variant="standard"
                    id="username"
                    label="Username"
                    placeholder='Username'
                    autoComplete="username"
                    style={{ marginTop: 20, 
                            marginBottom: 10,
                            width: 300,
                            maxWidth: 300 }} 
                    name="username"
                    autoFocus
                />
                <br />
                <CustomTextField
                    required
                    type="password"
                    variant="standard"
                    id="password"
                    label="Password"
                    placeholder='Password'
                    autoComplete="password"
                    style={{ marginTop: 20, 
                            marginBottom: 10,
                            width: 300,
                            maxWidth: 300 }} 
                    name="password"
                    autoFocus
                />
                <br />
                <Button 
                    variant="contained"
                    color='secondary'
                    style={{ 
                        marginBottom: 10,
                        width: 300,
                        maxWidth: 300
                    }} 
                    type="submit"
                >
                    Login
                </Button>
            </form>
            <h1>Don't have an account?</h1>
            <h2>Sign up!</h2>
            <form onSubmit={handleSignup}>
                <CustomTextField
                    required
                    type="text"
                    variant="standard"
                    id="usernameSignup"
                    label="Username"
                    placeholder='Username'
                    autoComplete="username"
                    style={{ marginTop: 20, 
                            marginBottom: 10,
                            width: 300,
                            maxWidth: 300 }} 
                    name="username"
                    autoFocus
                />
                <br />
                <CustomTextField
                    required
                    type="password"
                    variant="standard"
                    id="passwordSignup"
                    label="Password"
                    placeholder='Password'
                    autoComplete="current-password"
                    style={{ marginTop: 20, 
                            marginBottom: 10,
                            width: 300,
                            maxWidth: 300 }} 
                    name="password"
                    autoFocus
                />
                <br />
                <Button 
                    variant="contained"
                    color='secondary'
                    style={{ 
                        marginBottom: 10,
                        width: 300,
                        maxWidth: 300
                    }} 
                    type="submit"
                >
                    Signup
                </Button>
            </form>
        </div>
    )
}

export default Login