import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Options from './pages/Options';
import Vote from './pages/Vote';
import Home from './pages/Home';

function App() {

  const [currPage, setCurrentPage] = useState('');

  useEffect(() => {
    if (window.location.pathname.split('/')[2] === 'options') {
      setCurrentPage('Options');
    } else if (window.location.pathname.split('/')[2] === 'vote') {
      setCurrentPage('Vote');
    } else {
      setCurrentPage('Home')
    }

  }, []);


  const handlePageChange = (page) => {
    console.log(page);
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (currPage === 'Options') {
      return <Options handlePageChange={handlePageChange} />;
    } else if (currPage === 'Vote') {
      return <Vote handlePageChange={handlePageChange} />
    } else {
      return <Home handlePageChange={handlePageChange} />
    }
  };

  return (
      <div className="flex-column justify-flex-start min-100-vh">
        <Header handlePageChange={handlePageChange} />
        <div id="routeCon">
          {renderPage()}
        </div>
      </div>
  );
}

export default App;
