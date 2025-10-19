// Vitals Add page for HealthMate Frontend
// Form for adding manual vitals entries

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vitalsAPI } from '../utils/api';
import { 
  Heart, 
  Activity, 
  Scale, 
  Droplets, 
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

const VitalsAdd = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    bloodPressure: {
      systolic: '',
      diastolic: '',
      unit: 'mmHg'
    },
    bloodSugar: {
      value: '',
      unit: 'mg/dL',
      type: 'fasting'
    },
    weight: {
      value: '',
      unit: 'kg'
    },
    notes: '',
    measurementDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    familyMemberId: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare data for API
      const vitalsData = {
        ...formData,
        measurementDate: new Date(formData.measurementDate).toISOString()
      };

      // Remove empty values
      Object.keys(vitalsData).forEach(key => {
        if (key === 'bloodPressure' || key === 'bloodSugar' || key === 'weight') {
          const obj = vitalsData[key];
          if (obj && typeof obj === 'object') {
            const hasValue = Object.values(obj).some(val => val !== '' && val !== null);
            if (!hasValue) {
              delete vitalsData[key];
            }
          }
        } else if (vitalsData[key] === '' || vitalsData[key] === null) {
          delete vitalsData[key];
        }
      });

      const result = await vitalsAPI.addVitals(vitalsData);

      if (result.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          bloodPressure: {
            systolic: '',
            diastolic: '',
            unit: 'mmHg'
          },
          bloodSugar: {
            value: '',
            unit: 'mg/dL',
            type: 'fasting'
          },
          weight: {
            value: '',
            unit: 'kg'
          },
          notes: '',
          measurementDate: new Date().toISOString().slice(0, 16),
          familyMemberId: null
        });
        
        // Redirect after success
        setTimeout(() => {
          navigate('/timeline');
        }, 2000);
      } else {
        setError(result.message || 'Failed to save vitals');
      }
    } catch (error) {
      console.error('Vitals save error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to save vitals');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Blood pressure validation
  const validateBloodPressure = () => {
    const { systolic, diastolic } = formData.bloodPressure;
    if (systolic && diastolic) {
      const sys = parseInt(systolic);
      const dia = parseInt(diastolic);
      
      if (sys < dia) {
        return 'Systolic pressure should be higher than diastolic';
      }
      if (sys > 300 || dia > 200) {
        return 'Values seem unusually high. Please verify.';
      }
    }
    return null;
  };

  const bpError = validateBloodPressure();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Health Vitals</h1>
          <p className="mt-2 text-gray-600">
            Record your health measurements and track your progress
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-sm text-green-700">
                Vitals saved successfully! Redirecting to timeline...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Vitals Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="measurementDate"
                value={formData.measurementDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            {/* Blood Pressure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="w-4 h-4 inline mr-2" />
                  Blood Pressure
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      name="bloodPressure.systolic"
                      value={formData.bloodPressure.systolic}
                      onChange={handleChange}
                      placeholder="Systolic"
                      min="50"
                      max="300"
                      className={`input ${bpError ? 'border-red-500' : ''}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Systolic</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="bloodPressure.diastolic"
                      value={formData.bloodPressure.diastolic}
                      onChange={handleChange}
                      placeholder="Diastolic"
                      min="30"
                      max="200"
                      className={`input ${bpError ? 'border-red-500' : ''}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Diastolic</p>
                  </div>
                </div>
                {bpError && (
                  <p className="text-sm text-red-600 mt-1">{bpError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Unit: mmHg</p>
              </div>

              {/* Blood Sugar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 inline mr-2" />
                  Blood Sugar
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="bloodSugar.value"
                    value={formData.bloodSugar.value}
                    onChange={handleChange}
                    placeholder="Value"
                    min="20"
                    max="600"
                    step="0.1"
                    className="input"
                  />
                  <select
                    name="bloodSugar.type"
                    value={formData.bloodSugar.type}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="fasting">Fasting</option>
                    <option value="random">Random</option>
                    <option value="post-meal">Post-meal</option>
                    <option value="hba1c">HbA1c</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">Unit: mg/dL</p>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Scale className="w-4 h-4 inline mr-2" />
                Weight
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="weight.value"
                  value={formData.weight.value}
                  onChange={handleChange}
                  placeholder="Weight"
                  min="10"
                  max="500"
                  step="0.1"
                  className="input"
                />
                <select
                  name="weight.unit"
                  value={formData.weight.unit}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            {/* Family Member Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                For Family Member (Optional)
              </label>
              <select
                name="familyMemberId"
                value={formData.familyMemberId || ''}
                onChange={handleChange}
                className="input"
              >
                <option value="">Myself</option>
                {/* TODO: Add family members from API */}
                <option value="family1">Family Member 1</option>
                <option value="family2">Family Member 2</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Add any additional notes about your health condition, symptoms, or observations..."
                className="input"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Vitals</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Vitals Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Blood Pressure:</h4>
              <ul className="space-y-1">
                <li>• Normal: &lt; 120/80 mmHg</li>
                <li>• Elevated: 120-129/&lt;80 mmHg</li>
                <li>• High: ≥ 130/80 mmHg</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Blood Sugar:</h4>
              <ul className="space-y-1">
                <li>• Fasting: 70-100 mg/dL</li>
                <li>• Random: &lt; 140 mg/dL</li>
                <li>• Post-meal: &lt; 180 mg/dL</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">General Tips:</h4>
              <ul className="space-y-1">
                <li>• Measure at same time daily</li>
                <li>• Rest 5 min before measuring</li>
                <li>• Use same device when possible</li>
                <li>• Consult doctor for concerns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsAdd;


