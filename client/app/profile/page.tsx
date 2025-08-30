'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/navbar';
import { EarthBackground } from '@/components/earth-background';
import { User, Mail, Building, Briefcase, Calendar, Save, Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    company: user?.company || ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please login to view your profile</h1>
          <Link href="/login" className="text-primary hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setIsEditing(false);
      // In a real app, you would update the user data here
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
    });
    setErrors({});
    setIsEditing(false);
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <EarthBackground />
      <Navbar />
      
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
            <p className="text-white/70">Manage your account information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 rounded-2xl">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                  <p className="text-white/70">{user.role}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-white/50" />
                    <span className="text-white/70">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="w-4 h-4 text-white/50" />
                    <span className="text-white/70">{user.company}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-white/50" />
                    <span className="text-white/70">Last login: {formatLastLogin(user.lastLogin)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Account Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.name ? 'border-red-400' : 'border-white/20'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.email ? 'border-red-400' : 'border-white/20'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Role Field */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Job Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.role ? 'border-red-400' : 'border-white/20'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Enter your job role"
                    />
                    {errors.role && (
                      <p className="text-red-400 text-sm mt-1">{errors.role}</p>
                    )}
                  </div>

                  {/* Company Field */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        errors.company ? 'border-red-400' : 'border-white/20'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Enter your company name"
                    />
                    {errors.company && (
                      <p className="text-red-400 text-sm mt-1">{errors.company}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Sections */}
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                {/* Account Security */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Security</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">
                      Change Password
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">
                      Two-Factor Authentication
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">
                      Connected Accounts
                    </button>
                  </div>
                </div>

                {/* Preferences */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">
                      Notification Settings
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">
                      Privacy Settings
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">
                      Data Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
