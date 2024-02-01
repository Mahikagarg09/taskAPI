import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Tasks from './components/Tasks';

const App = () => {

  return (
    <div>
      <Router>
        <Routes>
          <Auth/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
