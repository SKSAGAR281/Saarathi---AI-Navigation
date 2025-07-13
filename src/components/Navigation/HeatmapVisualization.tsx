import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import { HeatmapData } from '../../types';

interface HeatmapVisualizationProps {
  data: HeatmapData[];
  onSpeak: (text: string) => void;
}

export const HeatmapVisualization: React.FC<HeatmapVisualizationProps> = ({ data, onSpeak }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * canvas.offsetWidth;
      const y = (i / 10) * canvas.offsetHeight;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.offsetHeight);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.offsetWidth, y);
      ctx.stroke();
    }

    // Draw heatmap points
    data.forEach((point, index) => {
      const x = (point.location.longitude + 74.0070) * 10000 % canvas.offsetWidth;
      const y = (point.location.latitude - 40.7120) * 10000 % canvas.offsetHeight;
      const radius = Math.max(10, point.frequency * 5);
      
      // Color based on type
      let color;
      switch (point.type) {
        case 'popular':
          color = `rgba(34, 197, 94, ${Math.min(0.8, point.frequency / 10)})`;
          break;
        case 'blocked':
          color = `rgba(239, 68, 68, ${Math.min(0.8, point.frequency / 10)})`;
          break;
        case 'safe':
          color = `rgba(59, 130, 246, ${Math.min(0.8, point.frequency / 10)})`;
          break;
        default:
          color = `rgba(156, 163, 175, ${Math.min(0.8, point.frequency / 10)})`;
      }
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = point.type === 'popular' ? '#16a34a' : 
                       point.type === 'blocked' ? '#dc2626' : '#2563eb';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [data]);

  const getTypeStats = () => {
    const stats = data.reduce((acc, point) => {
      acc[point.type] = (acc[point.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  };

  const stats = getTypeStats();

  const handleStatClick = (type: string, count: number) => {
    const descriptions = {
      popular: `${count} popular navigation paths identified`,
      blocked: `${count} blocked or difficult areas reported`,
      safe: `${count} verified safe routes available`
    };
    
    onSpeak(descriptions[type as keyof typeof descriptions] || `${count} areas of type ${type}`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Navigation Heatmap</h3>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatClick('popular', stats.popular || 0)}
            className="bg-green-50 border border-green-200 rounded-lg p-4 text-center hover:bg-green-100 transition-colors"
          >
            <TrendingUp className="text-green-600 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-green-700">{stats.popular || 0}</div>
            <div className="text-sm text-green-600">Popular Paths</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatClick('blocked', stats.blocked || 0)}
            className="bg-red-50 border border-red-200 rounded-lg p-4 text-center hover:bg-red-100 transition-colors"
          >
            <AlertTriangle className="text-red-600 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-red-700">{stats.blocked || 0}</div>
            <div className="text-sm text-red-600">Blocked Areas</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStatClick('safe', stats.safe || 0)}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors"
          >
            <Shield className="text-blue-600 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-blue-700">{stats.safe || 0}</div>
            <div className="text-sm text-blue-600">Safe Routes</div>
          </motion.button>
        </div>

        {/* Heatmap Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-64 border border-gray-200 rounded-lg bg-gray-50"
            style={{ width: '100%', height: '256px' }}
          />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <div className="text-sm font-medium text-gray-900 mb-2">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Popular paths</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Blocked areas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Safe routes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Route Analysis</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Most popular routes show high foot traffic and proven accessibility</p>
            <p>• Blocked areas indicate reported obstacles or construction zones</p>
            <p>• Safe routes are verified paths with minimal obstacles</p>
            <p>• Larger circles indicate higher frequency of use or reports</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};