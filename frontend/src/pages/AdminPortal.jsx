import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Dashboard from '../components/Dashboard';
import RateConfirmationUploader from '../components/RateConfirmationUploader';

const AdminPortal = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is admin
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    setUser(parsedUser);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [loadsData, driversData, trucksData] = await Promise.all([
        api.getLoads(),
        api.getDrivers(),
        api.getTrucks()
      ]);
      setLoads(loadsData);
      setDrivers(driversData);
      setTrucks(trucksData);
    } catch (error) {
      console.error('Error loading data:', error);
      // If unauthorized, redirect to login
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



  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <Dashboard 
      mode="admin" 
      loads={loads} 
      drivers={drivers} 
      trucks={trucks} 
      onRefresh={loadData}
      currentUser={user}
      onLogout={handleLogout}
    />
  );
};

export default AdminPortal;
