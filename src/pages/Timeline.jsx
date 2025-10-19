// Timeline page for HealthMate Frontend
// Chronological view of all health data (reports and vitals)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { timelineAPI } from '../utils/api';
import { 
  Calendar, 
  FileText, 
  Activity, 
  Heart, 
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Timeline = () => {
  const { user } = useAuth();
  
  // State management
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: 'all', // 'all', 'reports', 'vitals'
    familyMemberId: null,
    startDate: '',
    endDate: ''
  });

  // Fetch timeline data
  const fetchTimelineData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 20,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key];
        }
      });

      const response = await timelineAPI.getTimeline(params);

      if (response.success) {
        setTimelineData(response.data.timeline);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setError(response.message || 'Failed to load timeline');
      }
    } catch (error) {
      console.error('Timeline fetch error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    fetchTimelineData(1);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchTimelineData(page);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Get timeline item icon
  const getTimelineIcon = (item) => {
    if (item.type === 'report') {
      return <FileText className="w-5 h-5 text-blue-600" />;
    } else if (item.type === 'vitals') {
      return <Activity className="w-5 h-5 text-green-600" />;
    }
    return <Clock className="w-5 h-5 text-gray-600" />;
  };

  // Get timeline item color
  const getTimelineColor = (item) => {
    if (item.type === 'report') {
      return 'bg-blue-100 border-blue-200';
    } else if (item.type === 'vitals') {
      return 'bg-green-100 border-green-200';
    }
    return 'bg-gray-100 border-gray-200';
  };

  // Render timeline item content
  const renderTimelineItem = (item) => {
    if (item.type === 'report') {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{item.fileName}</h4>
            <span className="text-xs text-gray-500 capitalize">{item.reportType}</span>
          </div>
          <p className="text-sm text-gray-600">
            {item.aiInsight ? 'AI Analysis Available' : 'AI Analysis Pending'}
          </p>
          {item.aiInsight && (
            <div className="flex items-center space-x-2 text-xs text-green-600">
              <CheckCircle className="w-3 h-3" />
              <span>Analysis Complete</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Link
              to={`/report/${item.id}`}
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View Report
            </Link>
            {item.familyMember && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{item.familyMember.name}</span>
              </div>
            )}
          </div>
        </div>
      );
    } else if (item.type === 'vitals') {
      return (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Vitals Entry</h4>
          <div className="space-y-1">
            {item.bloodPressure && (
              <p className="text-sm text-gray-600">
                BP: {item.bloodPressure.systolic}/{item.bloodPressure.diastolic} mmHg
              </p>
            )}
            {item.bloodSugar && (
              <p className="text-sm text-gray-600">
                Sugar: {item.bloodSugar.value} mg/dL ({item.bloodSugar.type})
              </p>
            )}
            {item.weight && (
              <p className="text-sm text-gray-600">
                Weight: {item.weight.value} {item.weight.unit}
              </p>
            )}
          </div>
          {item.notes && (
            <p className="text-sm text-gray-500 italic">"{item.notes}"</p>
          )}
          <div className="flex items-center justify-between">
            <Link
              to={`/vitals/${item.id}`}
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View Details
            </Link>
            {item.familyMember && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{item.familyMember.name}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Health Timeline</h1>
          <p className="mt-2 text-gray-600">
            View all your health data in chronological order
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="input"
              >
                <option value="all">All</option>
                <option value="reports">Reports Only</option>
                <option value="vitals">Vitals Only</option>
              </select>
            </div>

            {/* Family Member Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Family Member
              </label>
              <select
                value={filters.familyMemberId || ''}
                onChange={(e) => handleFilterChange('familyMemberId', e.target.value || null)}
                className="input"
              >
                <option value="">All Members</option>
                {/* TODO: Add family members from API */}
                <option value="family1">Family Member 1</option>
                <option value="family2">Family Member 2</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="input"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading timeline...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {!loading && !error && (
          <div className="space-y-6">
            {timelineData.length > 0 ? (
              timelineData.map((item, index) => {
                const { date, time } = formatDate(item.date);
                return (
                  <div key={`${item.type}-${item.id}`} className="relative">
                    {/* Timeline Line */}
                    {index < timelineData.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                    )}
                    
                    {/* Timeline Item */}
                    <div className={`relative flex items-start space-x-4 p-4 rounded-lg border ${getTimelineColor(item)}`}>
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                        {getTimelineIcon(item)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">{date}</span>
                            <span className="text-sm text-gray-500">{time}</span>
                          </div>
                          <span className="text-xs text-gray-500 capitalize">
                            {item.type}
                          </span>
                        </div>
                        
                        {renderTimelineItem(item)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Timeline Data</h3>
                <p className="text-gray-500 mb-6">
                  Start by uploading a medical report or adding your vitals
                </p>
                <div className="flex justify-center space-x-4">
                  <Link to="/upload" className="btn btn-primary">
                    Upload Report
                  </Link>
                  <Link to="/vitals/add" className="btn btn-secondary">
                    Add Vitals
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && timelineData.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;


