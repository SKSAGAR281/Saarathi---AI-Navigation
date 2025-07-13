import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navigation, MapPin, Shield, Eye, Volume2, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceButton } from '../ui/VoiceButton';
import { Button } from '../ui/Button';
import { useVoice } from '../../hooks/useVoice';
import { useGeolocation } from '../../hooks/useGeolocation';
import { DetectedObject, VoiceCommand } from '../../types';

interface NavigationInterfaceProps {
  onEmergency: () => void;
}

export const NavigationInterface: React.FC<NavigationInterfaceProps> = ({ onEmergency }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [isListeningForStart, setIsListeningForStart] = useState(false);
  const [isListeningForEnd, setIsListeningForEnd] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [isGettingLiveLocation, setIsGettingLiveLocation] = useState(false);
  const { location } = useGeolocation();

  // Indian cities for demo
  const indianCities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik'
  ];

  const handleStartNavigationCallback = useCallback(() => {
    if (!startLocation.trim() || !endLocation.trim()) {
      speak('कृपया पहले शुरुआती और अंतिम स्थान सेट करें। Please set both start and end locations first');
      return;
    }
    setIsNavigating(true);
    speak(`नेवीगेशन शुरू हो गया। ${startLocation} से ${endLocation} तक। Navigation started from ${startLocation} to ${endLocation}. Walking mode activated.`);
  }, [startLocation, endLocation]);

  const handleStopNavigationCallback = useCallback(() => {
    setIsNavigating(false);
    speak('नेवीगेशन बंद कर दिया गया। Navigation stopped.');
  }, []);

  const handleWhereAmICallback = useCallback(() => {
    const locationText = location?.address || 'नई दिल्ली, भारत। New Delhi, India';
    speak(`आप यहाँ हैं: ${locationText}. You are at: ${locationText}`);
  }, [location?.address]);

  const handleWhatDoYouSeeCallback = useCallback(() => {
    if (detectedObjects.length > 0) {
      const description = detectedObjects
        .map(obj => `${obj.description} ${obj.distance.toFixed(1)} मीटर दूर ${obj.direction || ''} में`)
        .join(', ');
      speak(`मैं देख सकता हूँ: ${description}. I can see: ${description}`);
    } else {
      speak('आपके रास्ते में कोई बाधा नहीं दिख रही। No obstacles detected in your path');
    }
  }, [detectedObjects]);

  const handleSetStartLocationCallback = useCallback(() => {
    setIsListeningForStart(true);
    speak('कृपया अपना शुरुआती स्थान बोलें। Please speak your start location');
    
    // Simulate voice recognition for start location
    setTimeout(() => {
      const randomCity = indianCities[Math.floor(Math.random() * indianCities.length)];
      setStartLocation(randomCity);
      setIsListeningForStart(false);
      speak(`शुरुआती स्थान सेट किया गया: ${randomCity}. Start location set to: ${randomCity}`);
    }, 3000);
  }, []);

  const handleUseLiveLocationCallback = useCallback(() => {
    setIsGettingLiveLocation(true);
    speak('लाइव लोकेशन प्राप्त कर रहे हैं। Getting live location');
    
    // Simulate getting live location
    setTimeout(() => {
      const currentLocationText = location?.address || 'नई दिल्ली, भारत। New Delhi, India';
      setStartLocation(currentLocationText);
      setIsGettingLiveLocation(false);
      speak(`लाइव लोकेशन सेट की गई: ${currentLocationText}. Live location set to: ${currentLocationText}`);
    }, 2000);
  }, [location]);

  const handleSetEndLocationCallback = useCallback(() => {
    setIsListeningForEnd(true);
    speak('कृपया अपना गंतव्य स्थान बोलें। Please speak your destination');
    
    // Simulate voice recognition for end location
    setTimeout(() => {
      const randomCity = indianCities[Math.floor(Math.random() * indianCities.length)];
      setEndLocation(randomCity);
      setIsListeningForEnd(false);
      speak(`गंतव्य स्थान सेट किया गया: ${randomCity}. Destination set to: ${randomCity}`);
    }, 3000);
  }, []);

  // Mock object detection with Hindi audio announcements
  useEffect(() => {
    if (isNavigating) {
      const interval = setInterval(() => {
        const mockObjects: DetectedObject[] = [];
        
        // Randomly generate obstacles with Indian context
        if (Math.random() > 0.6) {
          const obstacles = [
            { desc: 'सामने कुर्सी है। Chair ahead', dir: 'center' },
            { desc: 'बाईं ओर व्यक्ति चल रहा है। Person walking left', dir: 'left' },
            { desc: 'दाईं ओर दरवाजा है। Doorway on right', dir: 'right' },
            { desc: 'सामने मेज है। Table ahead', dir: 'center' },
            { desc: 'दाईं ओर दीवार है। Wall on right', dir: 'right' },
            { desc: 'सामने सीढ़ियाँ हैं। Steps ahead', dir: 'center' },
            { desc: 'बाईं ओर ऑटो रिक्शा है। Auto rickshaw on left', dir: 'left' },
            { desc: 'सामने गड्ढा है। Pothole ahead', dir: 'center' }
          ];
          
          const obstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
          const distance = Math.random() * 8 + 2;
          
          mockObjects.push({
            id: `obj-${Date.now()}`,
            type: Math.random() > 0.7 ? 'obstacle' : 'landmark',
            confidence: 0.85 + Math.random() * 0.15,
            position: { x: Math.random() * 100, y: Math.random() * 100 },
            distance: distance,
            description: obstacle.desc,
            direction: obstacle.dir as 'left' | 'right' | 'center'
          });

          // Announce obstacle detection in Hindi and English
          speak(`${obstacle.desc} ${distance.toFixed(1)} मीटर दूर ${obstacle.dir} में। ${distance.toFixed(1)} meters ${obstacle.dir}`);
        }
        
        setDetectedObjects(mockObjects);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isNavigating]);

  const voiceCommands: VoiceCommand[] = useMemo(() => [
    {
      command: 'start navigation',
      action: handleStartNavigationCallback,
      description: 'Start navigation'
    },
    {
      command: 'नेवीगेशन शुरू करें',
      action: handleStartNavigationCallback,
      description: 'Start navigation in Hindi'
    },
    {
      command: 'stop navigation',
      action: handleStopNavigationCallback,
      description: 'Stop navigation'
    },
    {
      command: 'नेवीगेशन बंद करें',
      action: handleStopNavigationCallback,
      description: 'Stop navigation in Hindi'
    },
    {
      command: 'where am i',
      action: handleWhereAmICallback,
      description: 'Current location'
    },
    {
      command: 'मैं कहाँ हूँ',
      action: handleWhereAmICallback,
      description: 'Current location in Hindi'
    },
    {
      command: 'emergency',
      action: onEmergency,
      description: 'Emergency assistance'
    },
    {
      command: 'आपातकाल',
      action: onEmergency,
      description: 'Emergency assistance in Hindi'
    },
    {
      command: 'what do you see',
      action: handleWhatDoYouSeeCallback,
      description: 'Describe surroundings'
    },
    {
      command: 'आप क्या देख रहे हैं',
      action: handleWhatDoYouSeeCallback,
      description: 'Describe surroundings in Hindi'
    },
    {
      command: 'set start location',
      action: handleSetStartLocationCallback,
      description: 'Set starting point'
    },
    {
      command: 'शुरुआती स्थान सेट करें',
      action: handleSetStartLocationCallback,
      description: 'Set starting point in Hindi'
    },
    {
      command: 'set end location',
      action: handleSetEndLocationCallback,
      description: 'Set destination'
    },
    {
      command: 'अंतिम स्थान सेट करें',
      action: handleSetEndLocationCallback,
      description: 'Set destination in Hindi'
    },
    {
      command: 'use live location',
      action: handleUseLiveLocationCallback,
      description: 'Use current live location as start'
    },
    {
      command: 'लाइव लोकेशन का उपयोग करें',
      action: handleUseLiveLocationCallback,
      description: 'Use live location in Hindi'
    }
  ], [handleStartNavigationCallback, handleStopNavigationCallback, handleWhereAmICallback, onEmergency, handleWhatDoYouSeeCallback, handleSetStartLocationCallback, handleSetEndLocationCallback]);

  const { isListening, startListening, stopListening, speak, isSupported } = useVoice(voiceCommands);

  // Auto-start voice assistant when component loads
  useEffect(() => {
    if (isSupported) {
      setTimeout(() => {
        startListening();
        speak('Saarathi नेवीगेशन असिस्टेंट तैयार है। Saarathi navigation assistant ready. Say set start location and set end location to begin.');
      }, 1000);
    }
  }, [isSupported, startListening, speak]);

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleStartNavigation = () => {
    if (!startLocation.trim() || !endLocation.trim()) {
      speak('कृपया पहले दोनों स्थान भरें। Please enter both start and end locations first');
      return;
    }
    setIsNavigating(true);
    speak(`नेवीगेशन शुरू हो गया। ${startLocation} से ${endLocation} तक। मैं आपको ऑडियो संकेतों से मार्गदर्शन करूंगा। Navigation started from ${startLocation} to ${endLocation}. I'll guide you with audio cues.`);
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    speak('नेवीगेशन बंद कर दिया गया। आप पहुंच गए हैं या नेवीगेशन रद्द कर दिया गया। Navigation stopped. You have arrived or navigation was cancelled.');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white">
      {/* Status Bar */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isNavigating ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="font-medium text-gray-700">
              {isNavigating ? 'नेवीगेट कर रहे हैं | Navigating' : 'तैयार | Ready'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {isSupported && (
              <VoiceButton
                isListening={isListening}
                onToggle={handleToggleVoice}
                size="sm"
              />
            )}
            <Button
              variant="emergency"
              size="sm"
              onClick={onEmergency}
              ariaDescription="Call emergency contacts"
            >
              <Shield size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Location Inputs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="startLocation" className="block text-lg font-semibold text-gray-700">
              शुरुआती स्थान | Start Location
            </label>
            <div className="flex space-x-2">
              <input
                id="startLocation"
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="शुरुआती स्थान दर्ज करें | Enter starting point"
                className="flex-1 p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                aria-describedby="start-help"
              />
              <button
                onClick={handleUseLiveLocationCallback}
                disabled={isGettingLiveLocation}
                className={`p-3 rounded-lg transition-colors ${
                  isGettingLiveLocation 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                aria-label="Use live location as start"
                title="Use Live Location"
              >
                <MapPin size={20} />
              </button>
              <button
                onClick={handleSetStartLocationCallback}
                disabled={isListeningForStart}
                className={`p-3 rounded-lg transition-colors ${
                  isListeningForStart 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                aria-label="Voice input for start location"
              >
                <Mic size={20} />
              </button>
            </div>
            {isListeningForStart && (
              <p className="text-sm text-blue-600">🎤 शुरुआती स्थान सुन रहे हैं... | Listening for start location...</p>
            )}
            {isGettingLiveLocation && (
              <p className="text-sm text-green-600">📍 लाइव लोकेशन प्राप्त कर रहे हैं... | Getting live location...</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="endLocation" className="block text-lg font-semibold text-gray-700">
              गंतव्य स्थान | End Location
            </label>
            <div className="flex space-x-2">
              <input
                id="endLocation"
                type="text"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                placeholder="गंतव्य स्थान दर्ज करें | Enter destination"
                className="flex-1 p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                aria-describedby="end-help"
              />
              <button
                onClick={handleSetEndLocationCallback}
                disabled={isListeningForEnd}
                className={`p-3 rounded-lg transition-colors ${
                  isListeningForEnd 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                aria-label="Voice input for end location"
              >
                <Mic size={20} />
              </button>
            </div>
            {isListeningForEnd && (
              <p className="text-sm text-green-600">🎤 गंतव्य स्थान सुन रहे हैं... | Listening for destination...</p>
            )}
          </div>

          <p className="text-sm text-gray-600">
            वॉयस कमांड का उपयोग करें: "शुरुआती स्थान सेट करें" या "अंतिम स्थान सेट करें" | 
            Use voice commands: "Set start location", "Use live location" or "Set end location"
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="grid grid-cols-1 gap-4">
          {!isNavigating ? (
            <Button
              variant="primary"
              size="xl"
              onClick={handleStartNavigation}
              disabled={!startLocation.trim() || !endLocation.trim()}
              ariaDescription="Begin navigation to destination"
              className="flex items-center justify-center space-x-3"
            >
              <Navigation size={24} />
              <span>नेवीगेशन शुरू करें | Start Navigation</span>
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="xl"
              onClick={handleStopNavigation}
              ariaDescription="Stop current navigation"
              className="flex items-center justify-center space-x-3"
            >
              <MapPin size={24} />
              <span>नेवीगेशन बंद करें | Stop Navigation</span>
            </Button>
          )}
        </div>

        {/* Live Detection Feed */}
        <AnimatePresence>
          {isNavigating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="text-blue-600" size={24} />
                <h3 className="text-lg font-semibold text-gray-800">
                  लाइव पर्यावरण का पता लगाना | Live Environment Detection
                </h3>
              </div>
              
              {detectedObjects.length > 0 ? (
                <div className="space-y-3">
                  {detectedObjects.map((obj) => (
                    <motion.div
                      key={obj.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{obj.description}</p>
                        <p className="text-sm text-gray-600">
                          {obj.distance.toFixed(1)}m दूर | away • {obj.direction} • {(obj.confidence * 100).toFixed(0)}% विश्वसनीयता | confidence
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        obj.type === 'obstacle' ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>रास्ता साफ है - कोई बाधा नहीं मिली | Path is clear - no obstacles detected</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Commands Help */}
        {isSupported && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <Volume2 className="text-blue-600" size={20} />
              <h4 className="font-semibold text-blue-800">वॉयस कमांड | Voice Commands</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-700">
              <div>"नेवीगेशन शुरू करें" | "Start navigation"</div>
              <div>"नेवीगेशन बंद करें" | "Stop navigation"</div>
              <div>"शुरुआती स्थान सेट करें" | "Set start location"</div>
              <div>"लाइव लोकेशन का उपयोग करें" | "Use live location"</div>
              <div>"अंतिम स्थान सेट करें" | "Set end location"</div>
              <div>"मैं कहाँ हूँ" | "Where am I"</div>
              <div>"आप क्या देख रहे हैं" | "What do you see"</div>
              <div>"आपातकाल" | "Emergency"</div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Control Center */}
      {isSupported && (
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex flex-col items-center space-y-3">
            <VoiceButton
              isListening={isListening}
              onToggle={handleToggleVoice}
              size="lg"
            />
            <p className="text-sm text-gray-600 text-center">
              {isListening ? 'कमांड सुन रहे हैं... | Listening for commands...' : 'वॉयस कमांड सक्रिय करने के लिए टैप करें | Tap to activate voice commands'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};