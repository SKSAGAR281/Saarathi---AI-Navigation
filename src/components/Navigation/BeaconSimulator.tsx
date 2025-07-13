import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, MapPin, Volume2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { BeaconPoint } from '../../types';

interface BeaconSimulatorProps {
  onSpeak: (text: string) => void;
  onBeaconTap: (beacon: BeaconPoint) => void;
}

export const BeaconSimulator: React.FC<BeaconSimulatorProps> = ({ onSpeak, onBeaconTap }) => {
  const [nearbyBeacons, setNearbyBeacons] = useState<BeaconPoint[]>([
    {
      id: 'beacon-1',
      location: { latitude: 40.7128, longitude: -74.0060 },
      name: 'Main Entrance',
      description: 'Building main entrance with automatic doors',
      audio_cue: 'You have reached the main entrance. Automatic doors ahead.'
    },
    {
      id: 'beacon-2',
      location: { latitude: 40.7129, longitude: -74.0061 },
      name: 'Elevator Bank',
      description: 'Elevator bank - floors 1 through 10',
      audio_cue: 'Elevator bank on your right. Press the up button to call elevator.'
    },
    {
      id: 'beacon-3',
      location: { latitude: 40.7130, longitude: -74.0062 },
      name: 'Information Desk',
      description: 'Information and assistance desk',
      audio_cue: 'Information desk ahead. Staff available for assistance.'
    }
  ]);

  const [tappedBeacons, setTappedBeacons] = useState<Set<string>>(new Set());

  const handleBeaconTap = (beacon: BeaconPoint) => {
    setTappedBeacons(prev => new Set([...prev, beacon.id]));
    onBeaconTap(beacon);
    onSpeak(beacon.audio_cue);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const getDistanceToBeacon = (beacon: BeaconPoint) => {
    // Simulate distance calculation
    return Math.random() * 10 + 1;
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Wifi className="text-purple-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">SmartTouch Beacons</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Tap on nearby beacons to get location-specific audio guidance and navigation assistance.
        </p>

        <div className="space-y-3">
          {nearbyBeacons.map((beacon) => {
            const distance = getDistanceToBeacon(beacon);
            const isTapped = tappedBeacons.has(beacon.id);
            
            return (
              <motion.div
                key={beacon.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isTapped 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin size={16} className={isTapped ? 'text-green-600' : 'text-purple-600'} />
                      <span className="font-medium text-gray-900">{beacon.name}</span>
                      {isTapped && <CheckCircle size={16} className="text-green-600" />}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{beacon.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{distance.toFixed(1)}m away</span>
                      <span className={`px-2 py-1 rounded-full ${
                        distance < 3 ? 'bg-green-100 text-green-800' :
                        distance < 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {distance < 3 ? 'Very Close' : distance < 6 ? 'Nearby' : 'In Range'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant={isTapped ? "secondary" : "primary"}
                      size="sm"
                      onClick={() => handleBeaconTap(beacon)}
                      disabled={isTapped}
                      ariaDescription={`Tap ${beacon.name} beacon`}
                      className="flex items-center space-x-1"
                    >
                      <Wifi size={14} />
                      <span>{isTapped ? 'Tapped' : 'Tap'}</span>
                    </Button>
                    
                    <button
                      onClick={() => onSpeak(beacon.audio_cue)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      aria-label={`Play audio cue for ${beacon.name}`}
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
                
                {isTapped && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-green-200"
                  >
                    <div className="bg-green-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Volume2 size={14} className="text-green-600" />
                        <span className="text-sm font-medium text-green-800">Audio Guidance</span>
                      </div>
                      <p className="text-sm text-green-700">{beacon.audio_cue}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Beacon Status */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-purple-900">Beacon Network Status</h4>
              <p className="text-sm text-purple-700">
                {nearbyBeacons.length} beacons detected • {tappedBeacons.size} tapped
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-purple-700">Connected</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};