import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/login">Login</Link>
            </li>
            <li>
                <Link to="/makeChallenge">Make Challenge</Link>
            </li>
        </ul>
    );
}

export default NavBar