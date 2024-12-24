import React, { useState } from "react";

const ReservationPage = () => {
  const [reservationData, setReservationData] = useState({
    date: "",
    table_capacity: "",
    location: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData({ ...reservationData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        setStatusMessage("Reservation submitted successfully!");
        setReservationData({ date: "", table_capacity: "", location: "" });
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Make a Reservation</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Date:</label>
          <input
            type="datetime-local"
            name="date"
            value={reservationData.date}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Table Capacity:</label>
          <input
            type="number"
            name="table_capacity"
            value={reservationData.table_capacity}
            onChange={handleChange}
            required
            min="1"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Location:</label>
          <input
            type="text"
            name="location"
            value={reservationData.location}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>Submit Reservation</button>
      </form>
      {statusMessage && <p style={styles.statusMessage}>{statusMessage}</p>}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#121212",
    color: "#f9f9f9",
    padding: "20px",
    minHeight: "100vh",
    fontFamily: "'Arial', sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "20px",
  },
  form: {
    backgroundColor: "#333",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    fontSize: "16px",
    color: "#fff",
    marginBottom: "8px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #444",
    backgroundColor: "#2c2c2c",
    color: "#fff",
    fontSize: "14px",
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.3s ease",
  },
  statusMessage: {
    marginTop: "20px",
    textAlign: "center",
    color: "#fff",
  },
};

export default ReservationPage;
