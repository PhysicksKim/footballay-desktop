import { he } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';

interface RetryableImageProps {
  src: string;
  alt: string;
  className?: string;
  maxRetries?: number;
  height?: number;
  width?: number;
  style?: React.CSSProperties;
}

const RetryableImage: React.FC<RetryableImageProps> = ({
  src,
  alt,
  className = '',
  maxRetries = 5,
  height = -1,
  width = -1,
  style = undefined,
}) => {
  const [retryCount, setRetryCount] = useState<number>(0);

  // 새로운 이미지로 변경될 때 retryCount 초기화
  useEffect(() => {
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(retryCount + 1);
      }, 500);
    } else {
      console.log('이미지 로딩에 실패했습니다. src:', src);
    }
  };

  return (
    <img
      className={className}
      src={src + '?retry=' + retryCount}
      alt={alt}
      onError={handleError}
      height={height > 0 ? `${height}px` : '100%'}
      width={width > 0 ? `${width}px` : '100%'}
      style={style}
    />
  );
};

export default RetryableImage;
