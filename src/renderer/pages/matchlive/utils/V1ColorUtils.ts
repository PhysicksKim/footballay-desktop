import { PlayerColor } from '@app/v1/types/api';
import { colorSimilarity, SIMILARITY_THRESHOLD } from './TeamColor';

/**
 * hex 문자열(예: "e41e2c")을 CSS 색상(예: "#e41e2c")으로 변환
 */
export const hexStringToColor = (hex: string | null | undefined): string | null => {
  if (!hex) return null;
  // 이미 #로 시작하면 그대로 반환
  if (hex.startsWith('#')) return hex;
  // #를 추가하여 반환
  return `#${hex}`;
};

/**
 * 색상이 흰색인지 확인 (대소문자 무시)
 */
export const isWhite = (color: string | null | undefined): boolean => {
  if (!color) return false;
  const normalized = color.toLowerCase().replace('#', '');
  return normalized === 'ffffff';
};

/**
 * 색상이 유효한지 확인 (null이 아님)
 */
const isNonNullColor = (color: string | null | undefined): color is string => {
  return !!color;
};

/**
 * 색상이 유효한지 확인 (null이 아니고 흰색이 아님) - 막대바용
 */
const isValidColorForBar = (color: string | null | undefined): color is string => {
  return !!color && !isWhite(color);
};

/**
 * 홈팀 색상 선택 (통계 막대바용)
 * primary -> border -> number 순서로 검사, 흰색이면 다음 후보 사용
 * 모든 후보가 실패하면 검은색 반환
 */
export const selectHomeColor = (playerColor: PlayerColor | null | undefined): string => {
  if (!playerColor) return '#000000';

  const candidates = [
    playerColor.primary,
    playerColor.border,
    playerColor.number,
  ];

  for (const candidate of candidates) {
    const color = hexStringToColor(candidate);
    if (isValidColorForBar(color)) {
      return color;
    }
  }

  // 모든 후보가 실패하면 검은색
  return '#000000';
};

/**
 * 어웨이팀 색상 선택 (통계 막대바용)
 * 홈팀과 동일한 로직 + 홈팀 색상과 유사도 검사
 * 흰색은 막대바 배경과 충돌하므로 제외
 * 모든 후보가 실패하면 검은색, 그것도 유사하면 파란색이 들어간 흰색 사용
 */
export const selectAwayColor = (
  playerColor: PlayerColor | null | undefined,
  homeColor: string
): string => {
  if (!playerColor) {
    // 홈팀 색상과 검은색이 유사하면 파란색이 들어간 흰색 사용
    const blackColor = '#000000';
    if (colorSimilarity(homeColor, blackColor) < SIMILARITY_THRESHOLD) {
      return '#e0f2ff'; // 파란색이 들어간 흰색
    }
    return blackColor;
  }

  const candidates = [
    playerColor.primary,
    playerColor.border,
    playerColor.number,
  ];

  // 후보 색상들을 검사 (막대바용이므로 흰색 제외)
  for (const candidate of candidates) {
    const color = hexStringToColor(candidate);
    if (isValidColorForBar(color)) {
      // 홈팀 색상과 유사도 검사 (threshold보다 크면 충분히 다름)
      if (colorSimilarity(homeColor, color) > SIMILARITY_THRESHOLD) {
        return color;
      }
    }
  }

  // 모든 후보가 실패하거나 유사한 경우, 검은색 시도
  const blackColor = '#000000';
  if (colorSimilarity(homeColor, blackColor) > SIMILARITY_THRESHOLD) {
    return blackColor;
  }

  // 검은색도 유사하면 파란색이 들어간 흰색 사용
  return '#e0f2ff';
};

/**
 * 디스플레이용 색상 선택 (라인업/통계 팀이름 색상 막대용)
 * useAlternativeStrategy가 true이고 어웨이팀이면 홈팀과 유사도 검사하여 대안 색상 선택
 * useAlternativeStrategy가 false이면 무조건 primary 색상만 사용
 */
export const selectDisplayColor = (
  playerColor: PlayerColor | null | undefined,
  options?: {
    isAway?: boolean;
    homeColor?: string;
    useAlternativeStrategy?: boolean;
  }
): string | null => {
  if (!playerColor) return null;

  const { isAway = false, homeColor, useAlternativeStrategy = true } = options || {};

  // 무조건 primary만 사용하는 경우
  if (!useAlternativeStrategy) {
    const primaryColor = hexStringToColor(playerColor.primary);
    return isNonNullColor(primaryColor) ? primaryColor : null;
  }

  const candidates = [
    playerColor.primary,
    playerColor.border,
    playerColor.number,
  ];

  // 홈팀이거나 대안 전략 미사용 시: 흰색 아닌 첫 번째 색상 선택
  if (!isAway || !homeColor) {
    for (const candidate of candidates) {
      const color = hexStringToColor(candidate);
      if (isValidColorForBar(color)) {
        return color;
      }
    }
    return null;
  }

  // 어웨이팀: 홈팀과 유사도 검사, 흰색도 유효한 대안으로 고려
  for (const candidate of candidates) {
    const color = hexStringToColor(candidate);
    if (isNonNullColor(color)) {
      // 홈팀 색상과 충분히 다른지 검사
      if (colorSimilarity(homeColor, color) > SIMILARITY_THRESHOLD) {
        return color;
      }
    }
  }

  // 모든 후보가 홈팀과 유사하면 null 반환 (표시 안 함)
  return null;
};

