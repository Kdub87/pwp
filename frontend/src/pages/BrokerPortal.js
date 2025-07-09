import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BrokerPortal = () => {
  const [loads, setLoads] = useState([]);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const loadsData = await api.getBrokerLoads();
      setLoads(loadsData);
      setSelectedLoad(null);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSelect = (load) => {
    setSelectedLoad(load);
    setUpdateMessage('');
  };

  const handleRequestUpdate = async () => {
    if (!selectedLoad) return;
    
    try {
      await api.requestLoadUpdate(selectedLoad._id);
      setUpdateMessage('Update request sent successfully! The carrier will be notified.');
    } catch (error) {
      setUpdateMessage('Failed to send update request: ' + error.message);
    }
  };

  const filteredLoads = loads.filter(load => 
    load.loadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    load.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>🚛 PWP Broker Portal</h1>
        <p>Track your shipments and request updates</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search loads by ID, pickup, or delivery location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginBottom: '10px'
          }}
        />
        
        <button 
          onClick={loadData}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '20px' }}>
        <div style={{ flex: '1', minWidth: 0 }}>
          <h2>📦 Loads</h2>
          
          {filteredLoads.length === 0 ? (
            <p>No loads found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Load ID</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Pickup</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Delivery</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoads.map(load => (
                    <tr 
                      key={load._id} 
                      onClick={() => handleLoadSelect(load)} 
                      style={{ 
                        cursor: 'pointer', 
                        backgroundColor: selectedLoad && selectedLoad._id === load._id ? '#f0f0f0' : 'transparent' 
                      }}
                    >
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{load.loadId}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{load.pickupLocation}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{load.deliveryLocation}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          backgroundColor: 
                            load.status === 'delivered' ? '#d4edda' : 
                            load.status === 'in-transit' ? '#fff3cd' : 
                            load.status === 'assigned' ? '#cce5ff' : '#f8f9fa',
                          color: 
                            load.status === 'delivered' ? '#155724' : 
                            load.status === 'in-transit' ? '#856404' : 
                            load.status === 'assigned' ? '#004085' : '#6c757d'
                        }}>
                          {load.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedLoad && (
          <div style={{ flex: '1', minWidth: 0 }}>
            <h2>Load Details</h2>
            <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h3>Load {selectedLoad.loadId}</h3>
              <p><strong>Pickup:</strong> {selectedLoad.pickupLocation}</p>
              <p><strong>Delivery:</strong> {selectedLoad.deliveryLocation}</p>
              <p><strong>Status:</strong> {selectedLoad.status}</p>
              <p><strong>Pickup Date:</strong> {new Date(selectedLoad.pickupDate).toLocaleDateString()}</p>
              <p><strong>Delivery Date:</strong> {new Date(selectedLoad.deliveryDate).toLocaleDateString()}</p>
              
              {selectedLoad.driver && (
                <div>
                  <h4>Driver Information</h4>
                  <p><strong>Name:</strong> {selectedLoad.driver.name}</p>
                  <p><strong>Phone:</strong> {selectedLoad.driver.phone}</p>
                  <p><strong>Email:</strong> {selectedLoad.driver.email}</p>
                  
                  {selectedLoad.driver.location && (
                    <div>
                      <h4>Current Location</h4>
                      <p>{selectedLoad.driver.location.address || 'Location information not available'}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ marginTop: '20px' }}>
                <button 
                  onClick={handleRequestUpdate}
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Request Update
                </button>
                
                {updateMessage && (
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '10px', 
                    backgroundColor: updateMessage.includes('Failed') ? '#f8d7da' : '#d4edda',
                    color: updateMessage.includes('Failed') ? '#721c24' : '#155724',
                    borderRadius: '4px'
                  }}>
                    {updateMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokerPortal;