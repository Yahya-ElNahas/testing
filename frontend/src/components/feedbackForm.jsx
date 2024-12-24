import React, { useState } from 'react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    rating: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    console.log(formData);
    e.preventDefault();
    fetch('http://localhost:5000/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Feedback submitted:', data);
        alert('Feedback submitted successfully!');
        setFormData({ description: '', rating: '' });
      })
      .catch((error) => console.error('Error submitting feedback:', error));
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Message:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Rating:</label>
        <input
          type="number"
          name="rating"
          value={formData.rating}
          min="1"
          max="10"
          onChange={handleChange}
          required
          style={styles.input}
        />
      </div>
      <button type="submit" style={styles.submitButton}>Submit</button>
    </form>
  );
};

const styles = {
  form: {
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    color: '#f9f9f9',
    fontFamily: "'Arial', sans-serif",
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '16px',
    color: '#fff',
    marginBottom: '8px',
    display: 'block',
  },
  textarea: {
    width: '100%',
    height: '150px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#2c2c2c',
    color: '#fff',
    fontSize: '14px',
    resize: 'none',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#2c2c2c',
    color: '#fff',
    fontSize: '14px',
  },
  submitButton: {
    padding: '12px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s ease',
  },
};

export default FeedbackForm;
