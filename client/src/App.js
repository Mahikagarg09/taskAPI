import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Tasks from './components/Tasks';

const App = () => {

  const[authenticated,setAuthenticated] = useState(false);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={authenticated ? <Tasks/> : <Auth setAuthenticated={setAuthenticated}/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
