import { FetchFixturesParams, FixtureMode } from '@app/v1/api/endpoints';
import { DEFAULT_TIMEZONE, getTodayDateString, isValidDateInput } from './date';

export const FIXTURE_MODES: FixtureMode[] = ['previous', 'exact', 'nearest'];

export interface NormalizedFixtureParams extends FetchFixturesParams {
  date: string;
  timezone: string;
  mode: FixtureMode;
}

const isMode = (value?: string): value is FixtureMode =>
  !!value && (FIXTURE_MODES as string[]).includes(value);

export const normalizeFixtureParams = (
  params: FetchFixturesParams
): NormalizedFixtureParams => {
  const timezone = params.timezone?.trim() || DEFAULT_TIMEZONE;
  const mode = isMode(params.mode) ? params.mode : 'exact';
  const date = isValidDateInput(params.date)
    ? (params.date as string)
    : getTodayDateString(timezone);
  return {
    leagueUid: params.leagueUid,
    date,
    mode,
    timezone,
  };
};

