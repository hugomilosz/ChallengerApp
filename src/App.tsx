import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import MakeChallenge from './pages/MakeChallenge';
import Home from './pages/Home';
import NavBar from './NavBar'
import ViewChallenge from './pages/ViewChallenge';
import ViewSubmissions from './pages/ViewSubmissions';
import UploadSubmission from './pages/UploadSubmission';
import Search from './pages/Search'

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
        <Route path="/uploadSubmission" element={<UploadSubmission />} />
        <Route path="/search/:query" element={<Search />} />;
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </div >
  );
}

export default App;
