// Dashboard page for HealthMate Frontend
// Main dashboard showing health summary and quick actions

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { timelineAPI, vitalsAPI, filesAPI } from '../utils/api';
import { 
  Heart, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Upload, 
  Plus,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentVitals, setRecentVitals] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard data, recent vitals, and recent reports in parallel
        const [dashboardResponse, vitalsResponse, reportsResponse] = await Promise.all([
          timelineAPI.getDashboard(),
          vitalsAPI.getUserVitals(1, 5), // Get 5 most recent vitals
          filesAPI.getUserReports(1, 5)  // Get 5 most recent reports
        ]);

        if (dashboardResponse.success) {
          setDashboardData(dashboardResponse.data.summary);
        }

        if (vitalsResponse.success) {
          setRecentVitals(vitalsResponse.data.vitals);
        }

        if (reportsResponse.success) {
          setRecentReports(reportsResponse.data.reports);
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Quick action cards
  const quickActions = [
    {
      title: 'Upload Report',
      description: 'Upload medical reports for AI analysis',
      icon: Upload,
      link: '/upload',
      color: 'bg-blue-500',
    },
    {
      title: 'Add Vitals',
      description: 'Record your health vitals',
      icon: Plus,
      link: '/vitals/add',
      color: 'bg-green-500',
    },
    {
      title: 'View Timeline',
      description: 'See your health timeline',
      icon: Calendar,
      link: '/timeline',
      color: 'bg-purple-500',
    },
    {
      title: 'Family Members',
      description: 'Manage family health',
      icon: Users,
      link: '/family',
      color: 'bg-orange-500',
    },
  ];

  // Health status indicators
  const getHealthStatus = (vitals) => {
    if (!vitals || vitals.length === 0) return { status: 'unknown', color: 'gray', text: 'No data' };
    
    const latest = vitals[0];
    let issues = 0;
    
    // Check blood pressure
    if (latest.bloodPressure) {
      const { systolic, diastolic } = latest.bloodPressure;
      if (systolic > 140 || diastolic > 90) issues++;
    }
    
    // Check blood sugar
    if (latest.bloodSugar) {
      const { value, type } = latest.bloodSugar;
      if (type === 'fasting' && value > 100) issues++;
      if (type === 'random' && value > 200) issues++;
    }
    
    if (issues === 0) return { status: 'good', color: 'green', text: 'Good' };
    if (issues === 1) return { status: 'warning', color: 'yellow', text: 'Monitor' };
    return { status: 'alert', color: 'red', text: 'Attention' };
  };

  const healthStatus = getHealthStatus(recentVitals);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Here's your health overview for today
          </p>
        </div>

        {/* Health Status Card */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  healthStatus.color === 'green' ? 'bg-green-100' :
                  healthStatus.color === 'yellow' ? 'bg-yellow-100' :
                  healthStatus.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  <Heart className={`w-6 h-6 ${
                    healthStatus.color === 'green' ? 'text-green-600' :
                    healthStatus.color === 'yellow' ? 'text-yellow-600' :
                    healthStatus.color === 'red' ? 'text-red-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Health Status</h3>
                  <p className={`text-sm font-medium ${
                    healthStatus.color === 'green' ? 'text-green-600' :
                    healthStatus.color === 'yellow' ? 'text-yellow-600' :
                    healthStatus.color === 'red' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {healthStatus.text}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {recentVitals.length > 0 
                    ? new Date(recentVitals[0].measurementDate).toLocaleDateString()
                    : 'No data'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {/* Reports Count */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Medical Reports</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {dashboardData?.totalReports || recentReports.length}
                </p>
              </div>
            </div>
          </div>

          {/* Vitals Count */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Vitals Entries</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {dashboardData?.totalVitals || recentVitals.length}
                </p>
              </div>
            </div>
          </div>

          {/* Family Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Family Members</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {dashboardData?.totalFamilyMembers || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Last Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Last Activity</p>
                <p className="text-sm sm:text-sm font-bold text-gray-900">
                  {dashboardData?.lastActivity 
                    ? new Date(dashboardData.lastActivity).toLocaleDateString()
                    : 'No activity'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-primary-600">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Recent Vitals */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Vitals</h3>
                <Link
                  to="/timeline"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentVitals.length > 0 ? (
                <div className="space-y-4">
                  {recentVitals.slice(0, 3).map((vital) => (
                    <div key={vital._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Activity className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(vital.measurementDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {vital.notes || 'Vitals recorded'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {vital.bloodPressure && (
                          <p className="text-sm font-medium text-gray-900">
                            BP: {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                          </p>
                        )}
                        {vital.weight && (
                          <p className="text-sm text-gray-600">
                            {vital.weight.value} {vital.weight.unit}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No vitals recorded yet</p>
                  <Link
                    to="/vitals/add"
                    className="btn btn-primary"
                  >
                    Add Your First Vitals
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Reports</h3>
                <Link
                  to="/timeline"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentReports.length > 0 ? (
                <div className="space-y-4">
                  {recentReports.slice(0, 3).map((report) => (
                    <Link
                      key={report._id}
                      to={`/report/${report._id}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                            {report.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(report.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 capitalize">
                          {report.reportType}
                        </p>
                        {report.aiInsight && (
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No reports uploaded yet</p>
                  <Link
                    to="/upload"
                    className="btn btn-primary"
                  >
                    Upload Your First Report
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


