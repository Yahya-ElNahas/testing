import React, { useEffect, useState } from 'react';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/feedback') // Update this URL if needed
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setFeedbacks(data);
      })
      .catch((error) => {
        console.error('Error fetching feedbacks:', error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <p style={styles.error}>Error: {error}</p>;
  }

  if (feedbacks.length === 0) {
    return <p style={styles.noFeedback}>No feedbacks available.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Feedback List</h2>
      <ul style={styles.feedbackList}>
        {feedbacks.map((feedback) => (
          <li key={feedback._id} style={styles.feedbackItem}>
            <h3 style={styles.customerName}>{feedback.customerName}</h3>
            <p style={styles.message}>{feedback.messages}</p>
            <strong style={styles.rating}>Rating: {feedback.rating}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: "'Arial', sans-serif",
    backgroundColor: '#2c2c2c', // Dark background for container
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    color: '#f9f9f9', // Light text for readability
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: '20px',
  },
  error: {
    color: '#ff4d4d',
    textAlign: 'center',
    marginBottom: '10px',
  },
  noFeedback: {
    textAlign: 'center',
    color: '#777',
    fontSize: '16px',
  },
  feedbackList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  feedbackItem: {
    backgroundColor: '#444', // Slightly lighter background for feedback items
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '15px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  feedbackItemHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
  },
  customerName: {
    fontSize: '18px',
    color: '#fff',
    marginBottom: '10px',
  },
  message: {
    fontSize: '16px',
    color: '#bbb',
    marginBottom: '10px',
  },
  rating: {
    fontSize: '16px',
    color: '#28a745', // Green color for the rating
    fontWeight: 'bold',
  },
};

export default FeedbackList;
