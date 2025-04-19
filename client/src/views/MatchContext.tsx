import {
  createContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { Match } from 'shared-types/dist/match-making';
import { MATCH_ACTIONS, type MatchActionNames } from './MatchActions';

export type MatchAction =
  | { type: MatchActionNames['SET_MATCH_ID']; payload: string }
  | { type: MatchActionNames['SET_PLAYER_ID']; payload: string }
  | { type: MatchActionNames['SET_LIVE_MATCH']; payload: Match }
  | { type: MatchActionNames['CLEAR_MATCH_DATA'] };

export type MatchActionDispatcher = Dispatch<MatchAction>
export type MatchPhase = 'matchMaking' | 'livePlay' | 'scoring' | 'inactive'

export type TMatchContext = {
  matchId: string,
  playerId: string,
  liveMatch: Match | undefined,
  liveChallenge: undefined,
  liveScoreboard: undefined,
  matchPhase: MatchPhase,
  dispatch: MatchActionDispatcher,
};

const getMatchPhase = (matchContext: TMatchContext): MatchPhase => {
  if (matchContext.liveScoreboard !== undefined) return 'scoring'
  if (matchContext.liveChallenge !== undefined) return 'matchMaking'
  if (matchContext.liveMatch !== undefined) return 'matchMaking'
  return 'inactive'
}

const newStateDefaults = () => ({
  matchId: '',
  playerId: '',
  liveMatch: undefined,
  liveChallenge: undefined,
  liveScoreboard: undefined,
  matchPhase: 'inactive',
} as const)

const DEFAULT_MATCH_DATA: TMatchContext = {
  ...newStateDefaults(),
  dispatch: () => { },
};

const MatchContext = createContext<TMatchContext>(DEFAULT_MATCH_DATA);

const matchReducer = (
  state: TMatchContext,
  action: MatchAction,
): TMatchContext => {
  switch (action.type) {
    case MATCH_ACTIONS.SET_MATCH_ID:
      return { ...state, matchId: action.payload };
    case MATCH_ACTIONS.SET_PLAYER_ID:
      return { ...state, playerId: action.payload };
    case MATCH_ACTIONS.SET_LIVE_MATCH:
      return { ...state, liveMatch: action.payload };
    case MATCH_ACTIONS.CLEAR_MATCH_DATA:
      return { ...state, ...newStateDefaults() };
    default:
      return state;
  }
};

export const MatchContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(matchReducer, DEFAULT_MATCH_DATA);

  const contextValue: TMatchContext = {
    matchId: state.matchId,
    playerId: state.playerId,
    liveMatch: state.liveMatch,
    liveChallenge: state.liveChallenge,
    liveScoreboard: state.liveScoreboard,
    matchPhase: getMatchPhase(state),
    dispatch,
  };

  return (
    <MatchContext.Provider value={contextValue}>
      {children}
    </MatchContext.Provider>
  );
};

export default MatchContext;