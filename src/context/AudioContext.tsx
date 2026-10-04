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

  async function computeAudioHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const addTracks = async (files: FileList) => {
    // 1. Calculate hashes concurrently for all incoming files
    const fileEntries = await Promise.all(
      Array.from(files).map(async (file) => ({
        file,
        hashId: await computeAudioHash(file),
      })),
    );

    setPlaylist((prev) => {
      // 2. Track existing IDs in a Set
      const existingIds = new Set(prev.map((track) => track.id));
      const newTracks: Track[] = [];

      // 3. Only create tracks (and blob URLs) for genuinely new files
      for (const { file, hashId } of fileEntries) {
        if (!existingIds.has(hashId)) {
          existingIds.add(hashId); // Guards against duplicates within this batch
          newTracks.push({
            id: hashId,
            title: file.name.replace(/\.[^/.]+$/, ""),
            url: URL.createObjectURL(file), // Created ONLY when approved
          });
        }
      }

      // 4. No new tracks? Return prev untouched (prevents re-render)
      if (newTracks.length === 0) return prev;

      const updated = [...prev, ...newTracks];

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
