import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import MakeChallenge from './pages/MakeChallenge';
import Home from './pages/Home';
import NavBar from './NavBar'

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <div>Home</div>
//   },
//   {
//     path: "/login",
//     element: <Login/>,
//   },
// ])

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/makeChallenge" element={<MakeChallenge />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
