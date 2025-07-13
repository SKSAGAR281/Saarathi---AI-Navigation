import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Printer, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface FloorPlanDownloadProps {
  routeData: {
    startAddress: string;
    endAddress: string;
    distance: number;
    estimatedTime: number;
    waypoints: Array<{ name: string; description: string }>;
  };
  onSpeak: (text: string) => void;
}

export const FloorPlanDownload: React.FC<FloorPlanDownloadProps> = ({ routeData, onSpeak }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    onSpeak('Generating downloadable route plan');

    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple text-based route plan
      const routePlan = `
ACCESSAURA ROUTE PLAN
=====================

Route: ${routeData.startAddress} → ${routeData.endAddress}
Distance: ${routeData.distance.toFixed(1)} km
Estimated Time: ${routeData.estimatedTime} minutes
Generated: ${new Date().toLocaleString()}

WAYPOINTS:
${routeData.waypoints.map((wp, index) => 
  `${index + 1}. ${wp.name}\n   ${wp.description}`
).join('\n\n')}

ACCESSIBILITY NOTES:
• This route has been optimized for accessibility
• Voice guidance available through AccessAura app
• Emergency contacts can be reached via SOS gesture
• Report obstacles using the app to help others

EMERGENCY INFORMATION:
• Triple-tap screen for emergency assistance
• Shake device to trigger SOS alert
• Voice command: "Emergency" for immediate help

For real-time navigation, use the AccessAura mobile app.
Visit: https://accessaura.app

© 2024 AccessAura - AI & AR Navigation for Everyone
      `;

      // Create and download the file
      const blob = new Blob([routePlan], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AccessAura-Route-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onSpeak('Route plan downloaded successfully. Check your downloads folder.');
    } catch (error) {
      onSpeak('Error generating route plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const printRoute = () => {
    onSpeak('Opening print dialog for route plan');
    
    const printContent = `
      <html>
        <head>
          <title>AccessAura Route Plan</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #1f2937; margin-top: 30px; }
            .route-info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .waypoint { margin: 15px 0; padding: 10px; border-left: 4px solid #10b981; }
            .emergency { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>AccessAura Route Plan</h1>
          
          <div class="route-info">
            <h2>Route Information</h2>
            <p><strong>From:</strong> ${routeData.startAddress}</p>
            <p><strong>To:</strong> ${routeData.endAddress}</p>
            <p><strong>Distance:</strong> ${routeData.distance.toFixed(1)} km</p>
            <p><strong>Estimated Time:</strong> ${routeData.estimatedTime} minutes</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <h2>Waypoints</h2>
          ${routeData.waypoints.map((wp, index) => `
            <div class="waypoint">
              <strong>${index + 1}. ${wp.name}</strong><br>
              ${wp.description}
            </div>
          `).join('')}

          <div class="emergency">
            <h2>Emergency Information</h2>
            <ul>
              <li>Triple-tap screen for emergency assistance</li>
              <li>Shake device to trigger SOS alert</li>
              <li>Voice command: "Emergency" for immediate help</li>
            </ul>
          </div>

          <p><em>For real-time navigation, use the AccessAura mobile app.</em></p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const shareRoute = async () => {
    onSpeak('Sharing route plan');
    
    const shareData = {
      title: 'AccessAura Route Plan',
      text: `Route from ${routeData.startAddress} to ${routeData.endAddress} (${routeData.distance.toFixed(1)} km)`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onSpeak('Route shared successfully');
      } catch (error) {
        onSpeak('Sharing cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(shareText).then(() => {
        onSpeak('Route details copied to clipboard');
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500"
    >
      <div className="flex items-center space-x-3 mb-4">
        <FileText className="text-green-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Route Documentation</h3>
      </div>

      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-green-900 mb-2">Current Route</h4>
        <div className="text-sm text-green-800 space-y-1">
          <p><strong>From:</strong> {routeData.startAddress}</p>
          <p><strong>To:</strong> {routeData.endAddress}</p>
          <p><strong>Distance:</strong> {routeData.distance.toFixed(1)} km</p>
          <p><strong>Time:</strong> {routeData.estimatedTime} minutes</p>
          <p><strong>Waypoints:</strong> {routeData.waypoints.length} stops</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="primary"
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
          ariaDescription="Download route plan as text file"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={16} />
          )}
          <span>{isGenerating ? 'Generating...' : 'Download'}</span>
        </Button>

        <Button
          variant="secondary"
          onClick={printRoute}
          className="flex items-center justify-center space-x-2"
          ariaDescription="Print route plan"
        >
          <Printer size={16} />
          <span>Print</span>
        </Button>

        <Button
          variant="ghost"
          onClick={shareRoute}
          className="flex items-center justify-center space-x-2"
          ariaDescription="Share route plan"
        >
          <Share2 size={16} />
          <span>Share</span>
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Offline Access</h4>
        <p className="text-sm text-blue-800">
          Download or print your route plan for offline reference. The plan includes all waypoints, 
          accessibility notes, and emergency information for safe navigation without internet access.
        </p>
      </div>
    </motion.div>
  );
};