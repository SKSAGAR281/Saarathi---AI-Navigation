import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Plus, Trash2, Edit3, Save, X, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmergencyContact } from '../../types';
import { useVoice } from '../../hooks/useVoice';

interface EmergencyPageProps {
  contacts: EmergencyContact[];
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ contacts, onUpdateContacts }) => {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [editContact, setEditContact] = useState({ name: '', phone: '', relationship: '' });

  // Voice commands for emergency page
  const voiceCommands = [
    {
      command: 'add contact',
      action: () => {
        setIsAddingContact(true);
        speak('Adding new emergency contact. Please fill in the details.');
      },
      description: 'Add new emergency contact'
    },
    {
      command: 'call first contact',
      action: () => {
        if (contacts.length > 0) {
          handleCall(contacts[0]);
        } else {
          speak('No emergency contacts available');
        }
      },
      description: 'Call first emergency contact'
    },
    {
      command: 'call emergency',
      action: () => {
        const emergencyContact = contacts.find(c => c.phone === '911' || c.relationship.toLowerCase() === 'emergency');
        if (emergencyContact) {
          handleCall(emergencyContact);
        } else {
          // Call 911 directly
          window.open('tel:911');
          speak('Calling emergency services');
        }
      },
      description: 'Call emergency services'
    },
    {
      command: 'save contact',
      action: () => {
        if (isAddingContact) {
          handleSaveNewContact();
        } else if (editingContact) {
          handleSaveEdit();
        }
      },
      description: 'Save current contact'
    },
    {
      command: 'cancel',
      action: () => {
        setIsAddingContact(false);
        setEditingContact(null);
        setNewContact({ name: '', phone: '', relationship: '' });
        setEditContact({ name: '', phone: '', relationship: '' });
        speak('Operation cancelled');
      },
      description: 'Cancel current operation'
    }
  ];

  const { isListening, startListening, stopListening, speak, isSupported } = useVoice(voiceCommands);

  const handleCall = (contact: EmergencyContact) => {
    window.open(`tel:${contact.phone}`);
    speak(`Calling ${contact.name}`);
    
    // Haptic feedback for emergency call
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const handleAddContact = () => {
    setIsAddingContact(true);
    speak('Adding new emergency contact. Please fill in the name, phone number, and relationship.');
  };

  const handleSaveNewContact = () => {
    if (!newContact.name || !newContact.phone) {
      speak('Please fill in both name and phone number');
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship || 'Contact'
    };

    onUpdateContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '', relationship: '' });
    setIsAddingContact(false);
    speak(`Emergency contact ${contact.name} added successfully`);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact.id);
    setEditContact({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship
    });
    speak(`Editing contact ${contact.name}`);
  };

  const handleSaveEdit = () => {
    if (!editContact.name || !editContact.phone) {
      speak('Please fill in both name and phone number');
      return;
    }

    const updatedContacts = contacts.map(contact =>
      contact.id === editingContact
        ? { ...contact, name: editContact.name, phone: editContact.phone, relationship: editContact.relationship }
        : contact
    );

    onUpdateContacts(updatedContacts);
    setEditingContact(null);
    setEditContact({ name: '', phone: '', relationship: '' });
    speak('Contact updated successfully');
  };

  const handleDeleteContact = (contactId: string) => {
    const contactToDelete = contacts.find(c => c.id === contactId);
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    onUpdateContacts(updatedContacts);
    speak(`Contact ${contactToDelete?.name} deleted`);
  };

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600 text-white rounded-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Emergency Contacts</h1>
              <p className="text-red-100 mt-1">Quick access to help</p>
            </div>
            {isSupported && (
              <button
                onClick={handleToggleVoice}
                className={`p-3 rounded-full transition-colors ${
                  isListening ? 'bg-red-700 text-white' : 'bg-red-500 text-white'
                }`}
                aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
              >
                <Volume2 size={20} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Voice Commands Help */}
        {isSupported && isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6"
          >
            <h4 className="font-semibold text-green-800 mb-2">Voice Commands:</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div>"Add contact" - Add new emergency contact</div>
              <div>"Call first contact" - Call first contact in list</div>
              <div>"Call emergency" - Call emergency services</div>
              <div>"Save contact" - Save current contact</div>
              <div>"Cancel" - Cancel current operation</div>
            </div>
          </motion.div>
        )}

        {/* Add Contact Button */}
        {!isAddingContact && !editingContact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddContact}
              className="w-full flex items-center justify-center space-x-2"
              ariaDescription="Add new emergency contact"
            >
              <Plus size={20} />
              <span>Add Emergency Contact</span>
            </Button>
          </motion.div>
        )}

        {/* Add Contact Form */}
        <AnimatePresence>
          {isAddingContact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Contact</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    id="newName"
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Enter contact name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onFocus={() => speak('Name field focused')}
                  />
                </div>
                <div>
                  <label htmlFor="newPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="newPhone"
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onFocus={() => speak('Phone number field focused')}
                  />
                </div>
                <div>
                  <label htmlFor="newRelationship" className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    id="newRelationship"
                    type="text"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    placeholder="e.g., Family, Friend, Doctor"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onFocus={() => speak('Relationship field focused')}
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    onClick={handleSaveNewContact}
                    className="flex-1 flex items-center justify-center space-x-2"
                    ariaDescription="Save new emergency contact"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsAddingContact(false);
                      setNewContact({ name: '', phone: '', relationship: '' });
                      speak('Add contact cancelled');
                    }}
                    className="flex-1 flex items-center justify-center space-x-2"
                    ariaDescription="Cancel adding contact"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contacts List */}
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-4"
            >
              {editingContact === contact.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editContact.name}
                      onChange={(e) => setEditContact({ ...editContact, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editContact.phone}
                      onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={editContact.relationship}
                      onChange={(e) => setEditContact({ ...editContact, relationship: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveEdit}
                      className="flex items-center space-x-1"
                    >
                      <Save size={14} />
                      <span>Save</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingContact(null);
                        setEditContact({ name: '', phone: '', relationship: '' });
                        speak('Edit cancelled');
                      }}
                      className="flex items-center space-x-1"
                    >
                      <X size={14} />
                      <span>Cancel</span>
                    </Button>
                  </div>
                </div>
              ) : (
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
                      className="flex items-center space-x-1"
                    >
                      <Phone size={16} />
                      <span>Call</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditContact(contact)}
                      ariaDescription={`Edit ${contact.name}`}
                    >
                      <Edit3 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                      ariaDescription={`Delete ${contact.name}`}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {contacts.length === 0 && !isAddingContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 mb-4">No emergency contacts added yet</p>
            <Button
              variant="primary"
              onClick={handleAddContact}
              ariaDescription="Add your first emergency contact"
            >
              Add Your First Contact
            </Button>
          </motion.div>
        )}

        {/* Emergency Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <h4 className="font-semibold text-red-900 mb-2">Emergency Services</h4>
          <Button
            variant="emergency"
            size="lg"
            onClick={() => {
              window.open('tel:911');
              speak('Calling emergency services');
            }}
            className="w-full flex items-center justify-center space-x-2"
            ariaDescription="Call emergency services 911"
          >
            <Phone size={20} />
            <span>Call 911</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};