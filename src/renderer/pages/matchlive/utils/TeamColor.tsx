const teamColorArray = [
  {
    id: 33,
    name: 'Manchester United',
    primary: '#DA291C',
    secondary: '#FBE122',
  },
  { id: 34, name: 'Newcastle', primary: '#241F20', secondary: '#41474d' },
  { id: 35, name: 'Bournemouth', primary: '#D71920', secondary: '#000000' },
  { id: 36, name: 'Fulham', primary: '#41474d', secondary: '#000000' },
  { id: 39, name: 'Wolves', primary: '#FDB913', secondary: '#000000' },
  { id: 40, name: 'Liverpool', primary: '#C8102E', secondary: '#41474d' },
  { id: 41, name: 'Southampton', primary: '#D71920', secondary: '#41474d' },
  { id: 42, name: 'Arsenal', primary: '#EF0107', secondary: '#023474' },
  { id: 45, name: 'Everton', primary: '#003399', secondary: '#41474d' },
  { id: 46, name: 'Leicester', primary: '#003090', secondary: '#41474d' },
  { id: 47, name: 'Tottenham', primary: '#132257', secondary: '#41474d' },
  { id: 48, name: 'West Ham', primary: '#7A263A', secondary: '#1BB1E7' },
  { id: 49, name: 'Chelsea', primary: '#034694', secondary: '#41474d' },
  { id: 50, name: 'Manchester City', primary: '#6CABDD', secondary: '#1C2C5B' },
  { id: 51, name: 'Brighton', primary: '#0057B8', secondary: '#41474d' },
  { id: 52, name: 'Crystal Palace', primary: '#1B458F', secondary: '#DA291C' },
  { id: 55, name: 'Brentford', primary: '#D00027', secondary: '#41474d' },
  { id: 57, name: 'Ipswich', primary: '#003090', secondary: '#41474d' },
  {
    id: 65,
    name: 'Nottingham Forest',
    primary: '#DD0000',
    secondary: '#41474d',
  },
  { id: 66, name: 'Aston Villa', primary: '#95BFE5', secondary: '#7A263A' },
];

const teamColorMap = new Map<number, { primary: string; secondary: string }>();

teamColorArray.forEach((team) => {
  teamColorMap.set(team.id, {
    primary: team.primary,
    secondary: team.secondary,
  });
});

const colorSimilarity = (color1: string, color2: string): number => {
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2),
  );
};

const SIMILARITY_THRESHOLD = 100;

const getTeamColor = (
  homeId: number,
  awayId: number,
): { homeColor: string; awayColor: string } => {
  const homeTeam = teamColorMap.get(homeId);
  const awayTeam = teamColorMap.get(awayId);

  if (!homeTeam || !awayTeam) {
    console.log(`팀 정보가 없습니다. homeId: ${homeId}, awayId: ${awayId}`);
  }
  const AlterColors = {
    alterOne: '#1c1c31',
    alterTwo: '#968d8d',
  };

  let homeColor, awayColor;
  if (!homeTeam) {
    homeColor = AlterColors.alterOne;
  } else {
    homeColor = homeTeam.primary;
  }
  if (!awayTeam) {
    awayColor = AlterColors.alterTwo;
  } else {
    awayColor = awayTeam.primary;
  }

  if (colorSimilarity(homeColor, awayColor) < SIMILARITY_THRESHOLD) {
    if (awayTeam) {
      awayColor = awayTeam?.secondary;
    } else {
      if (
        colorSimilarity(homeColor, AlterColors.alterOne) > SIMILARITY_THRESHOLD
      ) {
        awayColor = AlterColors.alterOne;
      } else {
        awayColor = AlterColors.alterTwo;
      }
    }
  }

  return { homeColor, awayColor };
};

export { getTeamColor, SIMILARITY_THRESHOLD, teamColorMap, colorSimilarity };
