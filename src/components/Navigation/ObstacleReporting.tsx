import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Send, MapPin, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { ObstacleReport, Location } from '../../types';

interface ObstacleReportingProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: Location | null;
  onSubmitReport: (report: Omit<ObstacleReport, 'id' | 'created_at'>) => void;
  onSpeak: (text: string) => void;
}

export const ObstacleReporting: React.FC<ObstacleReportingProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSubmitReport,
  onSpeak
}) => {
  const [obstacleType, setObstacleType] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const obstacleTypes = [
    'Construction Work',
    'Fallen Tree',
    'Broken Sidewalk',
    'Parked Vehicle',
    'Street Vendor',
    'Wet Floor',
    'Stairs/Steps',
    'Low Hanging Branch',
    'Other'
  ];

  const handleSubmit = async () => {
    if (!obstacleType || !description || !currentLocation) {
      onSpeak('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    onSpeak('Submitting obstacle report');

    try {
      const report: Omit<ObstacleReport, 'id' | 'created_at'> = {
        location: currentLocation,
        type: obstacleType,
        description,
        severity,
        reported_by: 'current_user'
      };

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      onSubmitReport(report);
      
      onSpeak('Obstacle report submitted successfully. Thank you for helping the community.');
      
      // Reset form
      setObstacleType('');
      setDescription('');
      setSeverity('medium');
      onClose();
    } catch (error) {
      onSpeak('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeSelect = (type: string) => {
    setObstacleType(type);
    onSpeak(`Selected ${type}`);
  };

  const handleSeveritySelect = (level: 'low' | 'medium' | 'high') => {
    setSeverity(level);
    onSpeak(`Severity set to ${level}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-orange-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle size={24} />
                  <h2 className="text-xl font-bold">Report Obstacle</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-orange-700 rounded-full transition-colors"
                  aria-label="Close obstacle reporting"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-orange-100 mt-2">Help others navigate safely</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Location */}
              {currentLocation && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="text-blue-600" size={16} />
                    <span className="font-medium text-blue-900">Current Location</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    {currentLocation.address || `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`}
                  </p>
                </div>
              )}

              {/* Obstacle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type of Obstacle *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {obstacleTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className={`p-3 text-sm rounded-lg border-2 transition-colors ${
                        obstacleType === type
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-label={`Select ${type} as obstacle type`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Severity Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { level: 'low' as const, label: 'Low', color: 'green', description: 'Minor inconvenience' },
                    { level: 'medium' as const, label: 'Medium', color: 'yellow', description: 'Moderate difficulty' },
                    { level: 'high' as const, label: 'High', color: 'red', description: 'Major hazard' }
                  ].map(({ level, label, color, description }) => (
                    <button
                      key={level}
                      onClick={() => handleSeveritySelect(level)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        severity === level
                          ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-label={`Set severity to ${label}`}
                    >
                      <div className="text-center">
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-gray-500 mt-1">{description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the obstacle and its location in detail..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  onFocus={() => onSpeak('Description field focused')}
                />
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!obstacleType || !description || isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700"
                ariaDescription="Submit obstacle report"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Report</span>
                  </>
                )}
              </Button>

              {/* Help Text */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 text-center">
                  Your report helps other users navigate safely. Thank you for contributing to the community!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};