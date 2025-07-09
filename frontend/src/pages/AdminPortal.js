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

  const createSampleData = async () => {
    try {
      // Create sample truck
      await api.createTruck({
        truckId: 'TRK001',
        licensePlate: 'ABC123',
        make: 'Freightliner',
        model: 'Cascadia',
        year: 2022,
        capacity: 80000
      });
      
      // Create sample driver
      await api.createDriver({
        name: 'John Smith',
        licenseNumber: 'CDL123456',
        phone: '555-0123',
        email: 'john@pwp.com'
      });
      
      // Create sample load
      await api.createLoad({
        loadId: 'LD001',
        pickupLocation: 'Chicago, IL',
        deliveryLocation: 'Dallas, TX',
        pickupDate: new Date(),
        deliveryDate: new Date(Date.now() + 86400000),
        rate: 2500,
        weight: 45000
      });
      
      loadData();
      alert('Sample data created successfully!');
    } catch (error) {
      alert('Error creating sample data: ' + error.message);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🚛 PWP Admin Portal</h1>
        <div>
          {user && <span style={{ marginRight: '15px' }}>Welcome, {user.name}</span>}
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>📦 Load Management</h2>
        <RateConfirmationUploader onLoadCreated={loadData} />
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={createSampleData}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Sample Data
          </button>
          
          <button 
            onClick={loadData}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#17a2b8', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Refresh Data
          </button>
        </div>
      </div>

      <Dashboard 
        loads={loads} 
        drivers={drivers} 
        trucks={trucks} 
        isAdmin={true}
        onRefresh={loadData}
      />
    </div>
  );
};

export default AdminPortal;