import React, { useState } from 'react';
import api from '../services/api';

const RateConfirmationUploader = ({ onLoadCreated }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain')) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a PDF or text file');
    }
  };

  const handleParse = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    setError('');
    setParsedData(null);
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('rateConfirmation', file);

      const response = await api.parseRateConfirmation(formData);
      setParsedData(response.loadData);
      setSuccess('Rate confirmation parsed successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to parse rate confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLoad = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('rateConfirmation', file);

      const response = await api.createLoadFromRateConfirmation(formData);
      setSuccess('Load created successfully');
      
      // Reset form
      setFile(null);
      setParsedData(null);
      
      // Notify parent component
      if (onLoadCreated) {
        onLoadCreated(response.load);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create load');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      padding: '20px',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginBottom: '15px' }}>📄 Rate Confirmation Upload</h3>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          color: '#155724',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {success}
        </div>
      )}
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Select Rate Confirmation (PDF or Text)
        </label>
        <input 
          type="file" 
          accept=".pdf,.txt,text/plain,application/pdf" 
          onChange={handleFileChange}
          style={{ 
            display: 'block',
            marginBottom: '10px'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleParse}
          disabled={!file || isLoading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: !file || isLoading ? 'not-allowed' : 'pointer',
            opacity: !file || isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Parsing...' : 'Parse Document'}
        </button>
        
        <button 
          onClick={handleCreateLoad}
          disabled={!file || isLoading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: !file || isLoading ? 'not-allowed' : 'pointer',
            opacity: !file || isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Creating...' : 'Create Load'}
        </button>
      </div>
      
      {parsedData && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <h4 style={{ marginBottom: '10px' }}>Parsed Data</h4>
          <p><strong>Load ID:</strong> {parsedData.loadId}</p>
          <p><strong>Pickup:</strong> {parsedData.pickupLocation}</p>
          <p><strong>Delivery:</strong> {parsedData.deliveryLocation}</p>
          <p><strong>Rate:</strong> ${parsedData.rate}</p>
          {parsedData.pickupDate && (
            <p><strong>Pickup Date:</strong> {new Date(parsedData.pickupDate).toLocaleDateString()}</p>
          )}
          {parsedData.deliveryDate && (
            <p><strong>Delivery Date:</strong> {new Date(parsedData.deliveryDate).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RateConfirmationUploader;