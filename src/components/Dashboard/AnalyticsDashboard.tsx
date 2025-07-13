import React, { useState, useEffect } from 'react';
import { BarChart3, MapPin, Clock, Shield, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  totalSessions: number;
  totalDistance: number;
  avgSessionTime: number;
  obstaclesDetected: number;
  emergencyCalls: number;
  weeklyUsage: number[];
}

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalSessions: 0,
    totalDistance: 0,
    avgSessionTime: 0,
    obstaclesDetected: 0,
    emergencyCalls: 0,
    weeklyUsage: [0, 0, 0, 0, 0, 0, 0]
  });

  // Mock analytics data
  useEffect(() => {
    setTimeout(() => {
      setData({
        totalSessions: 47,
        totalDistance: 23.7,
        avgSessionTime: 18,
        obstaclesDetected: 142,
        emergencyCalls: 2,
        weeklyUsage: [3, 7, 5, 8, 6, 4, 9]
      });
    }, 500);
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    description: string;
  }> = ({ title, value, icon, color, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          {React.cloneElement(icon as React.ReactElement, { 
            size: 24, 
            style: { color } 
          })}
        </div>
      </div>
    </motion.div>
  );

  const WeeklyChart: React.FC = () => {
    const maxValue = Math.max(...data.weeklyUsage);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="text-blue-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Weekly Navigation Sessions</h3>
        </div>
        <div className="flex items-end space-x-2 h-40">
          {data.weeklyUsage.map((value, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${(value / maxValue) * 100}%` }}
              transition={{ delay: index * 0.1 }}
              className="flex-1 bg-blue-500 rounded-t-md min-h-[4px] flex flex-col justify-end"
            >
              <div className="text-center text-xs text-white font-medium mb-1">
                {value}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-xs text-gray-600">
          {days.map(day => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Navigation Analytics</h1>
          <p className="text-gray-600">Track your navigation patterns and safety metrics</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Sessions"
            value={data.totalSessions}
            icon={<MapPin />}
            color="#2563EB"
            description="Navigation sessions completed"
          />
          <StatCard
            title="Distance Traveled"
            value={`${data.totalDistance} km`}
            icon={<TrendingUp />}
            color="#10B981"
            description="Total distance navigated"
          />
          <StatCard
            title="Avg Session Time"
            value={`${data.avgSessionTime} min`}
            icon={<Clock />}
            color="#F59E0B"
            description="Average navigation duration"
          />
          <StatCard
            title="Obstacles Detected"
            value={data.obstaclesDetected}
            icon={<Shield />}
            color="#8B5CF6"
            description="Safety alerts provided"
          />
          <StatCard
            title="Emergency Calls"
            value={data.emergencyCalls}
            icon={<Users />}
            color="#EF4444"
            description="Emergency contacts reached"
          />
          <StatCard
            title="Success Rate"
            value="96%"
            icon={<BarChart3 />}
            color="#06B6D4"
            description="Successful navigations"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyChart />
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { time: '2 hours ago', action: 'Completed navigation to Central Park', status: 'success' },
                { time: '1 day ago', action: 'Emergency contact reached', status: 'warning' },
                { time: '2 days ago', action: 'Navigation to Coffee Shop', status: 'success' },
                { time: '3 days ago', action: 'Obstacle detection: construction area', status: 'info' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};