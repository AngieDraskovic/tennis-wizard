import type { Season } from "../model/Match";
import { http } from "./http";

export type SeasonsResponse = {
    seasons: Season[];
};


export async function getSeasons(){
  return http<SeasonsResponse>(`/matches/seasons`)
}