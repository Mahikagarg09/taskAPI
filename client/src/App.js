import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Tasks from './components/Tasks';

const App = () => {

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Tasks/>}
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
