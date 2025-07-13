import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { EmergencyContact } from '../../types';

interface EmergencyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
}

export const EmergencyPanel: React.FC<EmergencyPanelProps> = ({
  isOpen,
  onClose,
  contacts
}) => {
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const defaultContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Emergency Services',
      phone: '911',
      relationship: 'Emergency'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      relationship: 'Primary Contact'
    },
    {
      id: '3',
      name: 'Medical Alert',
      phone: '+1 (555) 987-6543',
      relationship: 'Medical'
    }
  ];

  const allContacts = contacts.length > 0 ? contacts : defaultContacts;

  const handleCall = (contact: EmergencyContact) => {
    // In a real app, this would initiate a phone call
    window.open(`tel:${contact.phone}`);
  };

  const handleSendMessage = async () => {
    if (!selectedContact || !message.trim()) return;
    
    setIsSending(true);
    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSending(false);
    setMessage('');
    setSelectedContact(null);
    
    // Show success feedback
    alert(`Emergency message sent to ${selectedContact.name}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Emergency Assistance</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-red-700 rounded-full transition-colors"
                  aria-label="Close emergency panel"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-red-100 mt-2">Get help immediately</p>
            </div>

            {!selectedContact ? (
              /* Contact List */
              <div className="p-6">
                <div className="space-y-4">
                  {allContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.relationship}</p>
                          <p className="text-sm text-gray-500">{contact.phone}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="emergency"
                            size="sm"
                            onClick={() => handleCall(contact)}
                            ariaDescription={`Call ${contact.name}`}
                          >
                            <Phone size={16} />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedContact(contact)}
                            ariaDescription={`Send message to ${contact.name}`}
                          >
                            <MessageSquare size={16} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Location Sharing */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-blue-600" size={20} />
                    <div>
                      <h4 className="font-medium text-blue-900">Share Location</h4>
                      <p className="text-sm text-blue-700">
                        Your current location will be shared with emergency contacts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Message Composer */
              <div className="p-6">
                <div className="mb-4">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    ← Back to contacts
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Message {selectedContact.name}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedContact.phone}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="emergency-message" className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Message
                    </label>
                    <textarea
                      id="emergency-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="I need assistance. Please help..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="emergency"
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isSending}
                      className="flex-1 flex items-center justify-center space-x-2"
                      ariaDescription="Send emergency message"
                    >
                      {isSending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Send Emergency Message</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Quick Message Templates */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Quick templates:</p>
                    {[
                      'I need immediate assistance',
                      'I am lost and need help',
                      'Medical emergency - please call 911'
                    ].map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setMessage(template)}
                        className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};