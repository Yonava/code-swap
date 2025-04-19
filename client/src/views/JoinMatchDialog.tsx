import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useQuery } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { Match } from "shared-types/dist/match-making"
import axios from 'axios'

const SelectTeam = ({ match }: { match: Match }) => {
  const [team1, team2] = match.teams
  const [t1p1, t1p2] = team1
  const [t2p1, t2p2] = team2

  return (
    <div>
      <h2 className="mb-1 font-semibold">
        Pick A Team
      </h2>
      <div className="flex gap-1">
        <Button disabled={!!t1p1 && !!t1p2}>
          Join Team 1 [{t1p1?.id ?? 'Empty'}, {t1p2?.id ?? 'Empty'}]
        </Button>
        <Button disabled={!!t2p1 && !!t2p2}>
          Join Team 2 [{t2p1?.id ?? 'Empty'}, {t2p2?.id ?? 'Empty'}]
        </Button>
      </div>
    </div>
  )
}

const JoinActionDialog = ({ children }: { children: ReactNode }) => {
  const [matchId, setMatchId] = useState('')

  const fetchMatch = async () => {
    const MATCH_URL = (matchId: Match['id']) => `http://localhost:3001/matches/${matchId}`
    const { data } = await axios.get<Match | string>(MATCH_URL(matchId))
    if (typeof data === 'string') return 'match not found'
    return data
  }

  const { data: match, isLoading: matchLoading } = useQuery<Match | 'match not found'>({
    queryKey: ['join-match', matchId],
    queryFn: fetchMatch,
    enabled: matchId.length === 4,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join A Match 🤙</DialogTitle>
          <DialogDescription>
            What's the 4 digit match code?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <InputOTP
              value={matchId}
              onChange={setMatchId}
              maxLength={4}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {match && (match === 'match not found' ? <span className="text-red-500">Match not found</span> : <SelectTeam match={match} />)}
      </DialogContent>
    </Dialog>
  )
}

export default JoinActionDialog