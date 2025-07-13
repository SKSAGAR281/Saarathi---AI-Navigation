import { useState, useEffect, useCallback } from 'react';

export const useGestures = (onSOS: () => void) => {
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [shakeDetected, setShakeDetected] = useState(false);

  // Triple tap detection
  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastTapTime;
    
    if (timeDiff < 500) { // Within 500ms
      setTapCount(prev => prev + 1);
    } else {
      setTapCount(1);
    }
    
    setLastTapTime(now);
  }, [lastTapTime]);

  // Reset tap count after timeout
  useEffect(() => {
    if (tapCount > 0) {
      const timeout = setTimeout(() => {
        if (tapCount >= 3) {
          onSOS();
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
          }
        }
        setTapCount(0);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [tapCount, onSOS]);

  // Shake detection
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeThreshold = 15;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const { x = 0, y = 0, z = 0 } = acceleration;
      
      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);
      
      if (deltaX + deltaY + deltaZ > shakeThreshold) {
        if (!shakeDetected) {
          setShakeDetected(true);
          onSOS();
          if (navigator.vibrate) {
            navigator.vibrate([300, 200, 300]);
          }
          
          // Reset shake detection after 2 seconds
          setTimeout(() => setShakeDetected(false), 2000);
        }
      }
      
      lastX = x;
      lastY = y;
      lastZ = z;
    };

    // Request permission for device motion on iOS
    if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission().then((response: string) => {
        if (response === 'granted') {
          window.addEventListener('devicemotion', handleDeviceMotion);
        }
      });
    } else {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [onSOS, shakeDetected]);

  return {
    handleTap,
    tapCount,
    shakeDetected
  };
};