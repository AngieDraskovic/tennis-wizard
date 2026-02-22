import type { Player } from "../model/Player";
import { http } from "./http";

export type TopPlayerResponse = {
  player_id: string;
  matches_count: number;
  win_number: number;
  percentage_win: number;
  player_name?: string;
};

export async function getTopPlayers(params?: { minMatches?: number; limit?: number }): Promise<Player[]>{
  const q = new URLSearchParams();
  if (params?.minMatches != null) 
    q.set('min_matches', String(params.minMatches));
  if (params?.limit == null) 
    q.set('limit', String(100));

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
