import { Match } from 'shared-types/dist/match-making';
import { MATCH_ACTIONS, type MatchActionNames } from './MatchActions';
import { type Dispatch } from 'react';
import type { TMatchContext } from './MatchContext';
import { ClientChallenge } from 'shared-types/dist/game-management';

export type MatchActionDispatcher = Dispatch<MatchAction>

export type MatchAction =
  | { type: MatchActionNames['SET_PLAYER_ID']; payload: string }
  | { type: MatchActionNames['SET_LIVE_MATCH']; payload: Match }
  | { type: MatchActionNames['SET_CHALLENGE']; payload: ClientChallenge }
  | { type: MatchActionNames['SET_NEW_CHALLENGE_TIME']; payload: number | undefined }
  | { type: MatchActionNames['SET_MATCH_END_TIME']; payload: number }
  | { type: MatchActionNames['CLEAR_MATCH_DATA'] };

export const newStateDefaults = () => ({
  playerId: '',
  match: undefined,
  challenge: undefined,
  newChallengeTime: undefined,
  matchEndTime: undefined,
  scoreboard: undefined,
  matchPhase: 'inactive',
} as const satisfies Partial<TMatchContext>)

export const matchReducer = (
  state: TMatchContext,
  action: MatchAction,
): TMatchContext => {
  switch (action.type) {
    case MATCH_ACTIONS.SET_PLAYER_ID:
      return { ...state, playerId: action.payload };
    case MATCH_ACTIONS.SET_LIVE_MATCH:
      return { ...state, match: action.payload };
    case MATCH_ACTIONS.SET_CHALLENGE:
      return { ...state, challenge: action.payload }
    case MATCH_ACTIONS.SET_NEW_CHALLENGE_TIME:
      return { ...state, newChallengeTime: action.payload }
    case MATCH_ACTIONS.SET_MATCH_END_TIME:
      return { ...state, matchEndTime: action.payload }
    case MATCH_ACTIONS.CLEAR_MATCH_DATA:
      return { ...state, ...newStateDefaults() };
    default:
      return state;
  }
};