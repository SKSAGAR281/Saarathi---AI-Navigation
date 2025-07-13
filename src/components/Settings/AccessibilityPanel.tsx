import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Contrast, Type, Vibrate, Gauge } from 'lucide-react';

interface AccessibilityPanelProps {
  settings: {
    voiceEnabled: boolean;
    highContrast: boolean;
    largeText: boolean;
    hapticFeedback: boolean;
    speechRate: number;
    vibrationPattern: 'light' | 'medium' | 'strong';
  };
  onSettingChange: (key: string, value: any) => void;
  onSpeak: (text: string) => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  settings,
  onSettingChange,
  onSpeak
}) => {
  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onToggle: () => void;
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = ({ enabled, onToggle, label, description, icon }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className="text-gray-600">{icon}</div>
        <div>
          <h4 className="font-medium text-gray-900">{label}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <button
        onClick={() => {
          onToggle();
          onSpeak(`${label} ${!enabled ? 'enabled' : 'disabled'}`);
        }}
        className={`w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-blue-500' : 'bg-gray-300'
        }`}
        aria-label={`${enabled ? 'Disable' : 'Enable'} ${label}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform mt-0.5 ${
          enabled ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
      </button>
    </motion.div>
  );

  const testVibration = (pattern: 'light' | 'medium' | 'strong') => {
    const patterns = {
      light: [100],
      medium: [200, 100, 200],
      strong: [300, 200, 300, 200, 300]
    };
    
    if (navigator.vibrate) {
      navigator.vibrate(patterns[pattern]);
    }
    onSpeak(`${pattern} vibration pattern activated`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Accessibility Settings</h3>
        
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.voiceEnabled}
            onToggle={() => onSettingChange('voiceEnabled', !settings.voiceEnabled)}
            label="Voice Commands"
            description="Enable voice control and audio feedback"
            icon={<Volume2 size={20} />}
          />

          <ToggleSwitch
            enabled={settings.highContrast}
            onToggle={() => onSettingChange('highContrast', !settings.highContrast)}
            label="High Contrast Mode"
            description="Increase color contrast for better visibility"
            icon={<Contrast size={20} />}
          />

          <ToggleSwitch
            enabled={settings.largeText}
            onToggle={() => onSettingChange('largeText', !settings.largeText)}
            label="Large Text"
            description="Increase text size throughout the app"
            icon={<Type size={20} />}
          />

          <ToggleSwitch
            enabled={settings.hapticFeedback}
            onToggle={() => onSettingChange('hapticFeedback', !settings.hapticFeedback)}
            label="Haptic Feedback"
            description="Feel vibrations for button presses and alerts"
            icon={<Vibrate size={20} />}
          />
        </div>
      </motion.div>

      {/* Speech Rate Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Gauge className="text-blue-600" size={24} />
          <h4 className="text-lg font-semibold text-gray-900">Speech Rate</h4>
        </div>
        
        <div className="space-y-4">
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.speechRate}
            onChange={(e) => {
              const rate = parseFloat(e.target.value);
              onSettingChange('speechRate', rate);
              onSpeak(`Speech rate set to ${rate.toFixed(1)}`, { rate });
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Speech rate control"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Slow (0.5x)</span>
            <span>Normal (1.0x)</span>
            <span>Fast (2.0x)</span>
          </div>
          <p className="text-sm text-gray-600">Current: {settings.speechRate.toFixed(1)}x</p>
        </div>
      </motion.div>

      {/* Vibration Pattern Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Vibrate className="text-purple-600" size={24} />
          <h4 className="text-lg font-semibold text-gray-900">Vibration Pattern</h4>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {(['light', 'medium', 'strong'] as const).map((pattern) => (
            <button
              key={pattern}
              onClick={() => {
                onSettingChange('vibrationPattern', pattern);
                testVibration(pattern);
              }}
              className={`p-3 rounded-lg border-2 transition-colors ${
                settings.vibrationPattern === pattern
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-label={`Set ${pattern} vibration pattern`}
            >
              <div className="text-center">
                <div className="font-medium capitalize">{pattern}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {pattern === 'light' && '•'}
                  {pattern === 'medium' && '• • •'}
                  {pattern === 'strong' && '• • • • •'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};