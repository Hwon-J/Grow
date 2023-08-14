// AudioComponent.js
import React from "react";

const AudioComponent = ({ audioData, setAudioData, setAudioPlaying, audioPlaying }) => {
  // 오디오 멈추게 만드zz는 메서드
  const stopAudio = () => {
    setAudioData("");
    setAudioPlaying(false);
  };
  // audio를 시용해서 음성파일 실행 , src에 listenAudio로 받아온 데이터를 넣어주기 
  return (
    <div className="audiodiv">
      {audioData && (
        <>
          <audio controls>
            <source src={audioData} type="audio/wav" />  
          </audio>
          {audioPlaying ? (
            <button onClick={stopAudio} className="audioStop">
              Stop
            </button>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default AudioComponent;
