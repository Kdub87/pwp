import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'admin',
      title: 'Admin Portal',
      description: 'Complete fleet management with full access to loads, drivers, trucks, and analytics',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      features: ['Fleet Management', 'Driver Oversight', 'Load Tracking', 'Analytics & Reports'],
      path: '/admin'
    },
    {
      id: 'driver',
      title: 'Driver Portal',
      description: 'Access your assigned loads, update delivery status, and manage documents',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      features: ['My Loads', 'Status Updates', 'Document Upload', 'Route Information'],
      path: '/driver'
    },
    {
      id: 'broker',
      title: 'Broker Portal',
      description: 'Track shipments, view delivery status, and request updates from carriers',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      features: ['Shipment Tracking', 'Real-time Updates', 'Delivery Confirmation', 'Communication'],
      path: '/broker'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">PWP</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fleet Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Streamline your trucking operations with our comprehensive fleet management platform. 
              Choose your portal below to get started.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Portals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Portal</h2>
          <p className="text-lg text-gray-600">Select the portal that matches your role and responsibilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal) => (
            <div
              key={portal.id}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${portal.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative p-8">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${portal.color} text-white mb-6 shadow-lg`}>
                  {portal.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{portal.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{portal.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {portal.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => navigate(portal.path)}
                  className={`w-full bg-gradient-to-r ${portal.color} text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}
                >
                  Access {portal.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PWP Fleet Pro?</h2>
            <p className="text-lg text-gray-600">Built for modern trucking operations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Real-time Tracking',
                description: 'Monitor your fleet in real-time with live updates and notifications'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Automated Workflows',
                description: 'Streamline operations with automated load assignments and invoicing'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
                  </svg>
                ),
                title: 'Smart Analytics',
                description: 'Make data-driven decisions with comprehensive reporting and insights'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with 99.9% uptime guarantee'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 bg-white rounded-lg shadow-sm text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">© 2024 PWP Fleet Management. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <button className="text-gray-500 hover:text-gray-700 text-sm">Privacy Policy</button>
              <button className="text-gray-500 hover:text-gray-700 text-sm">Terms of Service</button>
              <button className="text-gray-500 hover:text-gray-700 text-sm">Support</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;