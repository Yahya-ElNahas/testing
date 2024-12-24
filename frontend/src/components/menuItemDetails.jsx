import React from "react";

const MenuItemDetails = ({ item }) => {
  return (
    <div>
      <h3>Menu Item Details</h3>
      <p>
        <strong>Name:</strong> {item.name}
      </p>
      <p>
        <strong>Price:</strong> ${item.price}
      </p>
      <p>
        <strong>Description:</strong> {item.description}
      </p>
      <p>
        <strong>Type:</strong> {item.type}
      </p>
    </div>
  );
};

export default MenuItemDetails;
