import { useState } from "react";
import type { ScreenView } from "./types/game";
import { AudioProvider } from "./context/AudioContext";
import { MainMenu } from "./components/menu/MainMenu";
import { MusicModal } from "./components/menu/MusicModal";
import { PoolCanvas } from "./components/game/PoolCanvas";

export default function App() {
  const [view, setView] = useState<ScreenView>("menu");

  return (
    <AudioProvider>
      <div className="app-root">
        {view === "menu" && <MainMenu onNavigate={setView} />}
        {view === "music" && <MusicModal onBack={() => setView("menu")} />}

        {view === "start_setup" && (
          <div className="menu-container">
            <h2>START MATCH</h2>
            <button onClick={() => setView("playing")}>BREAK</button>
            <button onClick={() => setView("menu")}>BACK</button>
          </div>
        )}

        {view === "playing" && (
          <div style={{ width: "100vw", height: "100vh" }}>
            <div className="hud">
              <button onClick={() => setView("menu")}>QUIT</button>
            </div>
            <PoolCanvas />
          </div>
        )}
      </div>
    </AudioProvider>
  );
}
