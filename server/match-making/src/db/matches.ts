import type { Match, Player } from "shared-types/dist/match-making";

// mimics the behavior of a database
const matches = new Map<Match['id'], Match>();
const playerIdToMatchId = new Map<Player['id'], Match['id']>();

export const getNewMatchId: () => string = () => {
  const id = Math.random().toString(36).substring(2, 7);
  return matches.has(id) ? getNewMatchId() : id;
};

export const getMatch = async (matchId: Match['id']) => matches.get(matchId);
export const setMatch = async (match: Match) => (matches.set(match.id, match), match);
export const deleteMatch = async (matchId: Match['id']) => matches.delete(matchId);
export const getAllMatches = async () => Array.from(matches.values());

export const getPlayerMatchId = async (playerId: Player['id']) => playerIdToMatchId.get(playerId);
export const setPlayerMatchId = async (playerId: Player['id'], matchId: Match['id']) => {
  playerIdToMatchId.set(playerId, matchId);
  return matchId;
}
export const deletePlayerMatchId = async (playerId: Player['id']) => playerIdToMatchId.delete(playerId);
export const getAllPlayerIdMatchIdPairings = async () => Array.from(playerIdToMatchId.entries());