// import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import MakeChallenge from './pages/MakeChallenge';
import Home from './pages/Home';
import NavBar from './NavBar'
import ViewChallenge from './pages/ViewChallenge';
import ViewSubmissions from './pages/ViewSubmissions';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/makeChallenge" element={<MakeChallenge />} />
        <Route path="/login" element={<Login />} />
        <Route path="/viewChallenge" element={<ViewChallenge />} />
        <Route path="/viewSubmissions" element={<ViewSubmissions />} />
      </Routes>
    </div>
  );
}

export default App;
