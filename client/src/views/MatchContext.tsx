import {
  createContext,
  useReducer,
  type ReactNode,
  type Dispatch,
  useState,
  useEffect,
  useRef,
} from 'react';
import type { Match } from 'shared-types/dist/match-making';
import { MATCH_ACTIONS, type MatchActionNames } from './MatchActions';
import { ClientSocketInstance } from 'shared-types/dist/socket-gateway';
import { getRandomName, isAlphaNumeric } from './utils';
import { useNavigate, useSearchParams } from 'react-router';
import { io } from 'socket.io-client';
import { MatchSocketEventEmitters, registerSocketListeners, useMatchSocketEventEmitters } from './useMatchSocket';

const IS_PROD = window.location.hostname !== 'localhost';
const SOCKET_URL = IS_PROD ? '/' : 'http://localhost:3000';

export type MatchAction =
  | { type: MatchActionNames['SET_PLAYER_ID']; payload: string }
  | { type: MatchActionNames['SET_LIVE_MATCH']; payload: Match }
  | { type: MatchActionNames['CLEAR_MATCH_DATA'] };

export type MatchActionDispatcher = Dispatch<MatchAction>
export type MatchPhase = 'matchMaking' | 'livePlay' | 'scoring' | 'inactive'

export type TMatchContext = {
  playerId: string,

  match: Match | undefined,
  challenge: undefined,
  scoreboard: undefined,

  matchPhase: MatchPhase,
  dispatch: MatchActionDispatcher,
} & MatchSocketEventEmitters

const getMatchPhase = (matchContext: TMatchContext): MatchPhase => {
  if (matchContext.scoreboard !== undefined) return 'scoring'
  if (matchContext.challenge !== undefined) return 'matchMaking'
  if (matchContext.match !== undefined) return 'matchMaking'
  return 'inactive'
}

const newStateDefaults = () => ({
  playerId: '',
  match: undefined,
  challenge: undefined,
  scoreboard: undefined,
  matchPhase: 'inactive',
} as const satisfies Partial<TMatchContext>)

const DEFAULT_MATCH_DATA: TMatchContext = {
  ...newStateDefaults(),
  dispatch: () => { },
  joinMatch: () => { },
  createMatch: () => { },
  leaveMatch: () => { }
};

const MatchContext = createContext<TMatchContext>(DEFAULT_MATCH_DATA);

const matchReducer = (
  state: TMatchContext,
  action: MatchAction,
): TMatchContext => {
  switch (action.type) {
    case MATCH_ACTIONS.SET_PLAYER_ID:
      return { ...state, playerId: action.payload };
    case MATCH_ACTIONS.SET_LIVE_MATCH:
      return { ...state, match: action.payload };
    case MATCH_ACTIONS.CLEAR_MATCH_DATA:
      return { ...state, ...newStateDefaults() };
    default:
      return state;
  }
};

export const MatchContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(matchReducer, DEFAULT_MATCH_DATA);
  const [socket, setSocket] = useState<ClientSocketInstance | null>(null);
  const { leaveMatch, joinMatch, createMatch } = useMatchSocketEventEmitters(socket)

  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const ranOnce = useRef(false);
  const ranSocketOnce = useRef(false)

  const connect = () => {
    const socketInstance: ClientSocketInstance = io(SOCKET_URL);

    return new Promise<void>((resolve, reject) => {
      socketInstance.on('connect', () => {
        console.log('socket connected');
        registerSocketListeners(socketInstance, dispatch);
        setSocket(socketInstance);
        resolve();
      });

      socketInstance.on('connect_error', (err) => {
        console.error('socket connection error', err);
        reject(err);
      });

      socketInstance.on('disconnect', () => {
        console.log('socket disconnected');
        dispatch({ type: MATCH_ACTIONS.CLEAR_MATCH_DATA });
        setSocket(null);
      });
    });
  }

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;
    const newPlayerId = getRandomName();
    dispatch({ type: MATCH_ACTIONS.SET_PLAYER_ID, payload: newPlayerId })
    connect();

    return () => { socket?.disconnect() }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!socket) return
    if (ranSocketOnce.current) return
    ranSocketOnce.current = true

    const { playerId } = state
    const matchIdParam = searchParams.get("matchId");
    if (!matchIdParam) {
      console.warn('must have match id set in order to connect to match')
      nav('/')
      return
    }

    if (matchIdParam === 'new') return createMatch(playerId)

    const validMatchId = matchIdParam.length === 4 && isAlphaNumeric(matchIdParam)
    if (!validMatchId) {
      console.warn('attempted to join match with invalid match id', matchIdParam)
      nav('/')
      return
    }

    const teamIndexParam = searchParams.get("team");
    const teamIndex = Number(teamIndexParam);
    if (teamIndex !== 0 && teamIndex !== 1) {
      console.warn('attempted to join match with invalid team index', teamIndexParam)
      nav('/')
      return
    }

    joinMatch(playerId, matchIdParam, teamIndex)
    // eslint-disable-next-line
  }, [socket])

  const contextValue: TMatchContext = {
    playerId: state.playerId,
    match: state.match,
    challenge: state.challenge,
    scoreboard: state.scoreboard,
    matchPhase: getMatchPhase(state),
    dispatch,

    leaveMatch,
    joinMatch,
    createMatch,
  };

  return (
    <MatchContext.Provider value={contextValue}>
      {children}
    </MatchContext.Provider>
  );
};

export default MatchContext;