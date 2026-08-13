// src/hooks/useAudio.js
import { useEffect, useCallback } from 'react';
import { narrate as coreNarrate, stopAudio, setMuted, sounds } from '../utils/audio.js';

export function useAudio(audioEnabled = true) {
  useEffect(() => {
    setMuted(!audioEnabled);
  }, [audioEnabled]);

  const narrate = useCallback(
    (segments, options) => {
      if (!audioEnabled) return;
      coreNarrate(segments, options);
    },
    [audioEnabled]
  );

  const stopAll = useCallback(() => {
    stopAudio();
  }, []);

  return {
    narrate,
    stopAll,
    sounds,
    audioEnabled,
  };
}
