import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      onLogin(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
      <h2 style={{ fontWeight: 'bold', color: '#333' }}>Login</h2>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label style={{ fontWeight: 'bold' }}>Password:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: '1rem', fontWeight: 'bold', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>Login</button>
      </form>
      <p style={{ fontWeight: 'bold' }}>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
  );
};

export default LoginForm;
