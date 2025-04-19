import type { Match, Player, TeamIndex } from "shared-types/dist/match-making";
import {
  deleteMatch,
  deletePlayerMatchId,
  getMatch,
  getNewMatchId,
  getPlayerMatchId,
  matchDbLogger,
  setMatch,
  setPlayerMatchId
} from "./db/matches";
import { LOG_COLORS } from "./constants";

export const createNewMatch = async (host: Player) => {
  const existingMatchId = await getPlayerMatchId(host.id);
  if (existingMatchId) return `Player already in match ${existingMatchId}`;

  const id = getNewMatchId()
  await setPlayerMatchId(host.id, id);

  return setMatch({
    id,
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

const logHostSwitch = (matchId: Match['id'], oldHostId: Player['id'], newHostId: Player['id']) => {
  const oh = LOG_COLORS.playerId(oldHostId)
  const nh = LOG_COLORS.playerId(newHostId)
  const m = LOG_COLORS.matchId(matchId)
  matchDbLogger(`Host ${oh} left match ${m}. Promoting ${nh} to host`)
}

const logEmptyMatchCleanup = (matchId: Match['id'], lastPlayer: Player['id']) => {
  const lp = LOG_COLORS.playerId(lastPlayer)
  const m = LOG_COLORS.matchId(matchId)
  matchDbLogger(`Deleting ${m} as the last player, ${lp}, left`)
}

export const removePlayerFromMatch = async (matchId: Match['id'], playerId: Player['id']) => {
  const match = await getMatch(matchId);
  if (!match) return 'Match not found';

  const teamIndex = match.teams.findIndex((team) => team.find((player) => player?.id === playerId));
  if (teamIndex === -1) return 'Player not in match';

  const index = match.teams[teamIndex].findIndex((player) => player?.id === playerId);
  if (index === -1) return 'Player not in match';

  match.teams[teamIndex][index] = undefined;
  await deletePlayerMatchId(playerId);

  const isMatchEmpty = match.teams.flat().every((p) => !p)

  if (isMatchEmpty) {
    logEmptyMatchCleanup(matchId, playerId)
    await deleteMatch(matchId)
    return 'Match removed due to being empty'
  }

  if (match.hostId === playerId) {
    const newHost = match.teams.flat().find(Boolean)!
    match.hostId = newHost.id
    logHostSwitch(matchId, playerId, newHost.id)
  }

  return setMatch(match);
};
