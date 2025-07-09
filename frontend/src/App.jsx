import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import api from './services/api'
import ModernDashboard from './components/ModernDashboard'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import BrokerPortal from './pages/BrokerPortal'

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

  // Protected route component
  const ProtectedRoute = ({ children, requiredRole = null }) => {
    if (isLoading) return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
    
    if (!isAuthenticated) return <Navigate to="/login" />
    
    if (requiredRole && user?.role !== requiredRole) {
      return <Navigate to="/login" />
    }
    
    return children
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={
          isAuthenticated ? (
            user?.role === 'admin' ? <Navigate to="/admin" /> :
            user?.role === 'driver' ? <Navigate to="/driver" /> :
            <Navigate to="/broker" />
          ) : (
            <LandingPage />
          )
        } />
        
        {/* Login */}
        <Route path="/login" element={
          !isAuthenticated ? (
            <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          ) : (
            <Navigate to="/" />
          )
        } />
        
        {/* Admin Portal */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <ModernDashboard 
              mode="admin"
              loads={loads}
              drivers={drivers}
              trucks={trucks}
              onRefresh={loadData}
              currentUser={user}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } />
        
        {/* Driver Portal */}
        <Route path="/driver" element={
          <ProtectedRoute requiredRole="driver">
            <ModernDashboard 
              mode="driver"
              loads={loads.filter(load => load.driver && load.driver._id === user?._id)}
              drivers={[]}
              trucks={[]}
              onRefresh={loadData}
              currentUser={user}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        } />
        
        {/* Broker Portal (Public) */}
        <Route path="/broker" element={<BrokerPortal />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App