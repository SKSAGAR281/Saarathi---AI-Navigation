import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Volume2, Navigation, MapPin, Compass } from 'lucide-react';
import { Button } from '../ui/Button';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useVoice } from '../../hooks/useVoice';

interface LoginPageProps {
  onLogin: (userData: LoginData) => void;
  isLoading: boolean;
}

interface LoginData {
  email: string;
  password: string;
  fullName?: string;
}

const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const signupSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentField, setCurrentField] = useState<string>('');

  const schema = isSignUp ? signupSchema : loginSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<LoginData>({
    resolver: yupResolver(schema)
  });

  const watchedValues = watch();

  // Voice commands for authentication
  const voiceCommands = [
    {
      command: 'sign in',
      action: () => {
        if (isSignUp) {
          setIsSignUp(false);
          speak('Switched to sign in mode');
        } else {
          handleSubmit(handleFormSubmit)();
        }
      },
      description: 'Sign in or switch to sign in mode'
    },
    {
      command: 'sign up',
      action: () => {
        if (!isSignUp) {
          setIsSignUp(true);
          speak('Switched to sign up mode');
        } else {
          handleSubmit(handleFormSubmit)();
        }
      },
      description: 'Sign up or switch to sign up mode'
    },
    {
      command: 'email field',
      action: () => {
        setCurrentField('email');
        speak('Email field selected. Please speak your email address.');
      },
      description: 'Focus email field'
    },
    {
      command: 'password field',
      action: () => {
        setCurrentField('password');
        speak('Password field selected. Please speak your password.');
      },
      description: 'Focus password field'
    },
    {
      command: 'name field',
      action: () => {
        if (isSignUp) {
          setCurrentField('fullName');
          speak('Full name field selected. Please speak your full name.');
        }
      },
      description: 'Focus full name field'
    },
    {
      command: 'show password',
      action: () => {
        setShowPassword(true);
        speak('Password is now visible');
      },
      description: 'Show password'
    },
    {
      command: 'hide password',
      action: () => {
        setShowPassword(false);
        speak('Password is now hidden');
      },
      description: 'Hide password'
    }
  ];

  const { isListening, startListening, stopListening, speak, isSupported } = useVoice(voiceCommands);

  // Auto-start voice assistant when page loads
  useEffect(() => {
    if (isSupported) {
      setTimeout(() => {
        startListening();
        speak('Welcome to Saarathi. Voice assistant activated. Please sign in or create an account.');
      }, 1000);
    }
  }, [isSupported, startListening, speak]);

  // Announce form changes
  useEffect(() => {
    if (isSignUp) {
      speak('Sign up form loaded. Say "name field" for full name, "email field" for email, or "password field" for password.');
    } else {
      speak('Sign in form loaded. Say "email field" to enter your email, or "password field" for password.');
    }
  }, [isSignUp, speak]);

  // Announce errors
  useEffect(() => {
    if (errors.email) {
      speak(`Email error: ${errors.email.message}`);
    }
    if (errors.password) {
      speak(`Password error: ${errors.password.message}`);
    }
    if (errors.fullName) {
      speak(`Full name error: ${errors.fullName.message}`);
    }
  }, [errors, speak]);

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    reset();
    setCurrentField('');
  };

  const handleFormSubmit = (data: LoginData) => {
    speak(isSignUp ? 'Creating account...' : 'Signing in...');
    onLogin(data);
  };

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        
        {/* Navigation Path Animation */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 text-white/10"
        >
          <Navigation size={40} />
        </motion.div>
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-20 text-white/10"
        >
          <MapPin size={35} />
        </motion.div>
        
        <motion.div
          animate={{
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-10 text-white/10"
        >
          <Compass size={30} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative z-10"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
            <Navigation className="text-white" size={36} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Saarathi
            </h1>
            <p className="text-gray-600 text-lg font-medium">आपका AI नेवीगेशन साथी | Your AI Navigation Companion</p>
            <p className="text-gray-500 text-sm mt-1">आत्मविश्वास से नेवीगेट करें | Navigate with confidence, powered by voice</p>
          </motion.div>
        </div>

        {/* Voice Control */}
        {isSupported && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Volume2 className="text-blue-600" size={18} />
                <span className="text-sm font-semibold text-blue-800">Voice Assistant</span>
              </div>
              <button
                onClick={handleToggleVoice}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                    : 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600'
                }`}
                aria-label={isListening ? 'वॉयस कंट्रोल बंद करें | Stop voice control' : 'वॉयस कंट्रोल शुरू करें | Start voice control'}
              >
                <Volume2 size={16} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <p className="text-xs text-blue-700">
                {isListening ? 'वॉयस कमांड सुन रहे हैं... | Listening for voice commands...' : 'वॉयस असिस्टेंट तैयार | Voice assistant ready'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onSubmit={handleSubmit(handleFormSubmit)} 
          className="space-y-6"
        >
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...register('fullName')}
                  id="fullName"
                  type="text"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                    errors.fullName ? 'border-red-400' : 'border-gray-200'
                  } ${currentField === 'fullName' ? 'ring-4 ring-indigo-500/20 border-indigo-500' : ''}`}
                  placeholder="Enter your full name"
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  onFocus={() => speak('Full name field focused')}
                />
              </div>
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="fullName-error" 
                  className="mt-2 text-sm text-red-600 font-medium" 
                  role="alert"
                >
                  {errors.fullName.message}
                </motion.p>
              )}
            </motion.div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('email')}
                id="email"
                type="email"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                } ${currentField === 'email' ? 'ring-4 ring-indigo-500/20 border-indigo-500' : ''}`}
                placeholder="Enter your email"
                aria-describedby={errors.email ? 'email-error' : undefined}
                onFocus={() => speak('Email field focused')}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="email-error" 
                className="mt-2 text-sm text-red-600 font-medium" 
                role="alert"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                  errors.password ? 'border-red-400' : 'border-gray-200'
                } ${currentField === 'password' ? 'ring-4 ring-indigo-500/20 border-indigo-500' : ''}`}
                placeholder="Enter your password"
                aria-describedby={errors.password ? 'password-error' : undefined}
                onFocus={() => speak('Password field focused')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="password-error" 
                className="mt-2 text-sm text-red-600 font-medium" 
                role="alert"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-4 rounded-2xl text-lg font-semibold shadow-xl shadow-indigo-500/25 border-0"
              ariaDescription={isSignUp ? 'Create new account' : 'Sign in to your account'}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Toggle Mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <button
            type="button"
            onClick={handleToggleMode}
            className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors text-lg"
            aria-label={isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </motion.div>

        {/* Voice Commands Help */}
        {isSupported && isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100"
          >
            <h4 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
              <Volume2 size={16} />
              <span>Voice Commands Available:</span>
            </h4>
            <div className="text-sm text-green-700 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>"Email field" - Focus email input</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>"Password field" - Focus password input</span>
              </div>
              {isSignUp && (
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span>"Name field" - Focus name input</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>"Sign {isSignUp ? 'up' : 'in'}" - Submit form</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* App Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
        >
          <div className="text-center">
            <h3 className="font-bold text-indigo-900 mb-3 text-lg">भारत में आत्मविश्वास से नेवीगेट करें | Navigate India with Confidence</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-indigo-700">
              <div className="flex items-center space-x-2">
                <Navigation size={16} className="text-indigo-600" />
                <span>वॉयस नेवीगेशन | Voice Navigation</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-indigo-600" />
                <span>लाइव लोकेशन | Live Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye size={16} className="text-indigo-600" />
                <span>AI डिटेक्शन | AI Detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Compass size={16} className="text-indigo-600" />
                <span>स्मार्ट रूट | Smart Routes</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};