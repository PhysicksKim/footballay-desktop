/**
 * App Window용 Logger
 * electron-log 스타일의 API를 제공하며, 실제로는 IPC를 통해 main process로 로그를 전송합니다.
 */

interface Logger {
  info: (msg: string, data?: Record<string, unknown>) => void;
  warn: (msg: string, data?: Record<string, unknown>) => void;
  error: (msg: string, data?: Record<string, unknown>) => void;
  debug: (msg: string, data?: Record<string, unknown>) => void;
}

/**
 * Logger를 생성합니다.
 * @param where 로그가 발생한 위치를 나타내는 식별자 (예: 'app:v1:polling', 'app:v1:redux')
 * @returns Logger 인스턴스
 */
export const getLogger = (where: string): Logger => {
  const sendLog = (
    level: 'info' | 'warn' | 'error' | 'debug',
    msg: string,
    data?: Record<string, unknown>
  ) => {
    try {
      // window.electron은 preload에서 노출되므로, 런타임에 확인
      if (
        typeof window !== 'undefined' &&
        (window as any)?.electron?.ipcRenderer
      ) {
        (window as any).electron.ipcRenderer.send('loginfo', {
          where,
          level,
          msg,
          data,
        });
      }
    } catch (error) {
      // 로깅 실패는 무시 (무한 루프 방지)
    }
  };

  return {
    info: (msg: string, data?: Record<string, unknown>) => {
      sendLog('info', msg, data);
    },
    warn: (msg: string, data?: Record<string, unknown>) => {
      sendLog('warn', msg, data);
    },
    error: (msg: string, data?: Record<string, unknown>) => {
      sendLog('error', msg, data);
    },
    debug: (msg: string, data?: Record<string, unknown>) => {
      sendLog('debug', msg, data);
    },
  };
};
