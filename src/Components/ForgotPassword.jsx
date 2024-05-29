import React, { useState } from 'react';
import '../App.css';
import Axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    Axios.post('http://localhost:3000/auth/forgot-password', { email })
      .then(response => {
        setLoading(false);
        console.log(response);
        if (response.data.status) {
          alert("Check your email for the reset password link");
          navigate('/login');
        } else {
          console.log(response.data)
          setError('Failed to send email for password reset. Please try again.');
        }
      })
      .catch(err => {
        setLoading(false);
        setError('An error occurred. Please try again later.');
        console.error(err);
      });
  };

  return (
    <div className='sign-up-container'>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        {error && <p className='error-message'>{error}</p>}

        <label htmlFor='email'>Email: </label>
        <input
          type='email'
          id='email'
          autoComplete='off'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type='submit' disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
