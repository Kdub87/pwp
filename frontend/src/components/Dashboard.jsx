import React, { useState } from 'react';
import api from '../services/api';
import { Card, StatCard, Badge, Button, Table, Modal, LoadingSpinner, Alert } from './UI';
import { Sidebar, Header } from './Layout';

const Dashboard = ({ mode = 'admin', loads = [], drivers = [], trucks = [], onRefresh, currentUser, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

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

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Loads"
          value={loads.filter(l => ['assigned', 'in-transit'].includes(l.status)).length}
          subtitle={`${loads.length} total loads`}
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>}
          color="blue"
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Available Drivers"
          value={drivers.filter(d => d.status === 'available').length}
          subtitle={`${drivers.length} total drivers`}
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>}
          color="green"
          trend="up"
          trendValue="5%"
        />
        <StatCard
          title="Fleet Utilization"
          value={`${Math.round((trucks.filter(t => t.status === 'in-use').length / trucks.length) * 100)}%`}
          subtitle={`${trucks.length} total trucks`}
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>}
          color="purple"
          trend="down"
          trendValue="3%"
        />
        <StatCard
          title="Revenue (MTD)"
          value="$47,250"
          subtitle="vs $42,100 last month"
          icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path></svg>}
          color="green"
          trend="up"
          trendValue="12%"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Loads</h3>
            <Button variant="outline" size="sm" onClick={() => setActiveSection('loads')}>View All</Button>
          </div>
          <div className="space-y-3">
            {loads.slice(0, 5).map(load => (
              <div key={load._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{load.loadId}</p>
                  <p className="text-sm text-gray-600">{load.pickupLocation} → {load.deliveryLocation}</p>
                </div>
                <Badge variant={load.status === 'delivered' ? 'success' : load.status === 'in-transit' ? 'warning' : 'info'}>
                  {load.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Driver Status</h3>
            <Button variant="outline" size="sm" onClick={() => setActiveSection('drivers')}>View All</Button>
          </div>
          <div className="space-y-3">
            {drivers.slice(0, 5).map(driver => (
              <div key={driver._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-blue-600">{driver.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{driver.name}</p>
                    <p className="text-sm text-gray-600">{driver.licenseNumber}</p>
                  </div>
                </div>
                <Badge variant={driver.status === 'available' ? 'success' : driver.status === 'on-duty' ? 'warning' : 'default'}>
                  {driver.status || 'available'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderLoadsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Load Management</h2>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => { setModalType('filter'); setShowModal(true); }}>Filter</Button>
          <Button onClick={() => { setModalType('addLoad'); setShowModal(true); setEditingItem(null); }}>+ New Load</Button>
        </div>
      </div>
      
      <Card padding="p-0">
        <Table headers={['Load ID', 'Route', 'Driver', 'Status', 'Rate', 'Actions']}>
          {loads.map(load => (
            <tr key={load._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{load.loadId}</div>
                <div className="text-sm text-gray-500">{new Date(load.pickupDate).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{load.pickupLocation}</div>
                <div className="text-sm text-gray-500">→ {load.deliveryLocation}</div>
                {load.distance && <div className="text-xs text-gray-400">{load.distance} miles</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {load.driver ? (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-medium">{load.driver.name?.charAt(0)}</span>
                    </div>
                    <div className="text-sm text-gray-900">{load.driver.name}</div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Unassigned</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={load.status === 'delivered' ? 'success' : load.status === 'in-transit' ? 'warning' : load.status === 'assigned' ? 'info' : 'default'}>
                  {load.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${load.rate?.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button variant="outline" size="sm" onClick={() => { setEditingItem(load); setModalType('editLoad'); setShowModal(true); }}>Edit</Button>
                <Button variant="outline" size="sm" onClick={() => api.generateInvoice(load.loadId)}>Invoice</Button>
                {mode === 'admin' && (
                  <Button variant="danger" size="sm" onClick={() => handleDelete('load', load._id)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={onLogout}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="lg:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          currentUser={currentUser}
        />
        
        <main className="p-6">
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}
          
          {activeSection === 'dashboard' && renderDashboardOverview()}
          {activeSection === 'loads' && renderLoadsSection()}
          {activeSection === 'drivers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Driver Management</h2>
                <Button onClick={() => { setModalType('addDriver'); setShowModal(true); setEditingItem(null); }}>+ New Driver</Button>
              </div>
              <Card padding="p-0">
                <Table headers={['Driver', 'License', 'Contact', 'Status', 'Actions']}>
                  {drivers.map(driver => (
                    <tr key={driver._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">{driver.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                            <div className="text-sm text-gray-500">{driver.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.licenseNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={driver.status === 'available' ? 'success' : driver.status === 'on-duty' ? 'warning' : 'default'}>
                          {driver.status || 'available'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(driver); setModalType('editDriver'); setShowModal(true); }}>Edit</Button>
                        {mode === 'admin' && (
                          <Button variant="danger" size="sm" onClick={() => handleDelete('driver', driver._id)}>Delete</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </Table>
              </Card>
            </div>
          )}
          {activeSection === 'trucks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Fleet Management</h2>
                <Button onClick={() => { setModalType('addTruck'); setShowModal(true); setEditingItem(null); }}>+ New Truck</Button>
              </div>
              <Card padding="p-0">
                <Table headers={['Truck', 'Details', 'Status', 'Actions']}>
                  {trucks.map(truck => (
                    <tr key={truck._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{truck.truckId}</div>
                        <div className="text-sm text-gray-500">{truck.licensePlate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{truck.make} {truck.model}</div>
                        <div className="text-sm text-gray-500">Year: {truck.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={truck.status === 'available' ? 'success' : truck.status === 'in-use' ? 'warning' : truck.status === 'maintenance' ? 'danger' : 'default'}>
                          {truck.status || 'available'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(truck); setModalType('editTruck'); setShowModal(true); }}>Edit</Button>
                        {mode === 'admin' && (
                          <Button variant="danger" size="sm" onClick={() => handleDelete('truck', truck._id)}>Delete</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </Table>
              </Card>
            </div>
          )}
        </main>
      </div>
      
      {/* Modals would go here */}
    </div>
  );

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
