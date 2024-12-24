import React, { useState, useEffect } from 'react';
import FeedbackForm from '../../components/feedbackForm';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/feedback')
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error('Error fetching feedback:', error));
  }, []);

  const toggleForm = () => setShowForm(!showForm);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Feedback</h1>
      <button style={styles.toggleButton} onClick={toggleForm}>
        {showForm ? 'Close Feedback Form' : 'Add Feedback'}
      </button>
      
      {showForm && <FeedbackForm />}

      <div style={styles.feedbackList}>
        {feedbacks.length === 0 ? (
          <p style={styles.noFeedback}>No feedback available yet!</p>
        ) : (
          <ul style={styles.feedbackItems}>
            {feedbacks.map((feedback) => (
              <li key={feedback._id} style={styles.feedbackItem}>
                <strong style={styles.feedbackName}>{feedback.customerName}</strong>: {feedback.messages} ({feedback.rating}/10)
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#2c2c2c',
    color: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    fontFamily: "'Arial', sans-serif",
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: '20px',
  },
  toggleButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s ease',
  },
  feedbackList: {
    marginTop: '20px',
  },
  noFeedback: {
    textAlign: 'center',
    color: '#777',
    fontSize: '16px',
  },
  feedbackItems: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  feedbackItem: {
    backgroundColor: '#3a3a3a',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #444',
  },
  feedbackName: {
    fontSize: '18px',
    color: '#fff',
    marginBottom: '5px',
  },
};

export default FeedbackPage;
