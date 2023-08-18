import React, { useState, useEffect } from "react";
import { useRef } from "react";
const AudioComponent = ({ audioUrl, setAudioUrl }) => {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioElementRef = useRef(null);

  useEffect(() => {
    if (audioUrl) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      const newAudio = new Audio(audioUrl);
      setAudio(newAudio);
      setIsPlaying(true);
    }
  }, [audioUrl]);

  useEffect(() => {
    if (isPlaying && audioElementRef.current) {
      audioElementRef.current.play();
    }
  }, [isPlaying]);

  const closeAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioUrl("");
  };

  return (
    <div className="audiodiv">
      {audioUrl && (
        <>
          <audio ref={audioElementRef} controls key={audioUrl} autoPlay="autoplay">
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
          <button onClick={closeAudio} className="audioControl">
            닫기
          </button>
        </>
      )}
    </div>
  );
};

export default AudioComponent;
