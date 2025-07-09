import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ModernDashboard from '../components/ModernDashboard';

const DriverPortal = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loads, setLoads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is driver
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== 'driver') {
      navigate('/login');
      return;
    }

    setUser(parsedUser);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const loadsData = await api.getLoads();
      // Filter loads for this driver (in a real app, backend would handle this)
      setLoads(loadsData);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <ModernDashboard 
      mode="driver" 
      loads={loads} 
      drivers={[]} 
      trucks={[]} 
      onRefresh={loadData}
      currentUser={user}
      onLogout={handleLogout}
    />
  );
};

export default DriverPortal;