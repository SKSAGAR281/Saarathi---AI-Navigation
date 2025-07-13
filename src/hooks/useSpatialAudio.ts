import { useState, useEffect, useCallback } from 'react';

export const useSpatialAudio = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContextClass();
      setAudioContext(context);
      setIsSupported(true);
    }
  }, []);

  const playDirectionalSound = useCallback((
    direction: 'left' | 'right' | 'center',
    frequency: number = 440,
    duration: number = 500
  ) => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const pannerNode = audioContext.createStereoPanner();

    // Set panning based on direction
    switch (direction) {
      case 'left':
        pannerNode.pan.value = -0.8;
        break;
      case 'right':
        pannerNode.pan.value = 0.8;
        break;
      case 'center':
        pannerNode.pan.value = 0;
        break;
    }

    oscillator.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }, [audioContext]);

  const playNavigationCue = useCallback((direction: 'left' | 'right' | 'straight') => {
    switch (direction) {
      case 'left':
        playDirectionalSound('left', 300, 300);
        break;
      case 'right':
        playDirectionalSound('right', 500, 300);
        break;
      case 'straight':
        playDirectionalSound('center', 400, 200);
        break;
    }
  }, [playDirectionalSound]);

  return {
    playDirectionalSound,
    playNavigationCue,
    isSupported
  };
};