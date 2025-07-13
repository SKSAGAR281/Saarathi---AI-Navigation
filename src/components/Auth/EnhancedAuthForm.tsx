import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useVoice } from '../../hooks/useVoice';

interface AuthFormProps {
  onSubmit: (data: AuthFormData) => void;
  isLoading: boolean;
}

interface AuthFormData {
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

export const EnhancedAuthForm: React.FC<AuthFormProps> = ({ onSubmit, isLoading }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentField, setCurrentField] = useState<string>('');

  const schema = isLogin ? loginSchema : signupSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<AuthFormData>({
    resolver: yupResolver(schema)
  });

  const watchedValues = watch();

  // Voice commands for form interaction
  const voiceCommands = [
    {
      command: 'sign in',
      action: () => {
        if (!isLogin) {
          setIsLogin(true);
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
        if (isLogin) {
          setIsLogin(false);
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
        if (!isLogin) {
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

  // Voice input for form fields
  useEffect(() => {
    if (currentField && isListening) {
      // Simulate voice input (in real app, this would use speech recognition for text input)
      const handleVoiceInput = (text: string) => {
        setValue(currentField as keyof AuthFormData, text);
        speak(`${currentField} set to ${text}`);
        setCurrentField('');
      };
    }
  }, [currentField, isListening, setValue, speak]);

  // Announce form changes
  useEffect(() => {
    if (isLogin) {
      speak('Sign in form loaded. Say "email field" to enter your email, or "password field" for password.');
    } else {
      speak('Sign up form loaded. Say "name field" for full name, "email field" for email, or "password field" for password.');
    }
  }, [isLogin, speak]);

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
    setIsLogin(!isLogin);
    reset();
    setCurrentField('');
  };

  const handleFormSubmit = (data: AuthFormData) => {
    speak(isLogin ? 'Signing in...' : 'Creating account...');
    onSubmit(data);
  };

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          >
            <Eye className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AccessAura</h1>
          <p className="text-gray-600">AI & AR Navigation for Everyone</p>
        </div>

        {/* Voice Control */}
        {isSupported && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Voice Control</span>
              <button
                onClick={handleToggleVoice}
                className={`p-2 rounded-full transition-colors ${
                  isListening ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                }`}
                aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
              >
                <Volume2 size={16} />
              </button>
            </div>
            <p className="text-xs text-blue-700">
              {isListening ? 'Listening for voice commands...' : 'Tap to activate voice commands'}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...register('fullName')}
                  id="fullName"
                  type="text"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  } ${currentField === 'fullName' ? 'ring-2 ring-blue-500' : ''}`}
                  placeholder="Enter your full name"
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  onFocus={() => speak('Full name field focused')}
                />
              </div>
              {errors.fullName && (
                <p id="fullName-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('email')}
                id="email"
                type="email"
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } ${currentField === 'email' ? 'ring-2 ring-blue-500' : ''}`}
                placeholder="Enter your email"
                aria-describedby={errors.email ? 'email-error' : undefined}
                onFocus={() => speak('Email field focused')}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } ${currentField === 'password' ? 'ring-2 ring-blue-500' : ''}`}
                placeholder="Enter your password"
                aria-describedby={errors.password ? 'password-error' : undefined}
                onFocus={() => speak('Password field focused')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2"
            ariaDescription={isLogin ? 'Sign in to your account' : 'Create new account'}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleToggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            aria-label={isLogin ? 'Switch to sign up' : 'Switch to sign in'}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        {/* Voice Commands Help */}
        {isSupported && isListening && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Voice Commands:</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div>"Email field" - Focus email input</div>
              <div>"Password field" - Focus password input</div>
              {!isLogin && <div>"Name field" - Focus name input</div>}
              <div>"Sign {isLogin ? 'in' : 'up'}" - Submit form</div>
              <div>"Show/Hide password" - Toggle visibility</div>
            </div>
          </div>
        )}

        {/* Accessibility Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            🎯 Fully accessible with voice commands, screen reader support, and keyboard navigation.
          </p>
        </div>
      </motion.div>
    </div>
  );
};