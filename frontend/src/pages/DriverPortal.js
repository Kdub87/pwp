import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DriverPortal = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loads, setLoads] = useState([]);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
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
      // For drivers, we only show their assigned loads
      const loadsData = await api.getLoads();
      // Filter loads assigned to this driver (in a real app, the backend would do this filtering)
      // This is a placeholder since we don't have driver-user association yet
      setLoads(loadsData);
      
      // Clear selected load when refreshing data
      setSelectedLoad(null);
      setDocuments([]);
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

  const handleStatusChange = async (loadId, newStatus) => {
    try {
      await api.updateLoad(loadId, { status: newStatus });
      loadData(); // Refresh data after update
    } catch (error) {
      alert('Error updating load status: ' + error.message);
    }
  };

  const handleLoadSelect = async (load) => {
    setSelectedLoad(load);
    try {
      const docs = await api.getLoadDocuments(load._id);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleFileUpload = async () => {
    if (!file || !selectedLoad) return;

    try {
      setUploadStatus('Uploading...');
      const formData = new FormData();
      formData.append('document', file);
      
      await api.uploadDocument(selectedLoad._id, formData);
      setUploadStatus('Upload successful!');
      setFile(null);
      
      // Refresh documents
      const docs = await api.getLoadDocuments(selectedLoad._id);
      setDocuments(docs);
    } catch (error) {
      setUploadStatus('Upload failed: ' + error.message);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🚛 PWP Driver Portal</h1>
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
        <h2>📦 My Loads</h2>
        
        <button 
          onClick={loadData}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Refresh Data
        </button>
        
        {loads.length === 0 ? (
          <p>No loads assigned to you.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Load ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Pickup</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Delivery</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loads.map(load => (
                  <tr key={load._id} onClick={() => handleLoadSelect(load)} style={{ cursor: 'pointer', backgroundColor: selectedLoad && selectedLoad._id === load._id ? '#f0f0f0' : 'transparent' }}>
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
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <select 
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleStatusChange(load._id, e.target.value);
                          }
                        }}
                        style={{ padding: '5px' }}
                      >
                        <option value="">Update Status</option>
                        <option value="assigned">Assigned</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLoad && (
        <div style={{ marginTop: '30px' }}>
          <h2>📄 Documents for Load {selectedLoad.loadId}</h2>
          
          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Upload Document</h3>
            <input 
              type="file" 
              onChange={handleFileChange} 
              style={{ marginBottom: '10px', display: 'block' }}
            />
            <button 
              onClick={handleFileUpload}
              disabled={!file}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: file ? 'pointer' : 'not-allowed',
                opacity: file ? 1 : 0.7
              }}
            >
              Upload
            </button>
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>
          
          <h3>Existing Documents</h3>
          {documents.length === 0 ? (
            <p>No documents uploaded for this load.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Type</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, index) => (
                    <tr key={index}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doc.name}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doc.type}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {new Date(doc.uploadedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverPortal;