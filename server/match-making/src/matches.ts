import type { Match, Player, TeamIndex } from "shared-types/dist/match-making";
import {
  deletePlayerMatchId,
  getMatch,
  getNewMatchId,
  getPlayerMatchId,
  setMatch,
  setPlayerMatchId
} from "./db/matches";

export const createNewMatch = async (host: Player) => {
  const existingMatchId = await getPlayerMatchId(host.id);
  if (existingMatchId) return `Player already in match ${existingMatchId}`;

  return setMatch({
    id: getNewMatchId(),
    teams: [[host, undefined], [undefined, undefined]],
    hostId: host.id,
  })
};

export const addPlayerToMatch = async ({ matchId, player, teamIndex }: {
  matchId: Match['id'],
  player: Player,
  teamIndex: TeamIndex,
}) => {
  const existingMatchId = await getPlayerMatchId(player.id);
  if (existingMatchId) return `Player already in match ${existingMatchId}`;

  const match = await getMatch(matchId);
  if (!match) return 'Match not found';

  const index = match.teams[teamIndex].findIndex((slot) => slot === undefined);
  if (index === -1) return 'Team is full';

  match.teams[teamIndex][index] = player;
  await setPlayerMatchId(player.id, matchId);

  return setMatch(match);
};

export const removePlayerFromMatch = async (matchId: Match['id'], playerId: Player['id']) => {
  const match = await getMatch(matchId);
  if (!match) return 'Match not found';

  const teamIndex = match.teams.findIndex((team) => team.find((player) => player?.id === playerId));
  if (teamIndex === -1) return 'Player not in match';

  const index = match.teams[teamIndex].findIndex((player) => player?.id === playerId);
  if (index === -1) return 'Player not in match';

  match.teams[teamIndex][index] = undefined;
  await deletePlayerMatchId(playerId);

  return setMatch(match);
};
