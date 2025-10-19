// Family page for HealthMate Frontend
// Family member management and health overview

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { familyAPI } from '../utils/api';
import { 
  Users, 
  Plus, 
  User, 
  Calendar, 
  Heart, 
  Activity,
  FileText,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react';

const Family = () => {
  const { user } = useAuth();
  
  // State management
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyOverview, setFamilyOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form state for adding/editing family member
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'child',
    dateOfBirth: '',
    gender: 'male',
    bloodGroup: 'unknown',
    phone: '',
    email: '',
    allergies: [],
    medicalConditions: [],
    medications: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch family data
  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [membersResponse, overviewResponse] = await Promise.all([
          familyAPI.getFamilyMembers(),
          familyAPI.getFamilyOverview()
        ]);

        if (membersResponse.success) {
          setFamilyMembers(membersResponse.data.familyMembers || []);
        }

        if (overviewResponse.success) {
          setFamilyOverview(overviewResponse.data);
        }
      } catch (error) {
        console.error('Family data fetch error:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load family data');
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, []);

  // Handle form input changes
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
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const memberData = {
        name: formData.name,
        relationship: formData.relationship,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone || undefined, // Send undefined instead of empty string
        email: formData.email || undefined, // Send undefined instead of empty string
        emergencyContact: {
          name: formData.emergencyContact.name || undefined,
          relationship: formData.emergencyContact.relationship || undefined,
          phone: formData.emergencyContact.phone || undefined,
          email: formData.emergencyContact.email || undefined
        },
        notes: formData.notes || undefined
      };

      // Remove undefined values
      Object.keys(memberData).forEach(key => {
        if (memberData[key] === undefined) {
          delete memberData[key];
        }
      });

      // Clean emergency contact
      if (memberData.emergencyContact) {
        Object.keys(memberData.emergencyContact).forEach(key => {
          if (memberData.emergencyContact[key] === undefined) {
            delete memberData.emergencyContact[key];
          }
        });
        if (Object.keys(memberData.emergencyContact).length === 0) {
          delete memberData.emergencyContact;
        }
      }

      let response;
      if (editingMember) {
        response = await familyAPI.updateFamilyMember(editingMember._id, memberData);
      } else {
        response = await familyAPI.addFamilyMember(memberData);
      }

      if (response.success) {
        // Refresh family data
        const membersResponse = await familyAPI.getFamilyMembers();
        if (membersResponse.success) {
          setFamilyMembers(membersResponse.data.familyMembers || []);
        }
        
        // Reset form and close modal
        setFormData({
          name: '',
          relationship: 'child',
          dateOfBirth: '',
          gender: 'male',
          bloodGroup: 'unknown',
          phone: '',
          email: '',
          allergies: [],
          medicalConditions: [],
          medications: [],
          emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
            email: ''
          },
          notes: ''
        });
        setShowAddForm(false);
        setEditingMember(null);
      } else {
        setError(response.message || 'Failed to save family member');
      }
    } catch (error) {
      console.error('Family member save error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to save family member');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit family member
  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().slice(0, 10) : '',
      gender: member.gender,
      bloodGroup: member.bloodGroup,
      phone: member.phone || '',
      email: member.email || '',
      allergies: member.allergies || [],
      medicalConditions: member.medicalConditions || [],
      medications: member.medications || [],
      emergencyContact: member.emergencyContact || {
        name: '',
        relationship: '',
        phone: '',
        email: ''
      },
      notes: member.notes || ''
    });
    setShowAddForm(true);
  };

  // Handle delete family member
  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this family member? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await familyAPI.deleteFamilyMember(memberId);

      if (response.success) {
        // Refresh family data
        const membersResponse = await familyAPI.getFamilyMembers();
        if (membersResponse.success) {
          setFamilyMembers(membersResponse.data.familyMembers || []);
        }
      } else {
        setError(response.message || 'Failed to delete family member');
      }
    } catch (error) {
      console.error('Delete family member error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to delete family member');
    }
  };

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Relationship options
  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'other', label: 'Other' }
  ];

  // Gender options
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  // Blood group options
  const bloodGroupOptions = [
    { value: 'unknown', label: 'Unknown' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Family Health</h1>
              <p className="mt-2 text-gray-600">
                Manage health data for your entire family
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Family Member
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading family data...</p>
            </div>
          </div>
        )}

        {/* Family Overview */}
        {!loading && familyOverview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {familyOverview.totalMembers || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {familyOverview.totalReports || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Vitals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {familyOverview.totalVitals || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Conditions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {familyOverview.activeConditions || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Family Members List */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyMembers.map((member, index) => (
              <div key={member._id || `member-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{member.relationship}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Age: {calculateAge(member.dateOfBirth)} years</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4" />
                    <span>Blood Group: {member.bloodGroup}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/family/${member._id}/health-summary`}
                    className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                  >
                    View Health Summary
                  </Link>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{member.reportsCount || 0} reports</span>
                    <span>{member.vitalsCount || 0} vitals</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Family Member Card */}
            <div key="add-family-member" className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 flex items-center justify-center hover:border-primary-400 transition-colors cursor-pointer"
                 onClick={() => setShowAddForm(true)}>
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Add Family Member</p>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Family Member Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingMember ? 'Edit Family Member' : 'Add Family Member'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingMember(null);
                      setFormData({
                        name: '',
                        relationship: 'child',
                        dateOfBirth: '',
                        gender: 'male',
                        bloodGroup: 'unknown',
                        phone: '',
                        email: '',
                        allergies: [],
                        medicalConditions: [],
                        medications: [],
                        emergencyContact: {
                          name: '',
                          relationship: '',
                          phone: '',
                          email: ''
                        },
                        notes: ''
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <select
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        required
                        className="input"
                      >
                        {relationshipOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="input"
                      >
                        {genderOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="input"
                      >
                        {bloodGroupOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContact.name"
                          value={formData.emergencyContact.name}
                          onChange={handleChange}
                          className="input"
                          placeholder="Emergency contact name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship
                        </label>
                        <input
                          type="text"
                          name="emergencyContact.relationship"
                          value={formData.emergencyContact.relationship}
                          onChange={handleChange}
                          className="input"
                          placeholder="Relationship to family member"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact.phone}
                          onChange={handleChange}
                          className="input"
                          placeholder="Emergency contact phone"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="emergencyContact.email"
                          value={formData.emergencyContact.email}
                          onChange={handleChange}
                          className="input"
                          placeholder="Emergency contact email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="input"
                      placeholder="Additional notes about this family member..."
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingMember(null);
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        editingMember ? 'Update Member' : 'Add Member'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Family;
