import { http } from "./http";

export type TopPlayerRow = {
  player_id: number;
  matches_count: number;
  win_number: number;
  percentage_win: number;
  player_name?: string;
};

export function getTopPlayers(params?: { minMatches?: number; limit?: number }) {
  const q = new URLSearchParams();
  if (params?.minMatches != null) 
    q.set('min_matches', String(params.minMatches));
  if (params?.limit != null) 
    q.set('limit', String(params.limit));

  console.log(q)
  const suffix = q.toString() ? `?${q.toString()}` : '';
  return http<TopPlayerRow[]>(`/players/top${suffix}`);
}
