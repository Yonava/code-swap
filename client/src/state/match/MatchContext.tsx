import {
  createContext,
  useReducer,
  type ReactNode,
  useState,
  useEffect,
  useRef,
} from 'react';
import type { Match } from 'shared-types/dist/match-making';
import type { ClientSocketEvents, ClientSocketInstance, ServerSocketEvents } from 'shared-types/dist/socket-gateway';
import { getRandomName, isAlphaNumeric, useOnMount, useOnUnmount } from './utils';
import { useNavigate, useSearchParams } from 'react-router';
import { MatchSocketEventEmitters, useMatchSocketListeners, useMatchSocketEmitters, connectSocket } from './useMatchSocket';
import { MatchActionDispatcher, matchReducer, newStateDefaults } from './matchReducer';
import { MATCH_ACTIONS } from './MatchActions';
import { ClientChallenge } from 'shared-types/dist/game-management';

const IS_PROD = window.location.hostname !== 'localhost';
const SOCKET_URL = IS_PROD ? '/' : 'http://localhost:3000';

export type MatchPhase = 'matchMaking' | 'livePlay' | 'scoring' | 'inactive'

export type TMatchContext = {
  playerId: string,

  match: Match | undefined,
  challenge: ClientChallenge | undefined,
  scoreboard: undefined,

  matchPhase: MatchPhase,
  dispatch: MatchActionDispatcher,
} & MatchSocketEventEmitters

const getMatchPhase = (matchContext: TMatchContext): MatchPhase => {
  if (matchContext.scoreboard !== undefined) return 'scoring'
  if (matchContext.challenge !== undefined) return 'livePlay'
  if (matchContext.match !== undefined) return 'matchMaking'
  return 'inactive'
}

const DEFAULT_MATCH_DATA: TMatchContext = {
  ...newStateDefaults(),
  dispatch: () => { },
  joinMatch: () => { },
  createMatch: () => { },
  leaveMatch: () => { },
  matchReady: () => { },
};

export const matchCtxRef = { current: DEFAULT_MATCH_DATA };

const MatchContext = createContext<TMatchContext>(DEFAULT_MATCH_DATA);

export const MatchContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(matchReducer, DEFAULT_MATCH_DATA);
  const [socket, setSocket] = useState<ClientSocketInstance | null>(null);
  const socketEmitters = useMatchSocketEmitters(socket)
  const initListeners = useMatchSocketListeners()

  useOnUnmount(() => socket?.disconnect());

  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const ranSocketOnce = useRef(false)

  const connect = () => connectSocket<ServerSocketEvents, ClientSocketEvents>({
    url: SOCKET_URL,
    onConnected: (connectedSocket) => {
      console.log('socket connected')
      initListeners(connectedSocket)
      setSocket(connectedSocket);
    },
    onDisconnected: () => {
      console.log('socket disconnected')
      dispatch({ type: MATCH_ACTIONS.CLEAR_MATCH_DATA });
      setSocket(null);
    },
    onError: (err) => console.error('socket connection error', err),
  })

  useOnMount(() => {
    const newPlayerId = getRandomName();
    dispatch({ type: MATCH_ACTIONS.SET_PLAYER_ID, payload: newPlayerId })

    connect();
  });

  // TODO it would be nicer to move the basic match id validation logic to before connecting so we avoid hitting the registration service unnecessarily
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

    if (matchIdParam === 'new') return socketEmitters.createMatch(playerId)

    const [matchId, teamIndexStr] = matchIdParam.split('-')

    const validMatchId = matchId.length === 4 && isAlphaNumeric(matchId)
    if (!validMatchId) {
      console.warn('attempted to join match with invalid match id', matchId)
      nav('/')
      return
    }

    const teamIndex = Number(teamIndexStr);
    if (teamIndex !== 0 && teamIndex !== 1) {
      console.warn('attempted to join match with invalid team index', teamIndexStr)
      nav('/')
      return
    }

    socketEmitters.joinMatch(playerId, matchId, teamIndex)
    // eslint-disable-next-line
  }, [socket])

  const contextValue: TMatchContext = {
    playerId: state.playerId,
    match: state.match,
    challenge: state.challenge,
    scoreboard: state.scoreboard,
    matchPhase: getMatchPhase(state),
    dispatch,

    ...socketEmitters,
  };

  matchCtxRef.current = contextValue;

  return (
    <MatchContext.Provider value={contextValue}>
      {children}
    </MatchContext.Provider>
  );
};

export default MatchContext;