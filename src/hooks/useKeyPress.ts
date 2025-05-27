import { useEffect, useCallback } from 'react';

/**
 * Custom hook for handling keyboard events
 * @param targetKey Key to listen for (e.g., 'Escape', 'ArrowRight')
 * @param callback Function to call when the key is pressed
 * @param dependencies Additional dependencies for the callback
 */
export default function useKeyPress(
  targetKey: string, 
  callback: () => void,
  dependencies: any[] = []
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        callback();
      }
    }, 
    [targetKey, callback, ...dependencies]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
} 