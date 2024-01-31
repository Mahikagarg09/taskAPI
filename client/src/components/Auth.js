import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform authentication logic here (e.g., API calls, validation)
    console.log(`Email: ${email}, Password: ${password}, Phone: ${phone}, Mode: ${isSignUp ? 'Sign Up' : 'Login'}`);
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
