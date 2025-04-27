import { Player, TeamIndex } from "shared-types"

export type PlayerToTeamDB = Map<Player['id'], TeamIndex>
export const playerToTeam: PlayerToTeamDB = new Map()