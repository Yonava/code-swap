import { isPlayerInMatch } from './matches';
import type { Match, Player, TeamIndex } from "./types";

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

export const isPlayerInMatch = async (playerId: Player['id']) => {
  const matchId = await getPlayerMatchId(playerId);
  return !!matchId;
}

export const createNewMatch = async (host: Player) => setMatch({
  id: getNewMatchId(),
  teams: [[host, undefined], [undefined, undefined]],
  hostId: host.id,
});

export const addPlayerToMatch = async ({ matchId, player, teamIndex }: {
  matchId: Match['id'],
  player: Player,
  teamIndex: TeamIndex,
}) => {
  const playerInMatch = await isPlayerInMatch(player.id);
  if (playerInMatch) return 'Player already in match';

  const match = await getMatch(matchId);
  if (!match) return 'Match not found';

  const index = match.teams[teamIndex].findIndex((slot) => slot === undefined);
  if (index === -1) return 'Match is full';

  match.teams[teamIndex][index] = player;
  return setMatch(match);
};

export const removePlayerFromMatch = async (matchId: Match['id'], playerId: Player['id']) => {

};
