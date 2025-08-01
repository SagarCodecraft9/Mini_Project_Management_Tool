import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
      <h2 style={{ fontWeight: 'bold', color: '#333' }}>Sign Up</h2>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Username:</label><br />
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label style={{ fontWeight: 'bold' }}>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label style={{ fontWeight: 'bold' }}>Password:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: '1rem', fontWeight: 'bold', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px' }}>Sign Up</button>
      </form>
      <p style={{ fontWeight: 'bold' }}>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default SignupForm;
