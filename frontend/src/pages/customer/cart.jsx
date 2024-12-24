import React, { useState, useEffect } from 'react';

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [destination, setDestination] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Apply dark background to the entire body when the component loads
  useEffect(() => {
    document.body.style.backgroundColor = '#121212';  // Dark background color
    document.body.style.color = '#f9f9f9'; // Light text color for the body
    return () => {
      // Cleanup on component unmount
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  const fetchCartData = async () => {
    setError(null); // Clear previous errors
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/user/cart/all`, {
        method: 'GET', // Or 'PUT' if your backend requires it
        headers: {
          'Content-Type': 'application/json', // Correct header format
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json(); // Parse JSON data
      setCartData(data);
      console.log(data)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // Function to handle the order button
  const handleClearCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user`, {
        method: 'PATCH', // Or 'PUT' if your backend requires it
        headers: {
          'Content-Type': 'application/json', // Correct header format
        },
        body: JSON.stringify({
          cart: [] // Clear the cart by sending an empty array
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Failed to clear cart. Please try again.');
    }
    setCartData([]); // Clears the cart data in the UI
  };

  const handleOrderClick = () => {
    if(cartData.length > 0) setShowOrderForm(true); // Show the order form when the button is clicked
  };

  let price = 0;
  for(const item of cartData) {
    price += (item.price * item.quantity);
  }

  const handleSubmitOrder = async () => {
    // Add order submission logic here
    if (!destination || !paymentMethod) {
      alert('Please fill in all the fields!');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/order`, {
        method: 'POST', // Or 'PUT' if your backend requires it
        headers: {
          'Content-Type': 'application/json', // Correct header format
        },
        body: JSON.stringify({
          destination,
          payment_method: paymentMethod,
          status: 'confirmed',
          details: cartData,
          price
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      handleClearCart();

      alert('Order Placed successfully!');
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Failed to clear cart. Please try again.');
    }
    
    setShowOrderForm(false); // Hide the form after submission
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Cart</h1>

      {/* Error Message */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Loading State */}
      {loading && <div style={styles.loading}>Loading cart data...</div>}

      {/* Display Cart Data */}
      {!loading && !error && cartData.length === 0 && (
        <p style={styles.emptyCart}>Your cart is empty!</p>
      )}

      {/* Cart Table with Headers */}
      {!loading && !error && cartData.length > 0 && (
        <div style={styles.cartTable}>
          {/* Header Row */}
          <div style={styles.cartHeader}>
            <div style={styles.headerItem}>Item</div>
            <div style={styles.headerItem}>Quantity</div>
            <div style={styles.headerItem}>Price</div>
          </div>

          {/* Cart Items */}
          {cartData.map((item, index) => (
            <div key={index} style={styles.cartRow}>
              <div style={styles.cartItem}>{item.name}</div>
              <div style={styles.cartQuantity}>{item.quantity}</div>
              <div style={styles.cartPrice}>${item.price}</div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {!loading && !error && (
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleOrderClick}>
            Order
          </button>
          <button style={styles.buttonClear} onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>
      )}

      {/* Order Form */}
      {showOrderForm && (
        <div style={styles.orderForm}>
          <h2 style={styles.formTitle}>Order Details</h2>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Destination:</label>
            <input
              style={styles.formInput}
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Payment Method:</label>
            <input
              style={styles.formInput}
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="Enter payment method"
            />
          </div>
          <button style={styles.buttonSubmit} onClick={handleSubmitOrder}>
            Submit Order
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: "'Arial', sans-serif",
    backgroundColor: '#2c2c2c', // Dark gray for the container
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    color: '#f9f9f9', // Light text for dark background
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
  loading: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '18px',
  },
  emptyCart: {
    textAlign: 'center',
    color: '#777',
    fontSize: '16px',
  },
  cartTable: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    padding: '10px',
    backgroundColor: '#444',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  headerItem: {
    width: '33%',
    textAlign: 'center',
    color: '#fff',
  },
  cartRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #444',
    borderRadius: '6px',
    backgroundColor: '#3a3a3a',
  },
  cartItem: {
    width: '33%',
    textAlign: 'center',
    color: '#fff',
  },
  cartQuantity: {
    width: '33%',
    textAlign: 'center',
    color: '#fff',
  },
  cartPrice: {
    width: '33%',
    textAlign: 'center',
    color: '#28a745',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonClear: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#dc3545',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  orderForm: {
    marginTop: '20px',
    backgroundColor: '#444',
    padding: '20px',
    borderRadius: '8px',
  },
  formTitle: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formLabel: {
    color: '#fff',
    display: 'block',
    marginBottom: '5px',
  },
  formInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#333',
    color: '#fff',
  },
  buttonSubmit: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Cart;
