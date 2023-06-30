import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Options from './pages/Options';
import Vote from './pages/Vote';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div id="routeCon">
          <Routes>
            <Route 
              path="/" 
              element={<Home />} 
            />
            <Route 
              path="/options/:type" 
              element={<Options />} 
            />
            <Route 
              path="/vote/:type" 
              element={<Vote />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
