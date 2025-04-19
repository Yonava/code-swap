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

export type MatchContextType = {
  matchId: string;
  playerId: string;
  liveMatch: Match | undefined;
  dispatch: MatchActionDispatcher
};

const DEFAULT_MATCH_DATA: MatchContextType = {
  matchId: '',
  playerId: '',
  liveMatch: undefined,
  dispatch: () => { },
};

const MatchContext = createContext<MatchContextType>(DEFAULT_MATCH_DATA);

const matchReducer = (
  state: MatchContextType,
  action: MatchAction,
): MatchContextType => {
  switch (action.type) {
    case MATCH_ACTIONS.SET_MATCH_ID:
      return { ...state, matchId: action.payload };
    case MATCH_ACTIONS.SET_PLAYER_ID:
      return { ...state, playerId: action.payload };
    case MATCH_ACTIONS.SET_LIVE_MATCH:
      return { ...state, liveMatch: action.payload };
    case MATCH_ACTIONS.CLEAR_MATCH_DATA:
      return { ...state, matchId: '', playerId: '', liveMatch: undefined };
    default:
      return state;
  }
};

export const MatchContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(matchReducer, DEFAULT_MATCH_DATA);

  const contextValue: MatchContextType = {
    matchId: state.matchId,
    playerId: state.playerId,
    liveMatch: state.liveMatch,
    dispatch,
  };

  return (
    <MatchContext.Provider value={contextValue}>
      {children}
    </MatchContext.Provider>
  );
};

export default MatchContext;