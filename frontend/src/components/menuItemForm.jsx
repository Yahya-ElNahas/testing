import React, { useState } from "react";

const MenuItemForm = ({ onSuccess, onClose, existingItem = null }) => {
  const [formData, setFormData] = useState(
    existingItem || { name: "", description: "", price: "", type: "" }
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = existingItem ? "PUT" : "POST";
      const endpoint = existingItem
        ? `http://localhost:5000/menu/${existingItem._id}`
        : "http://localhost:5000/menu";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save menu item");

      onSuccess();
      onClose(); // Close form after success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.formHeader}>{existingItem ? "Update" : "Add"} Menu Item</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Item Description"
          value={formData.description}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="type"
          placeholder="Item Type (e.g., Beverage, Main Course, Dessert)"
          value={formData.type}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          {existingItem ? "Update" : "Add"} Item
        </button>
      </form>
      <button onClick={onClose} style={styles.cancelButton}>
        Cancel
      </button>
    </div>
  );
};

const styles = {
  formContainer: {
    backgroundColor: "#333",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "500px",
    margin: "0 auto",
    color: "#fff",
  },
  formHeader: {
    fontSize: "24px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    backgroundColor: "#444",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
  },
  submitButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 15px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default MenuItemForm;
