import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Eye, Volume2, Vibrate, Contrast } from 'lucide-react';
import { Button } from '../ui/Button';

interface OnboardingFlowProps {
  onComplete: (preferences: AccessibilityPreferences) => void;
}

interface AccessibilityPreferences {
  voiceEnabled: boolean;
  highContrast: boolean;
  largeText: boolean;
  hapticFeedback: boolean;
}

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to AccessAura',
    description: 'Your AI-powered navigation companion designed for independence and safety.',
    icon: <Eye size={48} />,
  },
  {
    id: 'voice',
    title: 'Voice Navigation',
    description: 'Enable voice commands and audio feedback for hands-free navigation.',
    icon: <Volume2 size={48} />,
  },
  {
    id: 'accessibility',
    title: 'Accessibility Options',
    description: 'Customize the interface to match your preferences and needs.',
    icon: <Contrast size={48} />,
  },
  {
    id: 'safety',
    title: 'Safety Features',
    description: 'Set up emergency contacts and safety features for peace of mind.',
    icon: <Check size={48} />,
  },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    voiceEnabled: true,
    highContrast: false,
    largeText: false,
    hapticFeedback: true,
  });

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePreferenceChange = (key: keyof AccessibilityPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl mx-auto flex items-center justify-center text-white"
            >
              {step.icon}
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">{step.description}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">What makes AccessAura special?</h3>
              <ul className="text-sm text-blue-800 space-y-2 text-left">
                <li>• AI-powered object detection and avoidance</li>
                <li>• Voice-first navigation interface</li>
                <li>• Real-time safety alerts and guidance</li>
                <li>• Emergency assistance features</li>
                <li>• Fully accessible and customizable</li>
              </ul>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl mx-auto flex items-center justify-center text-green-600 mb-4">
                {step.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Enable Voice Commands</h4>
                  <p className="text-sm text-gray-600">Navigate using voice commands</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('voiceEnabled', !preferences.voiceEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.voiceEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  aria-label={`${preferences.voiceEnabled ? 'Disable' : 'Enable'} voice commands`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    preferences.voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {preferences.voiceEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-green-50 p-4 rounded-lg border border-green-200"
                >
                  <h4 className="font-medium text-green-900 mb-2">Voice Commands You Can Use:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-green-800">
                    <div>"Start navigation"</div>
                    <div>"Where am I?"</div>
                    <div>"What do you see?"</div>
                    <div>"Emergency help"</div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl mx-auto flex items-center justify-center text-purple-600 mb-4">
                {step.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Contrast size={20} className="text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">High Contrast Mode</h4>
                    <p className="text-sm text-gray-600">Improve visibility with high contrast colors</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePreferenceChange('highContrast', !preferences.highContrast)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.highContrast ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                  aria-label={`${preferences.highContrast ? 'Disable' : 'Enable'} high contrast mode`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    preferences.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye size={20} className="text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Large Text</h4>
                    <p className="text-sm text-gray-600">Increase text size for better readability</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePreferenceChange('largeText', !preferences.largeText)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.largeText ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                  aria-label={`${preferences.largeText ? 'Disable' : 'Enable'} large text`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    preferences.largeText ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Vibrate size={20} className="text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Haptic Feedback</h4>
                    <p className="text-sm text-gray-600">Feel vibrations for button presses and alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePreferenceChange('hapticFeedback', !preferences.hapticFeedback)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.hapticFeedback ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                  aria-label={`${preferences.hapticFeedback ? 'Disable' : 'Enable'} haptic feedback`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    preferences.hapticFeedback ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'safety':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-2xl mx-auto flex items-center justify-center text-green-600 mb-4">
              {step.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-left">
              <h3 className="font-semibold text-green-900 mb-3">Safety Features Included:</h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• One-tap emergency contact system</li>
                <li>• Automatic location sharing during emergencies</li>
                <li>• Real-time obstacle and hazard detection</li>
                <li>• Safe route recommendations</li>
                <li>• 24/7 emergency assistance access</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                You can set up emergency contacts and customize safety settings after completing onboarding.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
            <span>{Math.round((currentStep + 1) / onboardingSteps.length * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep + 1) / onboardingSteps.length * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
            ariaDescription="Go to previous step"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            className="flex items-center space-x-2"
            ariaDescription={currentStep === onboardingSteps.length - 1 ? 'Complete onboarding' : 'Go to next step'}
          >
            <span>{currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};