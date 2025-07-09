import React from 'react';
import Dashboard from '../components/Dashboard';

const Home = ({ loads, drivers, trucks, createSampleData, loadData }) => {
  return (
    <div>
      <Dashboard loads={loads} drivers={drivers} trucks={trucks} />
      
      <div style={{ marginTop: '20px' }}>
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
  );
};

export default Home;
