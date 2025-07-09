import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import api from './services/api'
import Dashboard from './components/Dashboard'
import RateConfirmationUploader from './components/RateConfirmationUploader'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  const [loads, setLoads] = useState([])
  const [drivers, setDrivers] = useState([])
  const [trucks, setTrucks] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
      loadData()
    }
    
    setIsLoading(false)
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [loadsData, driversData, trucksData] = await Promise.all([
        api.getLoads(),
        api.getDrivers(),
        api.getTrucks()
      ])
      setLoads(loadsData)
      setDrivers(driversData)
      setTrucks(trucksData)
    } catch (error) {
      console.error('Error loading data:', error)
      // If unauthorized, logout
      if (error.response?.status === 401) {
        handleLogout()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  const createSampleData = async () => {
    try {
      // Create sample truck
      await api.createTruck({
        truckId: 'TRK001',
        licensePlate: 'ABC123',
        make: 'Freightliner',
        model: 'Cascadia',
        year: 2022,
        capacity: 80000
      })
      
      // Create sample driver
      await api.createDriver({
        name: 'John Smith',
        licenseNumber: 'CDL123456',
        phone: '555-0123',
        email: 'john@pwp.com'
      })
      
      // Create sample load
      await api.createLoad({
        loadId: 'LD001',
        pickupLocation: 'Chicago, IL',
        deliveryLocation: 'Dallas, TX',
        pickupDate: new Date(),
        deliveryDate: new Date(Date.now() + 86400000),
        rate: 2500,
        weight: 45000
      })
      
      loadData()
      alert('Sample data created successfully!')
    } catch (error) {
      alert('Error creating sample data: ' + error.message)
    }
  }

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) return <div>Loading...</div>
    if (!isAuthenticated) return <Navigate to="/login" />
    return children
  }

  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        {isAuthenticated && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>🚛 PWP Fleet Management System</h1>
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
        )}
        
        <Routes>
          <Route path="/login" element={!isAuthenticated ? 
            <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} /> : 
            <Navigate to="/" />
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <div>
                <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Dashboard</Link>
                  <Link to="/loads" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Loads</Link>
                  <Link to="/drivers" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Drivers</Link>
                  <Link to="/trucks" style={{ textDecoration: 'none', color: '#007bff' }}>Trucks</Link>
                </nav>
                
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
            </ProtectedRoute>
          } />
          
          <Route path="/loads" element={
            <ProtectedRoute>
              <div>
                <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Dashboard</Link>
                  <Link to="/loads" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Loads</Link>
                  <Link to="/drivers" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Drivers</Link>
                  <Link to="/trucks" style={{ textDecoration: 'none', color: '#007bff' }}>Trucks</Link>
                </nav>
                
                <h2>📦 Load Management</h2>
                
                <RateConfirmationUploader onLoadCreated={() => loadData()} />
                
                {isLoading ? (
                  <p>Loading...</p>
                ) : loads.length === 0 ? (
                  <p>No loads found. Create sample data to get started.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Load ID</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Pickup</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Delivery</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Rate</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Distance</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loads.map(load => (
                          <tr key={load._id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{load.loadId}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{load.pickupLocation}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{load.deliveryLocation}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>${load.rate}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{load.distance ? `${load.distance} mi` : 'N/A'}</td>
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
                              <button
                                onClick={() => api.generateInvoice(load.loadId)}
                                style={{ 
                                  padding: '4px 8px', 
                                  backgroundColor: '#007bff', 
                                  color: 'white', 
                                  border: 'none', 
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.9em'
                                }}
                              >
                                Invoice
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/drivers" element={
            <ProtectedRoute>
              <div>
                <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Dashboard</Link>
                  <Link to="/loads" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Loads</Link>
                  <Link to="/drivers" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Drivers</Link>
                  <Link to="/trucks" style={{ textDecoration: 'none', color: '#007bff' }}>Trucks</Link>
                </nav>
                
                <h2>👨‍💼 Driver Management</h2>
                {isLoading ? (
                  <p>Loading...</p>
                ) : drivers.length === 0 ? (
                  <p>No drivers found. Create sample data to get started.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {drivers.map(driver => (
                      <div key={driver._id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3>{driver.name}</h3>
                        <p><strong>License:</strong> {driver.licenseNumber}</p>
                        <p><strong>Phone:</strong> {driver.phone}</p>
                        <p><strong>Status:</strong> 
                          <span style={{ 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            backgroundColor: 
                              driver.status === 'available' ? '#d4edda' : 
                              driver.status === 'on-duty' ? '#fff3cd' : 
                              driver.status === 'off-duty' ? '#f8f9fa' : '#f5c6cb',
                            color: 
                              driver.status === 'available' ? '#155724' : 
                              driver.status === 'on-duty' ? '#856404' : 
                              driver.status === 'off-duty' ? '#6c757d' : '#721c24',
                            marginLeft: '5px'
                          }}>
                            {driver.status || 'available'}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/trucks" element={
            <ProtectedRoute>
              <div>
                <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Dashboard</Link>
                  <Link to="/loads" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Loads</Link>
                  <Link to="/drivers" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>Drivers</Link>
                  <Link to="/trucks" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Trucks</Link>
                </nav>
                
                <h2>🚛 Fleet Management</h2>
                {isLoading ? (
                  <p>Loading...</p>
                ) : trucks.length === 0 ? (
                  <p>No trucks found. Create sample data to get started.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {trucks.map(truck => (
                      <div key={truck._id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3>{truck.make} {truck.model}</h3>
                        <p><strong>Truck ID:</strong> {truck.truckId}</p>
                        <p><strong>License Plate:</strong> {truck.licensePlate}</p>
                        <p><strong>Year:</strong> {truck.year}</p>
                        <p><strong>Status:</strong> 
                          <span style={{ 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            backgroundColor: 
                              truck.status === 'available' ? '#d4edda' : 
                              truck.status === 'in-use' ? '#fff3cd' : 
                              truck.status === 'maintenance' ? '#cce5ff' : '#f5c6cb',
                            color: 
                              truck.status === 'available' ? '#155724' : 
                              truck.status === 'in-use' ? '#856404' : 
                              truck.status === 'maintenance' ? '#004085' : '#721c24',
                            marginLeft: '5px'
                          }}>
                            {truck.status || 'available'}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App