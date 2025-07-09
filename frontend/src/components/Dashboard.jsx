import React, { useState } from 'react';
import api from '../services/api';

const Dashboard = ({ mode = 'admin', loads = [], drivers = [], trucks = [], onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    setLoading(true);
    try {
      if (type === 'load') await api.deleteLoad(id);
      else if (type === 'driver') await api.deleteDriver(id);
      else if (type === 'truck') await api.deleteTruck(id);
      onRefresh();
    } catch (err) {
      setError(`Failed to delete ${type}`);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (loadId, status) => {
    setLoading(true);
    try {
      await api.updateLoad(loadId, { status });
      onRefresh();
    } catch (err) {
      setError('Failed to update status');
    }
    setLoading(false);
  };

  const handleDocumentUpload = async (loadId) => {
    if (!uploadFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('document', uploadFile);
      await api.uploadDocument(loadId, formData);
      setUploadFile(null);
      onRefresh();
    } catch (err) {
      setError('Failed to upload document');
    }
    setLoading(false);
  };

  const handleGenerateInvoice = async (loadId) => {
    try {
      await api.generateInvoice(loadId);
    } catch (err) {
      setError('Failed to generate invoice');
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={() => setError('')} className="float-right font-bold">×</button>
        </div>
      )}

      {mode === 'admin' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">📦 Loads</h3>
              <p>Total: {loads.length}</p>
              <p>Pending: {loads.filter(l => l.status === 'pending').length}</p>
              <p>In Transit: {loads.filter(l => l.status === 'in-transit').length}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">👨‍💼 Drivers</h3>
              <p>Total: {drivers.length}</p>
              <p>Available: {drivers.filter(d => d.status === 'available').length}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">🚛 Trucks</h3>
              <p>Total: {trucks.length}</p>
              <p>Available: {trucks.filter(t => t.status === 'available').length}</p>
            </div>
          </div>

          {/* Loads Table */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Loads</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Load ID</th>
                    <th className="border border-gray-300 p-2">Route</th>
                    <th className="border border-gray-300 p-2">Rate</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loads.map(load => (
                    <tr key={load._id}>
                      <td className="border border-gray-300 p-2">{load.loadId}</td>
                      <td className="border border-gray-300 p-2">{load.pickupLocation} → {load.deliveryLocation}</td>
                      <td className="border border-gray-300 p-2">${load.rate}</td>
                      <td className="border border-gray-300 p-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          load.status === 'delivered' ? 'bg-green-200 text-green-800' :
                          load.status === 'in-transit' ? 'bg-yellow-200 text-yellow-800' :
                          load.status === 'assigned' ? 'bg-blue-200 text-blue-800' :
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {load.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button 
                          onClick={() => handleGenerateInvoice(load.loadId)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2"
                        >
                          Invoice
                        </button>
                        <button 
                          onClick={() => handleDelete('load', load._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drivers Table */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Drivers</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">License</th>
                    <th className="border border-gray-300 p-2">Phone</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map(driver => (
                    <tr key={driver._id}>
                      <td className="border border-gray-300 p-2">{driver.name}</td>
                      <td className="border border-gray-300 p-2">{driver.licenseNumber}</td>
                      <td className="border border-gray-300 p-2">{driver.phone}</td>
                      <td className="border border-gray-300 p-2">{driver.status || 'available'}</td>
                      <td className="border border-gray-300 p-2">
                        <button 
                          onClick={() => handleDelete('driver', driver._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trucks Table */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Trucks</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Truck ID</th>
                    <th className="border border-gray-300 p-2">License Plate</th>
                    <th className="border border-gray-300 p-2">Make/Model</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trucks.map(truck => (
                    <tr key={truck._id}>
                      <td className="border border-gray-300 p-2">{truck.truckId}</td>
                      <td className="border border-gray-300 p-2">{truck.licensePlate}</td>
                      <td className="border border-gray-300 p-2">{truck.make} {truck.model}</td>
                      <td className="border border-gray-300 p-2">{truck.status || 'available'}</td>
                      <td className="border border-gray-300 p-2">
                        <button 
                          onClick={() => handleDelete('truck', truck._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {mode === 'driver' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Driver Dashboard</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">My Loads</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Load ID</th>
                    <th className="border border-gray-300 p-2">Route</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loads.map(load => (
                    <tr key={load._id}>
                      <td className="border border-gray-300 p-2">{load.loadId}</td>
                      <td className="border border-gray-300 p-2">{load.pickupLocation} → {load.deliveryLocation}</td>
                      <td className="border border-gray-300 p-2">
                        <select 
                          value={load.status} 
                          onChange={(e) => handleStatusUpdate(load._id, e.target.value)}
                          className="border rounded p-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="assigned">Assigned</option>
                          <option value="in-transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button 
                          onClick={() => setSelectedLoad(load._id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Upload Doc
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedLoad && (
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-semibold mb-2">Upload Document for Load {selectedLoad}</h4>
              <input 
                type="file" 
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="mb-2"
              />
              <div>
                <button 
                  onClick={() => handleDocumentUpload(selectedLoad)}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Upload
                </button>
                <button 
                  onClick={() => setSelectedLoad(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
