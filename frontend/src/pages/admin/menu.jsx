import React, { useState, useEffect } from "react";
import MenuItemForm from "../../components/menuItemForm"; // Form component for adding new items

const AdminMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState(false);
  const [error, setError] = useState("");

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/menu");
      if (!response.ok) throw new Error("Failed to fetch menu items");
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete menu item by ID
  const deleteMenuItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/menu/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete menu item");
      fetchMenuItems(); // Refresh the list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Menu Management</h1>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.menuList}>
        <h2 style={styles.subHeader}>Menu Items</h2>
        <ul style={styles.menuItems}>
          {menuItems.map((item) => (
            <li key={item._id} style={styles.menuItem}>
              <strong>{item.name}</strong> - ${item.price.toFixed(2)}
              <button
                onClick={() => deleteMenuItem(item._id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.actions}>
        <button
          onClick={() => setNewItem(true)}
          style={styles.addButton}
        >
          Add New Item
        </button>
      </div>

      {newItem && (
        <MenuItemForm
          onSuccess={fetchMenuItems}
          onClose={() => setNewItem(false)}
        />
      )}
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
  subHeader: {
    color: "#ddd",
    marginBottom: "10px",
  },
  menuList: {
    marginBottom: "30px",
  },
  menuItems: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  menuItem: {
    backgroundColor: "#333",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  deleteButtonHover: {
    backgroundColor: "#c0392b",
  },
  actions: {
    marginTop: "20px",
    textAlign: "center",
  },
  addButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "20px",
  },
};

export default AdminMenuPage;
