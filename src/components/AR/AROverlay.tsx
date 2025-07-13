import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowLeft, ArrowRight, Navigation } from 'lucide-react';

interface AROverlayProps {
  isActive: boolean;
  direction?: 'straight' | 'left' | 'right';
  distance?: number;
  nextInstruction?: string;
}

export const AROverlay: React.FC<AROverlayProps> = ({
  isActive,
  direction = 'straight',
  distance = 0,
  nextInstruction = 'Continue straight'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFootsteps = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw footstep path
      const centerX = canvas.width / 2;
      const centerY = canvas.height;
      
      for (let i = 0; i < 5; i++) {
        const y = centerY - (i * 80);
        const x = centerX + (direction === 'left' ? -i * 20 : direction === 'right' ? i * 20 : 0);
        
        // Left foot
        ctx.fillStyle = `rgba(59, 130, 246, ${0.8 - i * 0.15})`;
        ctx.fillRect(x - 15, y - 10, 12, 20);
        
        // Right foot
        ctx.fillStyle = `rgba(59, 130, 246, ${0.8 - i * 0.15})`;
        ctx.fillRect(x + 3, y - 5, 12, 20);
      }
    };

    drawFootsteps();
  }, [isActive, direction]);

  if (!isActive) return null;

  const getDirectionIcon = () => {
    switch (direction) {
      case 'left':
        return <ArrowLeft size={48} className="text-blue-500" />;
      case 'right':
        return <ArrowRight size={48} className="text-blue-500" />;
      default:
        return <ArrowUp size={48} className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Camera View Simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent">
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          className="absolute inset-0"
        />
      </div>

      {/* Direction Arrow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg"
        >
          {getDirectionIcon()}
        </motion.div>
      </motion.div>

      {/* Distance and Instruction */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-32 left-4 right-4"
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <Navigation size={20} className="text-blue-400" />
            <span className="text-lg font-semibold">{distance}m ahead</span>
          </div>
          <p className="text-sm text-gray-300">{nextInstruction}</p>
        </div>
      </motion.div>

      {/* Compass */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-8 right-8"
        style={{
          transform: `rotate(${-deviceOrientation.alpha}deg)`
        }}
      >
        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-4 bg-white rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};