import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardComponent from "../components/CardComponent";
import AddSongForm from "../views/AddSongForm";
import "../assets/MainPage.css";
import SongDetails from "./SongDetails";
import LyricsSearch from "./LyricsSearch";
import LyricsHistory from "./LyricsHistory";

const MainPage = () => {
  const [view, setView] = useState("songs");
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [lyricsPreset, setLyricsPreset] = useState(null);

  return (
    <div className="page">
      <Header onChangeView={setView} />
      <main className="content">
        {view === "songs" && (
          <CardComponent
            onSelectSong={(id) => {
              setSelectedSongId(id);
              setView("details");
            }}
          />
        )}
        {view === "details" && (
          <SongDetails
            songId={selectedSongId}
            onBack={() => {
              setSelectedSongId(null);
              setView("songs");
            }}
            onDeleted={() => {
              setSelectedSongId(null);
              setView("songs");
            }}
          />
        )}
        {view === "add" && <AddSongForm onSongAdded={() => setView("songs")} />}
        {view === "lyrics" && (
          <LyricsSearch
            preset={lyricsPreset}
            onGoHistory={() => setView("lyricsHistory")}
          />
        )}
        {view === "lyricsHistory" && (
          <LyricsHistory
            onBack={() => setView("lyrics")}
            onPick={(item) => {
              setLyricsPreset(item);
              setView("lyrics");
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;
