// Report Viewer page for HealthMate Frontend
// Detailed view of medical report with AI analysis

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { filesAPI } from '../utils/api';
import AIAssistant from '../components/AIAssistant';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Languages, 
  AlertTriangle,
  CheckCircle,
  Heart,
  Loader,
  Eye,
  Calendar,
  User,
  Trash2,
  RefreshCw,
  Bot,
  X
} from 'lucide-react';

const ReportViewer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('english'); // 'english' or 'urdu'
  const [isRetryingAnalysis, setIsRetryingAnalysis] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await filesAPI.getReport(id);

        if (response.success) {
          setReport(response.data);
        } else {
          setError(response.message || 'Failed to load report');
        }
      } catch (error) {
        console.error('Report fetch error:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  // Retry AI analysis
  const retryAnalysis = async () => {
    try {
      setIsRetryingAnalysis(true);
      setError(null);

      const response = await filesAPI.retryAnalysis(id);

      if (response.success) {
        setReport(prev => ({
          ...prev,
          aiInsight: response.data.aiInsight
        }));
        setError(null); // Clear any previous errors
      } else {
        setError(response.message || 'Failed to retry analysis');
      }
    } catch (error) {
      console.error('Retry analysis error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to retry analysis';
      setError(`AI Analysis Error: ${errorMessage}`);
    } finally {
      setIsRetryingAnalysis(false);
    }
  };

  // Delete report
  const deleteReport = async () => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await filesAPI.deleteReport(id);

      if (response.success) {
        navigate('/timeline');
      } else {
        setError(response.message || 'Failed to delete report');
      }
    } catch (error) {
      console.error('Delete report error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to delete report');
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/timeline')}
            className="btn btn-primary"
          >
            Back to Timeline
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Report not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/timeline')}
                className="btn btn-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{report.fileName}</h1>
                <p className="text-gray-600">Medical Report Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={retryAnalysis}
                disabled={isRetryingAnalysis}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetryingAnalysis ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry AI Analysis
                  </>
                )}
              </button>
              <button
                onClick={deleteReport}
                className="btn btn-danger"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 mb-1">Analysis Error</h4>
                <p className="text-sm text-red-700 mb-2">{error}</p>
                <div className="text-xs text-red-600">
                  <p>• Try uploading a new report</p>
                  <p>• Check your internet connection</p>
                  <p>• Contact support if the issue persists</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report?.fileName || 'Unknown File'}</p>
                    <p className="text-xs text-gray-500">{report?.fileSize ? formatFileSize(report.fileSize) : 'Unknown Size'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Uploaded</p>
                    <p className="text-xs text-gray-500">{report?.uploadDate ? formatDate(report.uploadDate) : 'Unknown Date'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Report Type</p>
                    <p className="text-xs text-gray-500 capitalize">{report?.reportType || 'Unknown Type'}</p>
                  </div>
                </div>

                {report?.familyMember && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Family Member</p>
                      <p className="text-xs text-gray-500">{report.familyMember.name} ({report.familyMember.relationship})</p>
                    </div>
                  </div>
                )}
              </div>

              {/* File Preview */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">File Preview</h4>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {report?.cloudinaryUrl ? (
                    <div className="text-center">
                      <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <a
                        href={report.cloudinaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                      >
                        View Original File
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No preview available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="lg:col-span-2">
            {report.aiInsight ? (
              <div className="space-y-6">
                {/* Language Toggle */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
                    <div className="flex items-center space-x-2">
                      <Languages className="w-4 h-4 text-gray-500" />
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setLanguage('english')}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            language === 'english'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => setLanguage('urdu')}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            language === 'urdu'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Roman Urdu
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Summary</h4>
                    <p className={`text-sm text-blue-800 ${language === 'urdu' ? 'urdu-text' : ''}`}>
                      {language === 'english' 
                        ? report.aiInsight.summaryEnglish 
                        : report.aiInsight.summaryRomanUrdu
                      }
                    </p>
                  </div>

                  {/* Abnormal Values */}
                  {report.aiInsight.abnormalValues && 
                   report.aiInsight.abnormalValues.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                        Abnormal Values Detected
                      </h4>
                      <div className="space-y-2">
                        {report.aiInsight.abnormalValues.map((value, index) => (
                          <div key={index} className="text-sm text-yellow-800">
                            <div className="font-medium">{value.parameter}: {value.value}</div>
                            <div className="text-xs text-yellow-700">Normal Range: {value.normalRange}</div>
                            <div className="text-xs text-yellow-700">Severity: {value.severity}</div>
                            <div className="text-xs text-yellow-700">{value.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Doctor Questions */}
                  {report.aiInsight.doctorQuestions && 
                   report.aiInsight.doctorQuestions.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-green-900 mb-2">
                        Questions to Ask Your Doctor
                      </h4>
                      <ul className="text-sm text-green-800 space-y-2">
                        {report.aiInsight.doctorQuestions.map((question, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-green-600 font-bold">•</span>
                            <div>
                              <div>{question.question}</div>
                              <div className="text-xs text-green-700">Priority: {question.priority}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Food Recommendations */}
                  {report.aiInsight.foodRecommendations && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-purple-900 mb-2">
                        Food Recommendations
                      </h4>
                      
                      {/* Foods to Avoid */}
                      {report.aiInsight.foodRecommendations.avoid && 
                       report.aiInsight.foodRecommendations.avoid.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-red-800 mb-2">❌ Foods to Avoid:</h5>
                          <ul className="text-sm text-red-700 space-y-1">
                            {report.aiInsight.foodRecommendations.avoid.map((food, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-600">•</span>
                                <div>
                                  <div className="font-medium">{food.food}</div>
                                  <div className="text-xs text-red-600">{food.reason}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Foods to Include */}
                      {report.aiInsight.foodRecommendations.include && 
                       report.aiInsight.foodRecommendations.include.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-green-800 mb-2">✅ Foods to Include:</h5>
                          <ul className="text-sm text-green-700 space-y-1">
                            {report.aiInsight.foodRecommendations.include.map((food, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-green-600">•</span>
                                <div>
                                  <div className="font-medium">{food.food}</div>
                                  <div className="text-xs text-green-600">{food.benefit}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Disclaimer */}
                  {report.aiInsight.disclaimer && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-red-900 mb-2">
                        Important Disclaimer
                      </h4>
                      <p className="text-sm text-red-800">
                        {report.aiInsight.disclaimer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center py-8">
                  <Loader className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis Pending</h3>
                  <p className="text-gray-500 mb-6">
                    The AI analysis for this report is still being processed. This may take a few minutes.
                  </p>
                  <button
                    onClick={retryAnalysis}
                    disabled={isRetryingAnalysis}
                    className="btn btn-primary"
                  >
                    {isRetryingAnalysis ? (
                      <div className="flex items-center space-x-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Retrying...</span>
                      </div>
                    ) : (
                      'Retry Analysis'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link to="/timeline" className="btn btn-secondary">
            Back to Timeline
          </Link>
          <Link to="/upload" className="btn btn-primary">
            Upload Another Report
          </Link>
        </div>
      </div>

      {/* AI Assistant Toggle Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors duration-200 flex items-center space-x-2"
          title="Open AI Assistant"
        >
          <Bot className="w-6 h-6" />
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

export default ReportViewer;