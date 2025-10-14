import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = onLogin(credentials.username, credentials.password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/agung-logo.png" alt="Agung Beton" className="logo" />
          <h2>PT. Agung Bumi Karsa</h2>
          <p>Sistem Manajemen Proyek</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              placeholder="Masukkan username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              placeholder="Masukkan password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            Masuk
          </button>
        </form>
        
        <div className="demo-accounts">
          <h4>Demo Accounts:</h4>
          <div className="demo-account">
            <strong>Admin:</strong> admin / admin123
          </div>
          <div className="demo-account">
            <strong>Customer:</strong> customer1 / customer123
          </div>
          <div className="demo-account">
            <strong>Project Manager:</strong> pm1 / pm123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;