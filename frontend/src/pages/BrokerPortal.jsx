import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, StatCard, Badge, Button, Table, LoadingSpinner, Alert } from '../components/UI';

const BrokerPortal = () => {
  const [loads, setLoads] = useState([]);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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

  const filteredLoads = loads.filter(load => {
    const matchesSearch = load.loadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         load.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         load.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || load.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusCounts = () => {
    return {
      total: loads.length,
      pending: loads.filter(l => l.status === 'pending').length,
      assigned: loads.filter(l => l.status === 'assigned').length,
      inTransit: loads.filter(l => l.status === 'in-transit').length,
      delivered: loads.filter(l => l.status === 'delivered').length
    };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🚛 PWP Broker Portal</h1>
                <p className="mt-2 text-gray-600">Track your shipments and request updates</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button onClick={loadData} variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Loads"
            value={statusCounts.total}
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>}
            color="blue"
          />
          <StatCard
            title="Pending"
            value={statusCounts.pending}
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>}
            color="yellow"
          />
          <StatCard
            title="Assigned"
            value={statusCounts.assigned}
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>}
            color="blue"
          />
          <StatCard
            title="In Transit"
            value={statusCounts.inTransit}
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path></svg>}
            color="purple"
          />
          <StatCard
            title="Delivered"
            value={statusCounts.delivered}
            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Loads List */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Shipment Tracking</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search loads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {filteredLoads.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No loads found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLoads.map(load => (
                    <div
                      key={load._id}
                      onClick={() => handleLoadSelect(load)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
                        selectedLoad && selectedLoad._id === load._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-900">{load.loadId}</h3>
                            <Badge variant={
                              load.status === 'delivered' ? 'success' :
                              load.status === 'in-transit' ? 'warning' :
                              load.status === 'assigned' ? 'info' : 'default'
                            }>
                              {load.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {load.pickupLocation} → {load.deliveryLocation}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span>Pickup: {new Date(load.pickupDate).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>Delivery: {new Date(load.deliveryDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Load Details */}
          <div>
            {selectedLoad ? (
              <Card>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Load Details</h3>
                  <p className="text-sm text-gray-500">Load ID: {selectedLoad.loadId}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Route Information</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Pickup</p>
                          <p className="text-sm text-gray-600">{selectedLoad.pickupLocation}</p>
                          <p className="text-xs text-gray-500">{new Date(selectedLoad.pickupDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center py-2">
                        <div className="w-px h-6 bg-gray-300"></div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Delivery</p>
                          <p className="text-sm text-gray-600">{selectedLoad.deliveryLocation}</p>
                          <p className="text-xs text-gray-500">{new Date(selectedLoad.deliveryDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                    <Badge variant={
                      selectedLoad.status === 'delivered' ? 'success' :
                      selectedLoad.status === 'in-transit' ? 'warning' :
                      selectedLoad.status === 'assigned' ? 'info' : 'default'
                    } size="md">
                      {selectedLoad.status}
                    </Badge>
                  </div>

                  {selectedLoad.driver && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Driver Information</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">
                              {selectedLoad.driver.name?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{selectedLoad.driver.name}</p>
                            <p className="text-sm text-gray-600">{selectedLoad.driver.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={handleRequestUpdate}
                      className="w-full"
                      variant="outline"
                    >
                      Request Update
                    </Button>
                    
                    {updateMessage && (
                      <div className="mt-3">
                        <Alert
                          type={updateMessage.includes('Failed') ? 'error' : 'success'}
                          message={updateMessage}
                          onClose={() => setUpdateMessage('')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a Load</h3>
                  <p className="mt-1 text-sm text-gray-500">Choose a load from the list to view details and request updates.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerPortal;