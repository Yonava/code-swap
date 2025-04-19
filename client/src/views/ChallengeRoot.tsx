import { MatchContextProvider } from "./MatchContext";
import ChallengeView from "./ChallengeView";

const ChallengeRoot = () => {
  return (
    <MatchContextProvider>
      <ChallengeView />
    </MatchContextProvider>
  )
}

export default ChallengeRoot