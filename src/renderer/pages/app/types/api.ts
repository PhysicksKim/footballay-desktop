// MetaData 타입
export interface MetaData {
  requestId: string;
  timestamp: string;
  status: string;
  responseCode: number;
  message: string;
  requestUrl: string;
  params: {
    fixtureId: string;
  };
  version: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  metaData: MetaData;
  response: T[] | null | undefined;
}
