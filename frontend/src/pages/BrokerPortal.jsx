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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">🚛 PWP Broker Portal</h1>
            <p className="mt-2 text-gray-600">Track your shipments and request updates</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
                {/* Table content here */}
              </table>
            </div>
          )}
        </div>
      </div>
      </div> {/* closes max-w-7xl container */}
    </div> // closes min-h-screen bg-gray-50
  );
};

export default BrokerPortal;
