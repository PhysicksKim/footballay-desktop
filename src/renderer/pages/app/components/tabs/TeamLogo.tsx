import React, { useState } from 'react';

const TeamLogo = ({ logo, name }: { logo: string; name: string }) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  return (
    <img
      src={logo}
      alt={name}
      onError={handleError}
      style={{ visibility: imageError ? 'hidden' : 'visible' }}
    />
  );
};

export default TeamLogo;
