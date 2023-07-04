import './App.css';
import {Player} from "webvtt-player"
import React, { useState } from 'react';



function App() {
  const player = React.useRef(null);
  const [mp3File, setMp3File] = useState('');
  const [mp3Filename, setMp3Filename] = useState('');
  const [vttFile, setVttFile] = useState('');
  const vttInputRef = React.useRef(null);
  const [bookmarks, setBookmarks] = React.useState([]);

  const handleMp3Change = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      const mp3Data = reader.result.split(',')[1];
      setMp3File('data:audio/mp3;base64,' + mp3Data);
      setVttFile('');
      vttInputRef.current.value = null;
      document.title = event.target.files[0].name;
      setMp3Filename(event.target.files[0].name);
      debugger;
      try {
        const rawBookmarks = localStorage[`bookmarks-${event.target.files[0].name}`];
        const newBookmarks = JSON.parse(rawBookmarks);
        setBookmarks(newBookmarks ?? []);
      } catch (e) {
        console.error(e);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleVttChange = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      const vttData = reader.result.split(',')[1];
      setVttFile('data:text/vtt;base64,' + vttData);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (player.current.audio.current.paused) {
          player.current.audio.current.play();
        } else {
          player.current.audio.current.pause();
        }
      } else if (event.code === 'ArrowRight') {
        event.preventDefault();
        player.current.audio.current.currentTime += 2;
      } else if (event.code === 'ArrowLeft') {
        event.preventDefault();
        player.current.audio.current.currentTime -= 2;
      } else if (event.code === 'ArrowUp') {
        event.preventDefault();
        player.current.audio.current.currentTime -= 15;
      } else if (event.code === 'ArrowDown') {
        event.preventDefault();
        player.current.audio.current.currentTime += 15;
      } else if (event.ctrlKey && event.code >= 'Digit1' && event.code <= 'Digit9') {
        event.preventDefault();
        const bookmarkIndex = Number(event.code.slice(-1)) - 1;
        if (bookmarkIndex >= 0 && bookmarkIndex < 9) {
          const currentTime = player.current.audio.current.currentTime;
          const newBookmarks = [...bookmarks];
          newBookmarks[bookmarkIndex] = currentTime;
          setBookmarks(newBookmarks);
          debugger;
          localStorage.setItem(`bookmarks-${mp3Filename}`, JSON.stringify(newBookmarks))
        }
      } else if (event.code >= 'Digit1' && event.code <= 'Digit9') {
        event.preventDefault();
        const bookmarkIndex = Number(event.code.slice(-1)) - 1;
        if (bookmarkIndex >= 0 && bookmarkIndex < 9 && bookmarks[bookmarkIndex]) {
          const bookmarkTime = bookmarks[bookmarkIndex];
          player.current.audio.current.currentTime = bookmarkTime;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [bookmarks, mp3Filename]);

  return (
    <div className="App">
      <label htmlFor="mp3Input">MP3 File:</label>
      <input type="file" id="mp3Input" accept=".mp3,.m4a,.mp4" onChange={handleMp3Change} />

      <label htmlFor="vttInput">VTT File:</label>
      <input type="file" id="vttInput" accept=".vtt"  onChange={handleVttChange} ref={vttInputRef} />

      <div className="timestamps">
        <div className="timestamp">CTRL+1..9</div>
        {bookmarks.map((timestamp, index) => {
          const minutes = Math.floor(timestamp / 60);
          const seconds = timestamp % 60;
          const formattedTimestamp = `${minutes}:${Math.floor(seconds.toString().padStart(2, '0'))}`;

          return (
            <div key={index} className="timestamp" onClick={() => player.current.audio.current.currentTime = timestamp}>
              <b>{index + 1}</b>   {formattedTimestamp}
            </div>
          );
        })}
      </div>
      {mp3File && vttFile && <Player
        ref={player}
        audio={mp3File}
        transcript={vttFile}
      />}
    </div>
  );
}

export default App;
