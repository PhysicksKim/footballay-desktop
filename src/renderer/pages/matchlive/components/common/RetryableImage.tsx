import { he } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';

interface RetryableImageProps {
  src: string;
  alt: string;
  className?: string;
  maxRetries?: number;
  height?: number;
  width?: number;
}

const RetryableImage: React.FC<RetryableImageProps> = ({
  src,
  alt,
  className = '',
  maxRetries = 5,
  height = -1,
  width = -1,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    setCurrentSrc(src);
    setRetryCount(0); // 새로운 이미지로 변경될 때 retryCount 초기화
  }, [src]);

  const handleError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1);
      setCurrentSrc(`${src}?retry=${retryCount + 1}`); // 쿼리 파라미터로 캐시 우회를 시도
    } else {
      console.log('이미지 로딩에 실패했습니다. src:', src);
    }
  };

  return (
    <img
      className={className}
      src={currentSrc}
      alt={alt}
      onError={handleError}
      height={height > 0 ? `${height}px` : '100%'}
      width={width > 0 ? `${width}px` : '100%'}
    />
  );
};

export default RetryableImage;
