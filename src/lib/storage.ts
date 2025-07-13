// Local storage utilities for persistent data
export const storage = {
  setUser: (user: any) => {
    localStorage.setItem('accessaura_user', JSON.stringify(user));
  },
  
  getUser: () => {
    const userData = localStorage.getItem('accessaura_user');
    return userData ? JSON.parse(userData) : null;
  },
  
  removeUser: () => {
    localStorage.removeItem('accessaura_user');
  },
  
  setEmergencyContacts: (contacts: any[]) => {
    localStorage.setItem('accessaura_emergency_contacts', JSON.stringify(contacts));
  },
  
  getEmergencyContacts: () => {
    const contacts = localStorage.getItem('accessaura_emergency_contacts');
    return contacts ? JSON.parse(contacts) : [];
  },
  
  setSettings: (settings: any) => {
    localStorage.setItem('accessaura_settings', JSON.stringify(settings));
  },
  
  getSettings: () => {
    const settings = localStorage.getItem('accessaura_settings');
    return settings ? JSON.parse(settings) : null;
  }
};