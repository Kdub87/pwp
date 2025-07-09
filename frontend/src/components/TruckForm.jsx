import React, { useState } from 'react';
import api from '../services/api';

const TruckForm = ({ onTruckAdded }) => {
  const [formData, setFormData] = useState({
    truckId: '',
    licensePlate: '',
    make: '',
    model: '',
    year: '',
    capacity: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.createTruck(formData);
      setSuccess('Truck added successfully!');
      setFormData({
        truckId: '',
        licensePlate: '',
        make: '',
        model: '',
        year: '',
        capacity: ''
      });
      if (onTruckAdded) onTruckAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add truck');
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
      <h3 style={{ marginBottom: '15px' }}>Add New Truck</h3>
      
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
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Truck ID
          </label>
          <input 
            type="text" 
            name="truckId"
            value={formData.truckId}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            License Plate
          </label>
          <input 
            type="text" 
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Make
          </label>
          <input 
            type="text" 
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Model
          </label>
          <input 
            type="text" 
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            style={{ 
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Year
          </label>
          <input 
            type="number" 
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="1990"
            max="2030"
            style={{ 
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Capacity (lbs)
          </label>
          <input 
            type="number" 
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            min="1000"
            style={{ 
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Adding...' : 'Add Truck'}
        </button>
      </form>
    </div>
  );
};

export default TruckForm;