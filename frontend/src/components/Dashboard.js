import React from 'react';

const Dashboard = ({ loads, drivers, trucks }) => {
  // Calculate statistics
  const pendingLoads = loads.filter(load => load.status === 'pending').length;
  const inTransitLoads = loads.filter(load => load.status === 'in-transit').length;
  const deliveredLoads = loads.filter(load => load.status === 'delivered').length;
  const availableDrivers = drivers.filter(driver => driver.status === 'available').length;
  const availableTrucks = trucks.filter(truck => truck.status === 'available').length;

  return (
    <div>
      <h2>Fleet Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>📦 Loads</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p><strong>Total:</strong> {loads.length}</p>
              <p><strong>Pending:</strong> {pendingLoads}</p>
            </div>
            <div>
              <p><strong>In Transit:</strong> {inTransitLoads}</p>
              <p><strong>Delivered:</strong> {deliveredLoads}</p>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>👨‍💼 Drivers</h3>
          <p><strong>Total:</strong> {drivers.length}</p>
          <p><strong>Available:</strong> {availableDrivers}</p>
          <p><strong>On Duty:</strong> {drivers.filter(driver => driver.status === 'on-duty').length}</p>
        </div>
        
        <div style={{ padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>🚛 Fleet</h3>
          <p><strong>Total Trucks:</strong> {trucks.length}</p>
          <p><strong>Available:</strong> {availableTrucks}</p>
          <p><strong>In Use:</strong> {trucks.filter(truck => truck.status === 'in-use').length}</p>
        </div>
      </div>
      
      <h3>Recent Loads</h3>
      {loads.length === 0 ? (
        <p>No loads found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Load ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Route</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Driver</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loads.slice(0, 5).map(load => (
                <tr key={load._id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{load.loadId}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {load.pickupLocation} → {load.deliveryLocation}
                    {load.distance && <span style={{ color: '#666', fontSize: '0.9em' }}> ({load.distance} mi)</span>}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {load.driver ? load.driver.name : 'Unassigned'}
                  </td>
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
  );
};

export default Dashboard;