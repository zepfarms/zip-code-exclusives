
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardMain from './AdminDashboard/index';

// This file is now just redirecting to the new AdminDashboard component
const AdminDashboard = () => {
  // We'll use the new component structure with proper organization
  return <AdminDashboardMain />;
};

export default AdminDashboard;
