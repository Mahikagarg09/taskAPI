import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Tasks from './components/Tasks';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth');

        if (response.status === 200) {
          setAuthenticated(true);
        }
      } catch (error) {
        // If an error occurs or user is not authenticated, setAuthenticated(false)
        setAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={authenticated ? <Tasks /> : <Navigate to="/auth" />}
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
