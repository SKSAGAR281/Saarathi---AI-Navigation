import { useState, useEffect, useCallback } from 'react';
import { VoiceCommand } from '../types';

export const useVoice = (commands: VoiceCommand[]) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [speechRate, setSpeechRate] = useState(0.9);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        setLastCommand(command);
        
        const matchedCommand = commands.find(cmd => 
          command.includes(cmd.command.toLowerCase())
        );
        
        if (matchedCommand) {
          speak(`Executing ${matchedCommand.description}`);
          matchedCommand.action();
        } else {
          speak('Command not recognized. Please try again.');
        }
      };
      
      recognition.onerror = (event) => {
        if (event.error === 'aborted') {
          if (!isListening) {
            // Intentional abort - suppress error and feedback
            return;
          } else {
            // Unexpected abort - provide specific feedback
            console.warn('Speech recognition error:', event.error);
            speak('Voice recognition stopped unexpectedly. Restarting...');
          }
        } else if (event.error === 'no-speech') {
          // Don't stop listening for no-speech, just provide feedback
          speak('Listening for your command');
        } else {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          speak('Voice recognition error. Please try again.');
        }
      };
      
      recognition.onend = () => {
        if (isListening) {
          // Restart recognition if it was supposed to be listening
          recognition.start();
        }
      };
      
      setRecognition(recognition);

      return () => {
        if (recognition) {
          recognition.stop();
        }
      };
    }
  }, [commands, isListening]);

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      speak('Voice commands activated. I am listening.');
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
      speak('Voice commands deactivated');
    }
  }, [recognition]);

  const speak = useCallback((text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate || speechRate;
      utterance.pitch = options?.pitch || 1;
      utterance.volume = options?.volume || 0.8;
      
      speechSynthesis.speak(utterance);
    }
  }, [speechRate]);

  const setSpeechSettings = useCallback((rate: number) => {
    setSpeechRate(rate);
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    speak,
    lastCommand,
    isSupported: !!recognition,
    setSpeechSettings,
    speechRate
  };
};