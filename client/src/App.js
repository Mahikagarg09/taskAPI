import React from 'react'
import Auth from './components/Auth'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tasks from './components/Tasks';

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<Tasks/>} />
          <Route path="/auth" element={<Auth/>} />
        </Routes>
      </Router>
    </div>
  )
}
