import { useCallback, useEffect, useState } from "react";

export function useSound(src: string) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAudio(new Audio(src));
  }, [src]);

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }, [audio]);

  return play;
}
