import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { User as UserType } from '../../types';
import { useVoice } from '../../hooks/useVoice';

interface ProfilePageProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  onSignOut: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onSignOut }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: user.full_name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || ''
  });

  // Voice commands for profile page
  const voiceCommands = [
    {
      command: 'edit profile',
      action: () => {
        setIsEditing(true);
        speak('प्रोफाइल संपादन मोड सक्रिय। Profile editing mode activated. You can now modify your information.');
      },
      description: 'Edit profile information'
    },
    {
      command: 'प्रोफाइल संपादित करें',
      action: () => {
        setIsEditing(true);
        speak('प्रोफाइल संपादन मोड सक्रिय। Profile editing mode activated.');
      },
      description: 'Edit profile in Hindi'
    },
    {
      command: 'save profile',
      action: () => {
        if (isEditing) {
          handleSave();
        }
      },
      description: 'Save profile changes'
    },
    {
      command: 'प्रोफाइल सेव करें',
      action: () => {
        if (isEditing) {
          handleSave();
        }
      },
      description: 'Save profile in Hindi'
    },
    {
      command: 'cancel edit',
      action: () => {
        setIsEditing(false);
        setEditData({
          full_name: user.full_name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || ''
        });
        speak('प्रोफाइल संपादन रद्द। Profile editing cancelled');
      },
      description: 'Cancel profile editing'
    },
    {
      command: 'संपादन रद्द करें',
      action: () => {
        setIsEditing(false);
        setEditData({
          full_name: user.full_name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || ''
        });
        speak('प्रोफाइल संपादन रद्द। Profile editing cancelled');
      },
      description: 'Cancel editing in Hindi'
    },
    {
      command: 'sign out',
      action: () => {
        speak('Saarathi से साइन आउट हो रहे हैं। Signing out of Saarathi');
        onSignOut();
      },
      description: 'Sign out of account'
    },
    {
      command: 'साइन आउट करें',
      action: () => {
        speak('Saarathi से साइन आउट हो रहे हैं। Signing out of Saarathi');
        onSignOut();
      },
      description: 'Sign out in Hindi'
    }
  ];

  const { isListening, startListening, stopListening, speak, isSupported } = useVoice(voiceCommands);

  const handleSave = () => {
    const updatedUser: UserType = {
      ...user,
      full_name: editData.full_name,
      email: editData.email,
      phone: editData.phone,
      address: editData.address
    };

    onUpdateUser(updatedUser);
    setIsEditing(false);
    speak('प्रोफाइल सफलतापूर्वक अपडेट हो गया। Profile updated successfully');
  };

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">प्रोफाइल | Profile</h1>
                <p className="text-gray-600">अपना खाता प्रबंधित करें | Manage your account</p>
              </div>
            </div>
            {isSupported && (
              <button
                onClick={handleToggleVoice}
                className={`p-3 rounded-full transition-colors ${
                  isListening ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
                aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
              >
                <Volume2 size={20} />
              </button>
            )}
          </div>

          {/* Voice Commands Help */}
          {isSupported && isListening && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">वॉयस कमांड | Voice Commands:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>"प्रोफाइल संपादित करें" | "Edit profile" - संपादन शुरू करें | Start editing</div>
                <div>"प्रोफाइल सेव करें" | "Save profile" - परिवर्तन सेव करें | Save changes</div>
                <div>"संपादन रद्द करें" | "Cancel edit" - संपादन रद्द करें | Cancel editing</div>
                <div>"साइन आउट करें" | "Sign out" - खाते से साइन आउट | Sign out of account</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">व्यक्तिगत जानकारी | Personal Information</h2>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(true);
                  speak('प्रोफाइल संपादन मोड सक्रिय। Profile editing mode activated');
                }}
                ariaDescription="Edit profile information"
                className="flex items-center space-x-1"
              >
                <Edit3 size={16} />
                <span>संपादित करें | Edit</span>
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                पूरा नाम | Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.full_name}
                  onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onFocus={() => speak('पूरा नाम फील्ड फोकस्ड। Full name field focused')}
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{user.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                ईमेल पता | Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onFocus={() => speak('ईमेल फील्ड फोकस्ड। Email field focused')}
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{user.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                फोन नंबर | Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="फोन नंबर दर्ज करें | Enter phone number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onFocus={() => speak('फोन नंबर फील्ड फोकस्ड। Phone number field focused')}
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {user.phone || 'प्रदान नहीं किया गया | Not provided'}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                पता | Address
              </label>
              {isEditing ? (
                <textarea
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  placeholder="अपना पता दर्ज करें | Enter your address"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  onFocus={() => speak('पता फील्ड फोकस्ड। Address field focused')}
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {user.address || 'प्रदान नहीं किया गया | Not provided'}
                </p>
              )}
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center space-x-2"
                  ariaDescription="Save profile changes"
                >
                  <Save size={16} />
                  <span>परिवर्तन सेव करें | Save Changes</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      full_name: user.full_name,
                      email: user.email,
                      phone: user.phone || '',
                      address: user.address || ''
                    });
                    speak('प्रोफाइल संपादन रद्द। Profile editing cancelled');
                  }}
                  className="flex-1 flex items-center justify-center space-x-2"
                  ariaDescription="Cancel profile editing"
                >
                  <X size={16} />
                  <span>रद्द करें | Cancel</span>
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">खाता क्रियाएं | Account Actions</h2>
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start"
              ariaDescription="View accessibility preferences"
            >
              पहुंच प्राथमिकताएं | Accessibility Preferences
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start"
              ariaDescription="Privacy settings"
            >
              गोपनीयता सेटिंग्स | Privacy Settings
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start"
              ariaDescription="Help and support"
            >
              सहायता और समर्थन | Help & Support
            </Button>
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="emergency"
                size="lg"
                onClick={onSignOut}
                className="w-full"
                ariaDescription="Sign out of your account"
              >
                साइन आउट | Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>सदस्य बने | Member since {new Date(user.created_at).toLocaleDateString('hi-IN')}</p>
          <p className="mt-1">Saarathi v1.0.0 - भारत के लिए बनाया गया | Made for India</p>
        </motion.div>
      </div>
    </div>
  );
};