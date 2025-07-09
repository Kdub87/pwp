import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = ({ setIsAuthenticated, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setIsAuthenticated(true);
      setUser(response.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '20px', 
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: 'white'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🚛 PWP Login</h2>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;