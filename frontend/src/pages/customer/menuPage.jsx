import React, { useState, useEffect } from "react";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  // Add item to cart
  const addToCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/addTo/cart`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ item_id: itemId }),
        credentials: "include", // Ensures cookies are sent
      });
      if (!response.ok) throw new Error("Failed to add item to cart");
      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Menu</h1>
      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.success}>{message}</p>}
      <div style={styles.menuList}>
        <h2 style={styles.subHeader}>Available Menu Items</h2>
        <ul style={styles.menuItems}>
          {menuItems.map((item) => (
            <li key={item._id} style={styles.menuItem}>
              <span>
                <strong>{item.name}</strong> - ${item.price.toFixed(2)}
              </span>
              <button
                onClick={() => addToCart(item._id)}
                style={styles.addToCartButton}
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
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
    alignItems: "center",
  },
  addToCartButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  addToCartButtonHover: {
    backgroundColor: "#218838",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "20px",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: "20px",
  },
};

export default MenuPage;
