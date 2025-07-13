import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, MapPin, Navigation } from 'lucide-react';
import { NavigationSession } from '../../types';

interface RouteReplayProps {
  sessions: NavigationSession[];
  onSpeak: (text: string) => void;
}

export const RouteReplay: React.FC<RouteReplayProps> = ({ sessions, onSpeak }) => {
  const [selectedSession, setSelectedSession] = useState<NavigationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);

  const handlePlaySession = (session: NavigationSession) => {
    setSelectedSession(session);
    setCurrentPointIndex(0);
    setIsPlaying(true);
    onSpeak(`Playing route replay from ${session.start_location.address} to ${session.end_location.address}`);
  };

  const handlePause = () => {
    setIsPlaying(false);
    onSpeak('Route replay paused');
  };

  const handleResume = () => {
    setIsPlaying(true);
    onSpeak('Route replay resumed');
  };

  const handleRestart = () => {
    setCurrentPointIndex(0);
    setIsPlaying(true);
    onSpeak('Route replay restarted');
  };

  // Simulate route playback
  React.useEffect(() => {
    if (isPlaying && selectedSession && currentPointIndex < selectedSession.route_points.length - 1) {
      const timer = setTimeout(() => {
        setCurrentPointIndex(prev => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isPlaying && selectedSession && currentPointIndex >= selectedSession.route_points.length - 1) {
      setIsPlaying(false);
      onSpeak('Route replay completed');
    }
  }, [isPlaying, selectedSession, currentPointIndex, onSpeak]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Route History</h3>
        
        <div className="space-y-4">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin size={16} className="text-blue-600" />
                    <span className="font-medium text-gray-900">
                      {session.start_location.address} → {session.end_location.address}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{formatDate(session.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Navigation size={14} />
                      <span>{formatDuration(session.duration)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{session.distance.toFixed(1)} km</span>
                    <span>{session.obstacles_detected} obstacles detected</span>
                    <span className={`px-2 py-1 rounded-full ${
                      session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.completed ? 'Completed' : 'Incomplete'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handlePlaySession(session)}
                  className="ml-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  aria-label={`Replay route from ${session.start_location.address}`}
                >
                  <Play size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Route Replay Player */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Route Replay</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRestart}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Restart replay"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={isPlaying ? handlePause : handleResume}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  aria-label={isPlaying ? 'Pause replay' : 'Resume replay'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{currentPointIndex + 1} / {selectedSession.route_points.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${((currentPointIndex + 1) / selectedSession.route_points.length) * 100}%` 
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Current Position */}
            {selectedSession.route_points[currentPointIndex] && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin size={16} className="text-blue-600" />
                  <span className="font-medium text-blue-900">Current Position</span>
                </div>
                <div className="text-sm text-blue-800">
                  <div>Lat: {selectedSession.route_points[currentPointIndex].latitude.toFixed(6)}</div>
                  <div>Lng: {selectedSession.route_points[currentPointIndex].longitude.toFixed(6)}</div>
                  <div>Time: {new Date(selectedSession.route_points[currentPointIndex].timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            )}

            {/* Route Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{selectedSession.distance.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">km traveled</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{formatDuration(selectedSession.duration)}</div>
                  <div className="text-sm text-gray-600">duration</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{selectedSession.obstacles_detected}</div>
                  <div className="text-sm text-gray-600">obstacles</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};