import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import type { Track } from "../types/game";

interface AudioContextType {
  playlist: Track[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  addTracks: (files: FileList) => void;
  playTrack: (index: number) => void;
  togglePlay: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Hidden audio element to control playback
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();

    // Auto-advance to the next track when one finishes
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => {
        if (prev === null) return null;
        return (prev + 1) % playlist.length;
      });
    };

    audioRef.current.addEventListener("ended", handleEnded);
    return () => {
      audioRef.current?.removeEventListener("ended", handleEnded);
      audioRef.current?.pause();
    };
  }, [playlist.length]);

  // Handle changing the track source and playing
  useEffect(() => {
    if (
      !audioRef.current ||
      currentTrackIndex === null ||
      !playlist[currentTrackIndex]
    ) {
      return;
    }

    audioRef.current.src = playlist[currentTrackIndex].url;
    if (isPlaying) {
      audioRef.current
        .play()
        .catch((err) => console.warn("Audio play blocked:", err));
    }
  }, [currentTrackIndex]);

  // Handle play / pause toggle
  useEffect(() => {
    if (!audioRef.current || currentTrackIndex === null) return;

    if (isPlaying) {
      audioRef.current
        .play()
        .catch((err) => console.warn("Audio play blocked:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const addTracks = (files: FileList) => {
    const newTracks: Track[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^/.]+$/, ""), // strips the .mp3 extension
      url: URL.createObjectURL(file), // creates browser-playable stream
    }));

    setPlaylist((prev) => {
      const updated = [...prev, ...newTracks];
      // If nothing was playing, queue up the first track
      if (currentTrackIndex === null && updated.length > 0) {
        setCurrentTrackIndex(0);
      }
      return updated;
    });
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (currentTrackIndex === null && playlist.length > 0) {
      setCurrentTrackIndex(0);
    }
    setIsPlaying((prev) => !prev);
  };

  return (
    <AudioContext.Provider
      value={{
        playlist,
        currentTrackIndex,
        isPlaying,
        addTracks,
        playTrack,
        togglePlay,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
  return ctx;
};
