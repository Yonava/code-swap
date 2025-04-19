import { TitledContainer } from "@/components/TitledContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import MatchContext from "./MatchContext";
import { MATCH_ACTIONS } from "./MatchActions";
import type { MatchSocket } from "./useSocket";

export const ExperimentalPanel = ({ socket }: { socket: MatchSocket }) => {
  const { matchId, playerId, dispatch } = useContext(MatchContext)

  const setPlayerId = (payload: string) => dispatch({
    type: MATCH_ACTIONS.SET_PLAYER_ID,
    payload
  })

  const setMatchId = (payload: string) => dispatch({
    type: MATCH_ACTIONS.SET_MATCH_ID,
    payload
  })

  return (
    <TitledContainer
      title="Experimental Stuff"
      width="25%"
    >
      <div className="p-2">
        <Input
          className='bg-white mb-2'
          placeholder='playerId'
          value={playerId}
          onChange={(ev) => setPlayerId(ev.target.value)}
        />
        <Input
          className='bg-white mb-2'
          placeholder='matchId'
          value={matchId}
          onChange={(ev) => setMatchId(ev.target.value)}
        />
        <div className="flex gap-1 flex-col">
          {
            !socket.isConnected &&
            <Button
              onClick={() => socket.connect()}
            >
              Connect
            </Button>
          }
          {
            socket.isConnected &&
            <Button
              disabled
              onClick={() => {
                console.log('socket connected');
              }}
            >
              Connected
            </Button>
          }
          {
            socket.isConnecting &&
            <Button
              disabled
            >
              Connecting...
            </Button>
          }
          <Button
            onClick={() => {
              socket.createMatch(playerId)
            }}
            disabled={!socket.isConnected}
          >
            Create Match
          </Button>
          <Button
            onClick={() => {
              socket.joinMatch(playerId, matchId)
            }}
            disabled={!socket.isConnected}
          >
            Join Match
          </Button>
          <Button
            onClick={socket.leaveMatch}
            disabled={!socket.isConnected}
          >
            Leave Match
          </Button>
        </div>
      </div>
    </TitledContainer>
  )
}