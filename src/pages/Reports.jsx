// Reports page for HealthMate Frontend
// List all medical reports with search and filter functionality

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { filesAPI } from '../utils/api';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Download,
  Eye,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  
  // State management
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    reportType: '',
    familyMemberId: '',
    startDate: '',
    endDate: ''
  });

  // Fetch reports
  const fetchReports = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 12,
        ...filters
      };

      // Add search term if provided
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key];
        }
      });

      const response = await filesAPI.getUserReports(params.page, params.limit, params.reportType, params.familyMemberId);

      if (response.success) {
        setReports(response.data.reports || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setError(response.message || 'Failed to load reports');
      }
    } catch (error) {
      console.error('Reports fetch error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  // Load reports on component mount and filter changes
  useEffect(() => {
    fetchReports(1);
  }, [filters, searchTerm]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchReports(page);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get report type display name
  const getReportTypeDisplay = (type) => {
    return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get status icon
  const getStatusIcon = (report) => {
    if (report.isProcessed && report.aiInsight) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (report.isProcessed) {
      return <Clock className="w-5 h-5 text-yellow-500" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Reports</h1>
              <p className="text-gray-600 mt-2">Manage and view all your medical reports</p>
            </div>
            <Link
              to="/upload"
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Upload Report</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </form>
            </div>

            {/* Report Type Filter */}
            <div>
              <select
                value={filters.reportType}
                onChange={(e) => handleFilterChange('reportType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Report Types</option>
                <option value="blood-test">Blood Test</option>
                <option value="urine-test">Urine Test</option>
                <option value="x-ray">X-Ray</option>
                <option value="ct-scan">CT Scan</option>
                <option value="mri">MRI</option>
                <option value="ecg">ECG</option>
                <option value="ultrasound">Ultrasound</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Start Date"
              />
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchReports(1)}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No reports found</p>
            <Link
              to="/upload"
              className="btn btn-primary"
            >
              Upload Your First Report
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Report Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {report.fileName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {getReportTypeDisplay(report.reportType)}
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(report)}
                  </div>
                </div>

                {/* Report Details */}
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Uploaded</span>
                      <span className="text-gray-900">{formatDate(report.uploadDate)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">File Size</span>
                      <span className="text-gray-900">{formatFileSize(report.fileSize)}</span>
                    </div>
                    {report.familyMember && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Family Member</span>
                        <span className="text-gray-900">{report.familyMember.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex space-x-2">
                    <Link
                      to={`/report/${report._id}`}
                      className="flex-1 btn btn-primary btn-sm flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Link>
                    {report.cloudinaryUrl && (
                      <a
                        href={report.cloudinaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm flex items-center justify-center"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
