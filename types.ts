
export interface Song {
  title: string;
  artist: string;
  isKorean: boolean;
  reason: string;
  genre: string;
}

export interface RecommendationResponse {
  songs: Song[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
