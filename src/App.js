import './App.css';
import {Player} from "webvtt-player"
import React, { useState } from 'react';



function App() {
  const [mp3File, setMp3File] = useState('');
  const [vttFile, setVttFile] = useState('');
  const vttInputRef = React.useRef(null);

  const handleMp3Change = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      const mp3Data = reader.result.split(',')[1];
      setMp3File('data:audio/mp3;base64,' + mp3Data);
      setVttFile('');
      vttInputRef.current.value = null;
      document.title = event.target.files[0].name;
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

  return (
    <div className="App">
      <label htmlFor="mp3Input">MP3 File:</label>
      <input type="file" id="mp3Input" accept=".mp3,.m4a,.mp4" onChange={handleMp3Change} />

      <label htmlFor="vttInput">VTT File:</label>
      <input type="file" id="vttInput" accept=".vtt"  onChange={handleVttChange} ref={vttInputRef} />

      {mp3File && vttFile && <Player
        audio={mp3File}
        transcript={vttFile}
      />}
    </div>
  );
}

export default App;
