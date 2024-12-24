import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/menu");
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        console.log(data);
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMenuItems();
  }, []);

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});

  const renderMenuGroup = (type, items) => (
    <div key={type} className="menu-group">
      <h3 className="menu-group-title">{type}</h3>
      <table className="menu-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="menu-item-name">{item.name}</td>
              <td className="menu-item-description">{item.description}</td>
              <td className="menu-item-price">${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="navbar-logo">Restaurant</div>
        <div className="navbar-links">
          <a onClick={() => navigate('/login')}>Login</a>
          <a onClick={() => navigate('/register')}>Register</a>
        </div>
      </nav>

      <section className="hero-section fade-in">
        <div className="hero-content">
          <h1>Welcome to our Restaurant</h1>
        </div>
      </section>

      <main className="menu-section fade-in">
        <h2>The Menu</h2>
        {error && <p className="error">{error}</p>}
        {menuItems.length > 0 ? (
          Object.entries(groupedMenuItems).map(([type, items]) =>
            renderMenuGroup(type, items)
          )
        ) : (
          <p>Loading menu items...</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;

