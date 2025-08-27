import React, { useState } from 'react';
import '../../styles/Auth.css'; 
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      console.log('Login success:', data);
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/profile');
      setError('');

      // TODO: store token, redirect, etc.
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;