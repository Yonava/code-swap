import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useMatchContext } from "@/state/match/useMatchContext"

export const MatchScoreboard = () => {
  const { scoreboard } = useMatchContext()

  const LoadingState = () => (
    <span>Loading Stuff</span>
  )

  return (
    <Dialog open={scoreboard !== undefined}>
      <DialogContent>
        <DialogTitle>
          Scoring!
        </DialogTitle>
        {
          scoreboard === 'loading' && <LoadingState />
        }
        <div>
          {JSON.stringify(scoreboard, null, 2)}
        </div>
      </DialogContent>
    </Dialog>
  )
}