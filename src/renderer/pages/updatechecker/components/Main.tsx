import React, { useState, useEffect } from 'react';
import '../styles/Main.scss';
import ChunsikTwerking from '@assets/image/chunsikTwerking.gif';

export interface IPCMessage {
  type: string;
  data: any;
}

const Main = () => {
  const [status, setStatus] = useState<string>('업데이트 확인 중...');
  const [progress, setProgress] = useState<any>(null);

  const handleMessage = (message: IPCMessage) => {
    console.log('handleMessage', message);
    switch (message.type) {
      case 'CHECKING_FOR_UPDATE':
        setStatus('업데이트 확인 중...');
        break;
      case 'UPDATE_AVAILABLE':
        setStatus('업데이트 다운로드 중...');
        break;
      case 'UPDATE_NOT_AVAILABLE':
        setStatus('최신 버전입니다.');
        break;
      case 'DOWNLOAD_PROGRESS':
        setProgress(message.data);
        break;
      case 'UPDATE_DOWNLOADED':
        setStatus('업데이트 다운로드 완료. 설치를 시작합니다');
        break;
      default:
        setStatus('알 수 없는 상태');
        break;
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('to-updatechecker', handleMessage);

    return () => {
      window.electron.ipcRenderer.removeAllListeners('to-updatechecker');
    };
  }, []);

  return (
    <div className="main-container">
      <div className="update-animation">
        {/* 여기에 로고 이미지나 애니메이션을 추가하세요 */}
        <img src={ChunsikTwerking} alt="chunsik-twerking" />
      </div>
      <div className="main-status-box">
        <span className="update-status">{status}</span>
        {progress && (
          <div className="download-progress">
            <p className="progress-data progress-percent">
              다운로드 중: {Math.round(progress.percent)}%
            </p>
            <p className="progress-data progress-byte">
              {progress.transferred}/{progress.total} bytes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
