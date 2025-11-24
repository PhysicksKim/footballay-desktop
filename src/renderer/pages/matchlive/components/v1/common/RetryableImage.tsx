import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactEventHandler, useEffect, useState } from 'react';

interface RetryableImageProps {
  src: string;
  alt?: string;
  className?: string;
  maxRetries?: number;
  height?: number;
  width?: number;
  style?: React.CSSProperties;
  useLoading?: boolean;
}

const RetryableImage: React.FC<RetryableImageProps> = ({
  src,
  alt = '',
  className = '',
  maxRetries = 5,
  height = -1,
  width = -1,
  style = undefined,
  useLoading = false,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);

  // 새로운 이미지로 변경될 때 retryCount 초기화
  useEffect(() => {
    setRetryCount(0);
  }, [src]);

  const handleError: ReactEventHandler<HTMLImageElement> = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setIsLoading(true);
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(retryCount + 1);
      }, 500);
    } else {
      console.log('이미지 로딩에 실패했습니다. src:', src);
    }
  };

  return (
    <>
      {isLoading && useLoading && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#8f8f8f',
          }}
        >
          <FontAwesomeIcon icon={faSpinner} className="fa-pulse" />
        </div>
      )}
      <img
        className={className}
        key={`${src}-${retryCount}`}
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        height={height > 0 ? `${height}px` : '100%'}
        width={width > 0 ? `${width}px` : '100%'}
        style={style}
      />
    </>
  );
};

export default RetryableImage;

