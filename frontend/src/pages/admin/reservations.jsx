import React, { useState, useEffect } from "react";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  // Fetch all reservations
  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:5000/reservations");
      if (!response.ok) throw new Error("Failed to fetch reservations");
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update reservation status to Confirmed
  const updateStatusToConfirmed = async (reservationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/reservations/${reservationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Confirmed" }),
        }
      );

      if (!response.ok) throw new Error("Failed to update reservation status");

      // Refresh reservations list after update
      fetchReservations();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Reservations</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.reservationsList}>
        {reservations.length > 0 ? (
          <ul style={styles.list}>
            {reservations.map((reservation) => (
              <li key={reservation._id} style={styles.reservationItem}>
                <p>
                  <strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Table Capacity:</strong> {reservation.table_capacity}
                </p>
                <p>
                  <strong>Location:</strong> {reservation.location}
                </p>
                <p>
                  <strong>Status:</strong> {reservation.status}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(reservation.createdAt).toLocaleString()}
                </p>
                {reservation.status !== "Confirmed" && (
                  <button
                    style={styles.button}
                    onClick={() => updateStatusToConfirmed(reservation._id)}
                  >
                    Confirm Reservation
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reservations found.</p>
        )}
      </div>
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
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "20px",
  },
  reservationsList: {
    margin: "0 auto",
    maxWidth: "600px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  reservationItem: {
    backgroundColor: "#333",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "5px",
    color: "#fff",
  },
  button: {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#218838",
  },
};

export default ReservationsPage;
