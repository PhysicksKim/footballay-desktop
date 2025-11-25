import React, { useState } from 'react';
import styled from 'styled-components';

const TeamLogo = ({ logo, name }: { logo?: string; name: string }) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  return (
    <LogoImage
      src={logo}
      alt={name}
      onError={handleError}
      style={{ visibility: imageError ? 'hidden' : 'visible' }}
    />
  );
};

const LogoImage = styled.img`
  width: 35px;
  height: 35px;
  object-fit: contain;
`;

export default TeamLogo;

