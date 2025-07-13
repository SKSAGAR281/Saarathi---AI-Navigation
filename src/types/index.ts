export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  emergency_contacts: EmergencyContact[];
  accessibility_preferences: {
    voice_enabled: boolean;
    high_contrast: boolean;
    large_text: boolean;
    haptic_feedback: boolean;
    speech_rate: number;
    vibration_pattern: 'light' | 'medium' | 'strong';
  };
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface NavigationSession {
  id: string;
  user_id: string;
  start_location: Location;
  end_location: Location;
  duration: number;
  distance: number;
  obstacles_detected: number;
  completed: boolean;
  route_points: RoutePoint[];
  created_at: string;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  heading?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface DetectedObject {
  id: string;
  type: 'obstacle' | 'landmark' | 'hazard' | 'navigation';
  confidence: number;
  position: {
    x: number;
    y: number;
  };
  distance: number;
  description: string;
  direction?: 'left' | 'right' | 'center';
}

export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}