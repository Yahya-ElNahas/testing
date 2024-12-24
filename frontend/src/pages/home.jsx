import React, { useState, useEffect } from "react";
import "./home.css"; 

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");

  // Fetch menu items when the component mounts
  useEffect(() => {
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

    fetchMenuItems();
  }, []);

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">Reservation System</div>
        <div className="navbar-links">
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="menu-section">
        <h1>Menu</h1>
        {error && <p className="error">{error}</p>}
        <div className="menu-items">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id} className="menu-item">
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <p className="price">${item.price}</p>
              </div>
            ))
          ) : (
            <p>Loading menu items...</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
