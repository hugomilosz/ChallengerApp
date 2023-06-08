import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import SetChallengeChoice from './pages/SetChallengeChoice';
import SetChallengeTemplate from './pages/SetChallengeTemplate'
import SetChallengeCheckout from './pages/SetChallengeCheckout';
import Home from './pages/Home';
import NavBar from './NavBar'
import ViewChallenge from './pages/ViewChallenge';
import ViewSubmissions from './pages/ViewSubmissions';
import UploadSubmission from './pages/UploadSubmission';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setChallengeChoice" element={<SetChallengeChoice />} />
        <Route path="/setChallengeCheckout" element={<SetChallengeCheckout />} />
        <Route path="/setChallengeTemplate" element={<SetChallengeTemplate />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/viewChallenge" element={<ViewChallenge />} />
        <Route path="/viewSubmissions" element={<ViewSubmissions />} />
        <Route path="/uploadSubmission" element={<UploadSubmission />} />
      </Routes>
    </div>
  );
}

export default App;
