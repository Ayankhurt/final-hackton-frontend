// Main App component for HealthMate Frontend
// Router configuration and global layout

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/Upload';
import VitalsAdd from './pages/VitalsAdd';
import Timeline from './pages/Timeline';
import ReportViewer from './pages/ReportViewer';
import Family from './pages/Family';
import Reports from './pages/Reports';

// Layout wrapper for protected routes
const Layout = ({ children }) => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      
      {/* Bot Toggle Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors duration-200 flex items-center space-x-2"
          title="Open AI Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm font-medium">AI Bot</span>
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
      />
    </div>
  );
};

// Public layout (no header/footer)
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

// Home page component
const Home = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              HealthMate
            </h1>
            <p className="text-2xl text-gray-600 mb-4">
              Sehat ka Smart Dost
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              Your AI-powered health companion for managing medical reports, tracking vitals, 
              and getting personalized health insights in both English and Roman Urdu.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="btn btn-primary px-8 py-3 text-lg"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="btn btn-secondary px-8 py-3 text-lg"
              >
                Sign In
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Report Analysis</h3>
              <p className="text-gray-600">
                Upload medical reports and get AI-powered analysis with bilingual summaries
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Vitals Tracking</h3>
              <p className="text-gray-600">
                Record and monitor your health vitals with detailed analytics and trends
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Family Health</h3>
              <p className="text-gray-600">
                Manage health data for your entire family with individual profiles
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to take control of your health?</h2>
            <p className="text-primary-100 mb-6">
              Join thousands of users who trust HealthMate for their health management needs.
            </p>
            <a
              href="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Your Health Journey
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <Layout>
                  <UploadPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vitals/add" 
            element={
              <ProtectedRoute>
                <Layout>
                  <VitalsAdd />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/timeline" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Timeline />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report/:id" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ReportViewer />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/family" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Family />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;


