import React, { useState } from 'react';

interface RetryableImageProps {
  src: string;
  alt: string;
  maxRetries?: number;
}

const RetryableImage: React.FC<RetryableImageProps> = ({
  src,
  alt,
  maxRetries = 3,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [retryCount, setRetryCount] = useState<number>(0);

  const handleError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1);
      setCurrentSrc(`${src}?retry=${retryCount + 1}`); // 쿼리 파라미터로 캐시 우회를 시도
    } else {
      console.log('이미지 로딩에 실패했습니다.');
    }
  };

  return <img src={currentSrc} alt={alt} onError={handleError} />;
};

export default RetryableImage;
