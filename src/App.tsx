import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
import Search from './pages/Search'
import ChooseWinner from './pages/ChooseWinner'
import AnnounceWinner from './pages/AnnounceWinner';
import WinnerPending from './pages/WinnerPending'
import NoSubmissions from './pages/NoSubmissions';

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
        <Route path="/search/:query" element={<Search />} />;
        <Route path="/chooseWinner" element={<ChooseWinner />} />
        <Route path="/announceWinner" element={<AnnounceWinner />} />
        <Route path="/winnerPending" element={<WinnerPending />} />
        <Route path="/noSubmissions" element={<NoSubmissions />} />
      </Routes>
    </div >
  );
}

export default App;
