import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Cart from './pages/customer/cart';
import FeedbackPage from './pages/customer/feedback';
import MenuPage from './pages/customer/menuPage';
import ReservationPage from './pages/customer/reserve';
import RegisterPage from './components/register';
import LoginPage from './components/login';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Feedbacks from './pages/admin/feedbacks';
import ReservationsPage from './pages/admin/reservations';
import AdminMenuPage from './pages/admin/menu';
import HomePage from './pages/home';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/customer/cart" element={<Cart />} />
      <Route path="/customer/feedback" element={<FeedbackPage />} />
      <Route path="/customer/menu" element={<MenuPage />} />
      <Route path="/customer/reserve" element={<ReservationPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      <Route path="/admin/feedbacks" element={<Feedbacks />} />
      <Route path="/admin/reservations" element={<ReservationsPage />} />
      <Route path="/admin/menu" element={<AdminMenuPage />} />
    </Routes>
  );
};

export default App;
