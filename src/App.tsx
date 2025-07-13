import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { LoginPage } from './components/Auth/LoginPage';
import { NavigationInterface } from './components/Navigation/NavigationInterface';
import { EmergencyPage } from './components/Emergency/EmergencyPage';
import { ProfilePage } from './components/Profile/ProfilePage';
import { AROverlay } from './components/AR/AROverlay';
import { Navigation, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, isDemoMode } from './lib/supabase';
import { storage } from './lib/storage';
import { User as UserType, EmergencyContact } from './types';
import { useVoice } from './hooks/useVoice';
import { useGestures } from './hooks/useGestures';
import { useSpatialAudio } from './hooks/useSpatialAudio';
import { useGeolocation } from './hooks/useGeolocation';
import toast from 'react-hot-toast';

function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'navigation' | 'emergency' | 'profile'>('navigation');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showAROverlay, setShowAROverlay] = useState(false);
  const [arDirection, setArDirection] = useState<'straight' | 'left' | 'right'>('straight');

  const { location } = useGeolocation();
  const { playNavigationCue } = useSpatialAudio();

  // Demo user for when Supabase is not connected (Indian context)
  const demoUser: UserType = {
    id: 'demo-user',
    email: 'demo@accessaura.in',
    full_name: 'राहुल शर्मा | Rahul Sharma',
    phone: '+91 98765 43210',
    address: 'कनॉट प्लेस, नई दिल्ली, दिल्ली 110001 | Connaught Place, New Delhi, Delhi 110001',
    accessibility_preferences: {
      voice_enabled: true,
      high_contrast: false,
      large_text: false,
      haptic_feedback: true,
      speech_rate: 1.0,
      vibration_pattern: 'medium',
    },
    emergency_contacts: [
      {
        id: '1',
        name: 'आपातकालीन सेवाएं | Emergency Services',
        phone: '112',
        relationship: 'Emergency'
      },
      {
        id: '2',
        name: 'प्रिया शर्मा | Priya Sharma',
        phone: '+91 98765 43211',
        relationship: 'पत्नी | Wife'
      },
      {
        id: '3',
        name: 'डॉ. अमित गुप्ता | Dr. Amit Gupta',
        phone: '+91 98765 43212',
        relationship: 'डॉक्टर | Doctor'
      }
    ],
    created_at: new Date().toISOString(),
  };

  // Check for persistent login on app start
  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
      const savedContacts = storage.getEmergencyContacts();
      setEmergencyContacts(savedContacts);
      return;
    }

    if (isDemoMode) {
      // Don't auto-login in demo mode, let user sign in
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        storage.removeUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
      storage.setUser(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser(demoUser);
      storage.setUser(demoUser);
    }
  };

  const handleEmergency = useCallback(() => {
    setCurrentView('emergency');
    // Haptic feedback for emergency
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }, []);

  // Voice commands for main app
  const mainVoiceCommands = [
    {
      command: 'navigation',
      action: () => {
        setCurrentView('navigation');
        speak('नेवीगेशन व्यू खोला गया। Navigation view opened');
      },
      description: 'Go to navigation'
    },
    {
      command: 'नेवीगेशन',
      action: () => {
        setCurrentView('navigation');
        speak('नेवीगेशन व्यू खोला गया। Navigation view opened');
      },
      description: 'Go to navigation in Hindi'
    },
    {
      command: 'emergency',
      action: () => {
        setCurrentView('emergency');
        speak('आपातकालीन संपर्क खोले गए। Emergency contacts opened');
      },
      description: 'Open emergency contacts'
    },
    {
      command: 'आपातकाल',
      action: () => {
        setCurrentView('emergency');
        speak('आपातकालीन संपर्क खोले गए। Emergency contacts opened');
      },
      description: 'Open emergency contacts in Hindi'
    },
    {
      command: 'profile',
      action: () => {
        setCurrentView('profile');
        speak('प्रोफाइल व्यू खोला गया। Profile view opened');
      },
      description: 'Open profile'
    },
    {
      command: 'प्रोफाइल',
      action: () => {
        setCurrentView('profile');
        speak('प्रोफाइल व्यू खोला गया। Profile view opened');
      },
      description: 'Open profile in Hindi'
    },
    {
      command: 'start ar',
      action: () => {
        setShowAROverlay(true);
        speak('AR नेवीगेशन ओवरले सक्रिय। AR navigation overlay activated');
      },
      description: 'Start AR overlay'
    },
    {
      command: 'stop ar',
      action: () => {
        setShowAROverlay(false);
        speak('AR नेवीगेशन ओवरले निष्क्रिय। AR navigation overlay deactivated');
      },
      description: 'Stop AR overlay'
    }
  ];

  const { speak, setSpeechSettings } = useVoice(mainVoiceCommands);
  useGestures(handleEmergency);

  const handleAuth = async (authData: { email: string; password: string; fullName?: string }) => {
    setIsLoading(true);

    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userToSave = authData.fullName ? 
          { ...demoUser, full_name: authData.fullName, email: authData.email } : 
          demoUser;
        setUser(userToSave);
        setEmergencyContacts(userToSave.emergency_contacts);
        
        // Save to persistent storage
        storage.setUser(userToSave);
        storage.setEmergencyContacts(userToSave.emergency_contacts);
        
        toast.success('Saarathi में आपका स्वागत है! Welcome to Saarathi!');
        return;
      }

      let result;
      
      if (authData.fullName) {
        result = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password,
        });
        
        if (result.data.user && !result.error) {
          const newUser = {
            id: result.data.user.id,
            email: authData.email,
            full_name: authData.fullName,
            accessibility_preferences: {
              voice_enabled: true,
              high_contrast: false,
              large_text: false,
              haptic_feedback: true,
              speech_rate: 1.0,
              vibration_pattern: 'medium',
            },
            emergency_contacts: demoUser.emergency_contacts,
            created_at: new Date().toISOString(),
          };
          
          await supabase.from('users').insert(newUser);
          setUser(newUser as UserType);
          storage.setUser(newUser);
        }
      } else {
        result = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password,
        });
      }

      if (result.error) throw result.error;
      
      toast.success(authData.fullName ? 'खाता सफलतापूर्वक बनाया गया! Account created successfully!' : 'Saarathi में वापस आपका स्वागत है! Welcome back to Saarathi!');
    } catch (error: any) {
      toast.error(error.message || 'प्रमाणीकरण असफल। Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (isDemoMode) {
      setUser(null);
      storage.removeUser();
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      storage.removeUser();
      toast.success('Saarathi से सफलतापूर्वक साइन आउट हो गए। Signed out from Saarathi successfully');
    } catch (error: any) {
      toast.error('साइन आउट करने में त्रुटि। Error signing out');
    }
  };

  const handleUpdateUser = (updatedUser: UserType) => {
    setUser(updatedUser);
    storage.setUser(updatedUser);
    toast.success('प्रोफाइल सफलतापूर्वक अपडेट हो गया। Profile updated successfully');
  };

  const handleUpdateEmergencyContacts = (contacts: EmergencyContact[]) => {
    setEmergencyContacts(contacts);
    storage.setEmergencyContacts(contacts);
    if (user) {
      const updatedUser = { ...user, emergency_contacts: contacts };
      setUser(updatedUser);
      storage.setUser(updatedUser);
    }
  };

  if (!user) {
    return (
      <AccessibilityProvider>
        <LoginPage onLogin={handleAuth} isLoading={isLoading} />
        <Toaster position="top-center" />
      </AccessibilityProvider>
    );
  }

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
      <div className="flex justify-around">
        {[
          { id: 'navigation', label: 'नेवीगेट | Navigate', icon: Navigation },
          { id: 'emergency', label: 'आपातकाल | Emergency', icon: Shield },
          { id: 'profile', label: 'प्रोफाइल | Profile', icon: User },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setCurrentView(id as any);
              speak(`${label} चुना गया। ${label} selected`);
            }}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
              currentView === id
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            aria-label={label}
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'navigation':
        return <NavigationInterface onEmergency={handleEmergency} />;
      case 'emergency':
        return (
          <EmergencyPage
            contacts={emergencyContacts}
            onUpdateContacts={handleUpdateEmergencyContacts}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            user={user}
            onUpdateUser={handleUpdateUser}
            onSignOut={handleSignOut}
          />
        );
      default:
        return <NavigationInterface onEmergency={handleEmergency} />;
    }
  };

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gray-50">
        {/* AR Overlay */}
        <AROverlay
          isActive={showAROverlay}
          direction={arDirection}
          distance={50}
          nextInstruction="50 मीटर सीधे चलते रहें। Continue straight for 50 meters"
        />

        {/* Main Content */}
        <div className="pb-20">
          {renderCurrentView()}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />

        <Toaster position="top-center" />
      </div>
    </AccessibilityProvider>
  );
}

export default App;