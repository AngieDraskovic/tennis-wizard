import type { Player } from "../model/Player";
import { http } from "./http";

export type TopPlayerResponse = {
  player_id: string;
  matches_count: number;
  win_number: number;
  percentage_win: number;
  player_name?: string;
};

export type PlayerFiltersParams = {
  limit?: string;
  season?: string;
  surface?: string;
  minMatches?: number;
}

export async function getTopPlayers(params?: PlayerFiltersParams): Promise<Player[]>{
  const q = new URLSearchParams();
  console.log(params?.season)
  if (params?.minMatches) 
    q.set('min_matches', String(params.minMatches));
  if (params?.limit) 
    q.set('limit', params.limit);
  if (params?.season) 
    q.set('season', params.season);
  if (params?.surface) 
    q.set('surface', params.surface);


  const suffix = q.toString() ? `?${q.toString()}` : '';

  const res = await http<TopPlayerResponse[]>(`/players/top${suffix}`)
  
  return res.map(player => ({
    playerId: player.player_id,
    name: player.player_name ?? '',
    wins: player.win_number,
    matches: player.matches_count,
    winRate: player.percentage_win,
  }))
}
