// Upload page for HealthMate Frontend
// Medical report upload with drag & drop and AI analysis

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { filesAPI } from '../utils/api';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  Eye,
  Download,
  Languages
} from 'lucide-react';

const UploadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportType, setReportType] = useState('blood-test');
  const [familyMemberId, setFamilyMemberId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('english'); // 'english' or 'urdu'

  // Report type options
  const reportTypes = [
    { value: 'blood-test', label: 'Blood Test' },
    { value: 'urine-test', label: 'Urine Test' },
    { value: 'x-ray', label: 'X-Ray' },
    { value: 'ct-scan', label: 'CT Scan' },
    { value: 'mri', label: 'MRI' },
    { value: 'ecg', label: 'ECG' },
    { value: 'ultrasound', label: 'Ultrasound' },
    { value: 'other', label: 'Other' },
  ];

  // File drop handler
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
    }
  }, []);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await filesAPI.uploadReport(
        selectedFile,
        reportType,
        familyMemberId
      );

      if (result.success) {
        setUploadResult(result.data);
        // Navigate to report viewer after successful upload
        setTimeout(() => {
          navigate(`/report/${result.data.file.id}`);
        }, 2000);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setError(null);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Medical Report</h1>
          <p className="mt-2 text-gray-600">
            Upload your medical reports for AI-powered analysis and insights
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Medical Report
            </label>
            
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-primary-600 font-medium">
                    Drop the file here...
                  </p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop your medical report here, or{' '}
                      <span className="text-primary-600 font-medium">browse</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PDF, JPG, PNG, GIF (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Report Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Family Member Selection (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              For Family Member (Optional)
            </label>
            <select
              value={familyMemberId || ''}
              onChange={(e) => setFamilyMemberId(e.target.value || null)}
              className="input"
            >
              <option value="">Myself</option>
              {/* TODO: Add family members from API */}
              <option value="family1">Family Member 1</option>
              <option value="family2">Family Member 2</option>
            </select>
          </div>

          {/* Upload Button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="btn btn-primary px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Uploading & Analyzing...</span>
                </div>
              ) : (
                'Upload & Analyze'
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Successful!
              </h3>
            </div>

            {/* AI Analysis Results */}
            {uploadResult.aiInsight && (
              <div className="space-y-6">
                {/* Language Toggle */}
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-semibold text-gray-900">AI Analysis</h4>
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-blue-900 mb-2">Summary</h5>
                  <p className={`text-sm text-blue-800 ${language === 'urdu' ? 'urdu-text' : ''}`}>
                    {language === 'english' 
                      ? uploadResult.aiInsight.englishSummary 
                      : uploadResult.aiInsight.romanUrduSummary
                    }
                  </p>
                </div>

                {/* Abnormal Values */}
                {uploadResult.aiInsight.detectedAbnormalValues && 
                 uploadResult.aiInsight.detectedAbnormalValues.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-yellow-900 mb-2">
                      Abnormal Values Detected
                    </h5>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {uploadResult.aiInsight.detectedAbnormalValues.map((value, index) => (
                        <li key={index}>• {value}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Doctor Questions */}
                {uploadResult.aiInsight.suggestedDoctorQuestions && 
                 uploadResult.aiInsight.suggestedDoctorQuestions.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-green-900 mb-2">
                      Questions to Ask Your Doctor
                    </h5>
                    <ul className="text-sm text-green-800 space-y-1">
                      {uploadResult.aiInsight.suggestedDoctorQuestions.map((question, index) => (
                        <li key={index}>• {question}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Food Recommendations */}
                {uploadResult.aiInsight.foodRecommendations && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-purple-900 mb-2">
                      Food Recommendations
                    </h5>
                    <div className="text-sm text-purple-800">
                      {typeof uploadResult.aiInsight.foodRecommendations === 'string' 
                        ? uploadResult.aiInsight.foodRecommendations
                        : JSON.stringify(uploadResult.aiInsight.foodRecommendations)
                      }
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                {uploadResult.aiInsight.disclaimer && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-red-900 mb-2">
                      Important Disclaimer
                    </h5>
                    <p className="text-sm text-red-800">
                      {uploadResult.aiInsight.disclaimer}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Redirecting to detailed report view...
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/report/${uploadResult.file.id}`)}
                      className="btn btn-primary"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Report
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="btn btn-secondary"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Upload Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Supported Formats:</h4>
              <ul className="space-y-1">
                <li>• PDF documents</li>
                <li>• JPG/JPEG images</li>
                <li>• PNG images</li>
                <li>• GIF images</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">File Requirements:</h4>
              <ul className="space-y-1">
                <li>• Maximum file size: 10MB</li>
                <li>• Clear, readable text/images</li>
                <li>• Medical reports only</li>
                <li>• One file per upload</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;


