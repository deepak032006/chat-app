import React, { useState } from 'react';
import axios from 'axios';
import Login from './Login';
import GoogleLogin from './GoogleLogin';  // Add GoogleLogin import

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('✅ Registered successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Registration failed');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.toggleContainer}>
          <button
            style={{ ...styles.toggleButton, backgroundColor: isRegistering ? '#007bff' : '#6c757d' }}
            onClick={() => setIsRegistering(true)}
          >
            Register
          </button>
          <button
            style={{ ...styles.toggleButton, backgroundColor: !isRegistering ? '#007bff' : '#6c757d' }}
            onClick={() => setIsRegistering(false)}
          >
            Login
          </button>
        </div>

        {isRegistering ? (
          <>
            <h2 style={styles.title}>Create an Account</h2>
            <form onSubmit={handleSubmit}>
              <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} required style={styles.input} />
              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
              <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
              <button type="submit" style={styles.button}>Register</button>
              {message && <p style={{ color: message.includes('✅') ? 'green' : 'red', marginTop: '10px' }}>{message}</p>}
            </form>
          </>
        ) : (
          <Login setUser={setUser} />
        )}
        
        {/* Add Google Login button here */}
        <GoogleLogin />
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f1f2f6',
    fontFamily: 'sans-serif',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  card: {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  toggleButton: {
    flex: 1,
    margin: '0 5px',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '24px',
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Register;
