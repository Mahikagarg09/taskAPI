import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = isSignUp ? 'https://localhost:3000/api/auth/register' : 'https://localhost:3000/api/auth/login';
      const response = await axios.post(apiUrl, { email, password, phone });
      
      // Handle successful response, e.g., redirect to a new page or update state
      console.log(response.data);

    } catch (error) {
      // Handle error, e.g., display an error message
      console.error(error);
    }

    // Reset form fields after submission
    setEmail('');
    setPassword('');
    setPhone('');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">{isSignUp ? 'Sign Up' : 'Login'}</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone:</label>
                  <input type="tel" className="form-control" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">{isSignUp ? 'Sign Up' : 'Login'}</button>
              </form>
              <p className="mt-3" onClick={handleToggle} style={{ cursor: 'pointer', color: 'blue' }}>
                {isSignUp ? 'Already have an account? Login here.' : 'Don\'t have an account? Sign up here.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
