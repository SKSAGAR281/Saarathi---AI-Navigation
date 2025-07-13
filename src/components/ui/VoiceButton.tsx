import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  onToggle,
  size = 'md'
}) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isListening ? { scale: [1, 1.1, 1] } : {}}
      transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
      onClick={onToggle}
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center
        ${isListening 
          ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
          : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30'
        }
        text-white transition-all duration-200 focus:outline-none focus:ring-4 
        ${isListening ? 'focus:ring-red-300' : 'focus:ring-blue-300'}
      `}
      aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
      aria-pressed={isListening}
    >
      {isListening ? (
        <MicOff size={iconSizes[size]} />
      ) : (
        <Mic size={iconSizes[size]} />
      )}
    </motion.button>
  );
};