import React, { useState } from 'react';
import api from '../services/api';
import UserManagement from './UserManagement';

const ModernDashboard = ({ mode = 'admin', loads = [], drivers = [], trucks = [], onRefresh, currentUser, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showUserModal, setShowUserModal] = useState(false);

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

  const stats = {
    totalLoads: loads.length,
    activeLoads: loads.filter(l => ['assigned', 'in-transit'].includes(l.status)).length,
    availableDrivers: drivers.filter(d => d.status === 'available').length,
    availableTrucks: trucks.filter(t => t.status === 'available').length,
    revenue: loads.reduce((sum, load) => sum + (load.rate || 0), 0)
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { id: 'loads', label: 'Loads', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'drivers', label: 'Drivers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { id: 'fleet', label: 'Fleet', icon: 'M8 17a4 4 0 100-8 4 4 0 000 8zM12 1v6h8a4 4 0 014 4v6a4 4 0 01-4 4h-8v6' },
    ...(mode === 'admin' ? [{ id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' }] : [])
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">PWP Fleet</h1>
                <p className="text-xs text-gray-500 capitalize">{mode} Portal</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{currentUser?.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role || 'user'}</p>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSection === 'overview' ? 'Overview' : 
                   activeSection === 'loads' ? 'Load Management' :
                   activeSection === 'drivers' ? 'Driver Management' : 
                   activeSection === 'fleet' ? 'Fleet Management' : 'User Management'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {activeSection === 'overview' ? 'Your fleet at a glance' :
                   activeSection === 'loads' ? 'Manage and track all loads' :
                   activeSection === 'drivers' ? 'Manage your driver team' :
                   activeSection === 'fleet' ? 'Monitor your vehicle fleet' : 'Manage system users'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {activeSection === 'users' && mode === 'admin' && (
                <button
                  onClick={() => setShowUserModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add User
                </button>
              )}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
              <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Loads', value: stats.totalLoads, change: '+12%', color: 'blue', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                  { label: 'Active Loads', value: stats.activeLoads, change: '+8%', color: 'green', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                  { label: 'Available Drivers', value: stats.availableDrivers, change: '-2%', color: 'purple', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
                  { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, change: '+15%', color: 'yellow', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                        <svg className={`w-6 h-6 text-${stat.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Loads</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {loads.slice(0, 5).map(load => (
                        <div key={load._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{load.loadId}</p>
                              <p className="text-sm text-gray-600">{load.pickupLocation} → {load.deliveryLocation}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            load.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            load.status === 'in-transit' ? 'bg-yellow-100 text-yellow-800' :
                            load.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {load.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Driver Status</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {drivers.slice(0, 5).map(driver => (
                        <div key={driver._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-purple-600">{driver.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{driver.name}</p>
                              <p className="text-sm text-gray-600">{driver.licenseNumber}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            driver.status === 'available' ? 'bg-green-100 text-green-800' :
                            driver.status === 'on-duty' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {driver.status || 'available'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'loads' && (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loads.map(load => (
                      <tr key={load._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{load.loadId}</p>
                              <p className="text-sm text-gray-500">{new Date(load.pickupDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{load.pickupLocation}</p>
                            <p className="text-sm text-gray-500">→ {load.deliveryLocation}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {load.driver ? (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                                <span className="text-xs font-medium text-purple-600">{load.driver.name?.charAt(0)}</span>
                              </div>
                              <span className="text-sm text-gray-900">{load.driver.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            load.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            load.status === 'in-transit' ? 'bg-yellow-100 text-yellow-800' :
                            load.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {load.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ${load.rate?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                            <button 
                              onClick={() => api.generateInvoice(load.loadId)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Invoice
                            </button>
                            {mode === 'admin' && (
                              <button 
                                onClick={() => handleDelete('load', load._id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Similar sections for drivers, fleet, and users would go here */}
        </main>
      </div>

      {/* User Management Modal */}
      {showUserModal && (
        <UserManagement
          onClose={() => setShowUserModal(false)}
          onUserCreated={() => {
            setShowUserModal(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default ModernDashboard;