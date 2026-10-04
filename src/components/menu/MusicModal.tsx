import { useAudio } from "../../context/AudioContext";

export const MusicModal = ({ onBack }: { onBack: () => void }) => {
  const {
    playlist,
    currentTrackIndex,
    isPlaying,
    addTracks,
    playTrack,
    togglePlay,
  } = useAudio();

  return (
    <div className="menu-container">
      <h1>INDEPENDENCE FM</h1>
      <p style={{ color: "#777", marginBottom: "20px" }}>LOAD YOUR TAPES</p>

      {/* File input for your MP3s */}
      <label
        style={{
          display: "inline-block",
          padding: "10px 20px",
          background: "#fff",
          color: "#000",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "-0.5px",
          cursor: "pointer",
          textTransform: "uppercase",
          marginBottom: "20px",
          userSelect: "none",
        }}
      >
        LOAD CASSETTES
        <input
          type="file"
          accept="audio/*,.mp3,.wav,.ogg"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              addTracks(e.target.files);
              // Reset the value so uploading the same file again still fires onChange
              e.target.value = "";
            }
          }}
          style={{ display: "none" }}
        />
      </label>

      <div style={{ margin: "20px 0" }}>
        {playlist.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#555" }}>
            NO CASSETTES LOADED
          </p>
        ) : (
          <div
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              marginBottom: "15px",
            }}
          >
            {playlist.map((track, i) => (
              <div
                key={track.id}
                onClick={() => playTrack(i)}
                style={{
                  cursor: "pointer",
                  color: currentTrackIndex === i ? "#fff" : "#666",
                  fontWeight: currentTrackIndex === i ? "bold" : "normal",
                  padding: "4px 0",
                }}
              >
                {currentTrackIndex === i ? "▶ " : ""}
                {track.title}
              </div>
            ))}
          </div>
        )}

        <button onClick={togglePlay} disabled={playlist.length === 0}>
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
      </div>

      <button onClick={onBack}>BACK</button>
    </div>
  );
};
