export type Season = {
    season: string;
}

export const SURFACES = ['grass', 'hard', 'clay', 'other']
export type Surface = typeof SURFACES[number]