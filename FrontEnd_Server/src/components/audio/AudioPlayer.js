// AudioPlayer.js (프론트엔드)
import React, { useState } from 'react';
import axios from 'axios';

const AudioPlayer = () => {
  const [audioURL, setAudioURL] = useState(null);

  const fetchAudioFile = async () => {
    try {
      // 백엔드 API로 음성 파일 요청
      const response = await axios.get('/api/plant/quest/audio');

      // 받아온 음성 파일 URL을 상태에 저장
      setAudioURL(response.data);
    } catch (error) {
      console.error('음성 파일을 가져오는 데 실패했습니다:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchAudioFile}>음성 파일 가져오기</button>
      {audioURL && (
        <audio controls>
          {/* 받아온 음성 파일 URL을 재생 가능한 형식으로 설정 */}
          <source src={audioURL} type="audio/mpeg" />
          {/* HTML5 Audio 요소를 활용하여 음성 파일을 재생 */}
        </audio>
      )}
    </div>
  );
};

export default AudioPlayer;
