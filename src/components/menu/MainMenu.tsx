import type { ScreenView } from "../../types/game";

export const MainMenu = ({
  onNavigate,
}: {
  onNavigate: (v: ScreenView) => void;
}) => (
  <div className="menu-container">
    <h1>CUE CLUB</h1>
    <p>LIBERTY CITY RULES</p>
    <div className="menu-options">
      <button onClick={() => onNavigate("start_setup")}>START GAME</button>
      <button onClick={() => onNavigate("history")}>MATCH HISTORY</button>
      <button onClick={() => onNavigate("music")}>INDEPENDENCE FM</button>
    </div>
  </div>
);
