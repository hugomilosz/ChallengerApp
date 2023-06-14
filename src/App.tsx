import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ColourModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

import './App.css';

import NavBar from './pages/global/NavBar'
import TopBar from './pages/global/TopBar';


import Home from './pages/Home';
import Login from './pages/Login';
import ViewChallenge from './pages/ViewChallenge';
import SetChallengeChoice from './pages/SetChallengeChoice';

import SetChallengeTemplate from './pages/SetChallengeTemplate'
import SetChallengeCheckout from './pages/SetChallengeCheckout';

import ViewSubmissions from './pages/ViewSubmissions';
import UploadSubmission from './pages/UploadSubmission';

import Search from './pages/Search'

import ChooseWinner from './pages/ChooseWinner'
import AnnounceWinner from './pages/AnnounceWinner';
import WinnerPending from './pages/WinnerPending'
import NoSubmissions from './pages/NoSubmissions';
import NoWinner from './pages/NoWinner';
import NoSubsPending from './pages/NoSubsPending';

import Logout from './pages/Logout';


function App() {
    const [theme, mode] = useMode();

    return (
        <ColourModeContext.Provider value={mode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="App">
                    <main className='content'>
                        <TopBar />
                        <NavBar />
                        <div style={{  paddingTop: "50px" }}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/setChallengeChoice" element={<SetChallengeChoice />} />
                                <Route path="/setChallengeCheckout" element={<SetChallengeCheckout />} />
                                <Route path="/setChallengeTemplate" element={<SetChallengeTemplate />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route path="/viewChallenge" element={<ViewChallenge />} />
                                <Route path="/viewSubmissions" element={<ViewSubmissions />} />
                                <Route path="/uploadSubmission" element={<UploadSubmission />} />
                                <Route path="/search/:query" element={<Search />} />;
                                <Route path="/chooseWinner" element={<ChooseWinner />} />
                                <Route path="/announceWinner" element={<AnnounceWinner />} />
                                <Route path="/winnerPending" element={<WinnerPending />} />
                                <Route path="/noSubmissions" element={<NoSubmissions />} />
                                <Route path="/noWinner" element={<NoWinner />} />
                                <Route path="/noSubsPending" element={<NoSubsPending />} />
                                <Route path='*' element={<Navigate to="/" />} />
                            </Routes>
                        </div>
                    </main>
                </div >
            </ThemeProvider>
        </ColourModeContext.Provider>
    );
}

export default App;
