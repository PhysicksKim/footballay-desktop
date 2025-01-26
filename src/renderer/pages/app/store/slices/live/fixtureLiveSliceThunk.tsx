import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Urls from '@app/constants/Urls';
import {
  FixtureInfo,
  FixtureLiveStatus,
  FixtureLineup,
  FixtureEventState,
  FixtureStatistics,
} from '@src/types/FixtureIpc';
import { decode } from 'html-entities';

export const fetchFixtureInfo = createAsyncThunk<
  FixtureInfo,
  number,
  { rejectValue: string }
>(
  'fixture/fetchFixtureInfo',
  async (fixtureId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ response: FixtureInfo[] }>(
        `${Urls.apiUrl}${Urls.football.fixtureInfo}`,
        { params: { fixtureId } },
      );

      decodeInfoHtmlEntities(response.data.response[0]);
      return response.data.response[0];
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const fetchFixtureLiveStatus = createAsyncThunk<
  FixtureLiveStatus,
  number,
  { rejectValue: string }
>('fixture/fetchLiveStatus', async (fixtureId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ response: FixtureLiveStatus[] }>(
      `${Urls.apiUrl}${Urls.football.fixtureLiveStatus}`,
      { params: { fixtureId } },
    );

    return response.data.response[0];
  } catch (error: any) {
    return rejectWithValue(
      error.response ? error.response.data : error.message,
    );
  }
});

export type FetchFixtureLineupParams = {
  fixtureId: number;
  preferenceKey: string;
};

/**
 * "playerId": 307123,
 * "name": "N. O&apos;Reilly",
 * 예를 들어 위와 같은 선수 이름의 경우 &apos; 를 ' 로 변환해주어야 합니다. (어포스트로피)
 * 이를 위해 html-entities 라이브러리를 사용하기로 생각중입니다.
 * he 가 많이 언급되고 쓰이기는 하는데 6년전이 마지막 publish 이므로
 * html-entities 를 사용하는 것이 더 좋을 것 같습니다.
 * decode는 아래의 api 응답에서 각 문자열 항목들에 대해 decode 해주면 될 것 같다.
 */
export const fetchFixtureLineup = createAsyncThunk<
  FixtureLineup,
  FetchFixtureLineupParams,
  { rejectValue: string }
>(
  'fixture/fetchLineup',
  async (lineupParams: FetchFixtureLineupParams, { rejectWithValue }) => {
    try {
      console.log('fetchFixtureLineup parameters', lineupParams);

      const axiosResponse = await axios.get<{ response: FixtureLineup[] }>(
        `${Urls.apiUrl}${Urls.football.fixtureLineup}`,
        {
          params: {
            fixtureId: lineupParams.fixtureId,
            preferenceKey: lineupParams.preferenceKey,
          },
        },
      );

      const respData = axiosResponse.data.response[0];
      decodeLineupHtmlEntities(respData);
      return respData;
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const fetchFixtureEvents = createAsyncThunk<
  FixtureEventState,
  number,
  { rejectValue: string }
>('fixture/fetchEvents', async (fixtureId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ response: FixtureEventState[] }>(
      `${Urls.apiUrl}${Urls.football.fixtureEvents}`,
      { params: { fixtureId } },
    );

    decodeEventsHtmlEntities(response.data.response[0]);
    return response.data.response[0];
  } catch (error: any) {
    return rejectWithValue(
      error.response ? error.response.data : error.message,
    );
  }
});

export const fetchFixtureStatistics = createAsyncThunk<
  FixtureStatistics,
  number,
  { rejectValue: string }
>('fixture/fetchStatistics', async (fixtureId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get<{
      response: FixtureStatistics[];
      metaData: any;
    }>(`${Urls.apiUrl}${Urls.football.fixtureStatistics}`, {
      params: { fixtureId },
    });
    if (
      response.data?.metaData &&
      response.data?.metaData?.responseCode !== 200
    ) {
      return rejectWithValue(response.data.metaData.message);
    }
    if (!response.data.response[0]) {
      return rejectWithValue('No response data');
    }

    decodeStatisticsHtmlEntities(response.data.response[0]);
    return response.data.response[0];
  } catch (error: any) {
    return rejectWithValue(
      error.response ? error.response.data : error.message,
    );
  }
});

const decodeInfoHtmlEntities = (resp: FixtureInfo) => {
  resp.home.name = decode(resp?.home?.name);
  resp.away.name = decode(resp?.away?.name);
  resp.referee = decode(resp?.referee);
  resp.league.name = decode(resp?.league?.name);
};

const decodeLineupHtmlEntities = (resp: FixtureLineup) => {
  resp.lineup.home.teamName = decode(resp?.lineup?.home?.teamName);
  resp.lineup.away.teamName = decode(resp?.lineup?.away?.teamName);
  resp.lineup.home.players.forEach((player) => {
    player.name = decode(player?.name);
  });
  resp.lineup.away.players.forEach((player) => {
    player.name = decode(player?.name);
  });
};

const decodeEventsHtmlEntities = (resp: FixtureEventState) => {
  resp.events.forEach((event) => {
    if (event?.player) {
      event.player.name = decode(event?.player?.name);
    }
    if (event?.assist) {
      event.assist.name = decode(event?.assist?.name);
    }
    if (event?.detail) {
      event.detail = decode(event?.detail);
    }
    if (event?.comments) {
      event.comments = decode(event?.comments);
    }
  });
};

const decodeStatisticsHtmlEntities = (resp: FixtureStatistics) => {
  resp.home.playerStatistics.forEach((player) => {
    player.player.name = decode(player?.player?.name);
  });
  resp.away.playerStatistics.forEach((player) => {
    player.player.name = decode(player?.player?.name);
  });
};
