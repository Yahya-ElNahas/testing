import React, { useEffect, useState } from "react";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all feedbacks from the backend
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("http://localhost:5000/feedback", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks");
      }

      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>All Feedbacks</h1>
      {error && <p style={styles.error}>{error}</p>}
      {feedbacks.length === 0 ? (
        <p style={styles.noFeedback}>No feedback available.</p>
      ) : (
        <ul style={styles.feedbackList}>
          {feedbacks.map((feedback) => (
            <li key={feedback._id} style={styles.feedbackItem}>
              <h3 style={styles.feedbackTitle}>Customer ID: {feedback.customer_id}</h3>
              <p style={styles.feedbackMessage}>Description: {feedback.description}</p>
              <p style={styles.feedbackRating}>
                <strong>Rating:</strong> {feedback.rating}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Inline styles for the page
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#1e1e2f",
    borderRadius: "8px",
    color: "#f5f5f5",
    fontFamily: "'Arial', sans-serif",
  },
  header: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  noFeedback: {
    textAlign: "center",
    fontStyle: "italic",
  },
  feedbackList: {
    listStyleType: "none",
    padding: 0,
  },
  feedbackItem: {
    backgroundColor: "#29293d",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  feedbackTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  feedbackMessage: {
    fontSize: "1rem",
    marginBottom: "10px",
  },
  feedbackRating: {
    fontSize: "1rem",
    color: "#ffcc00",
  },
};

export default Feedbacks;
