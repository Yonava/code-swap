import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useMatchContext } from '@/state/match/useMatchContext';
import { useMemo } from 'react';
import { Challenge } from 'shared-types/dist/challenges';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { CountdownTimer } from './CountdownTimer';

export const ProblemStatement = () => {
  const { challenge: challengeCtx, newChallengeTime: newChallengeTimeCtx } = useMatchContext()
  const challengeId = useMemo(() => challengeCtx ? challengeCtx.challengeId : undefined, [challengeCtx])

  const fetchChallenge = async () => {
    if (!challengeId) throw 'query fn should not be enabled'
    const MATCH_URL = (challengeId: Challenge['id']) => `http://localhost:3003/challenges/${challengeId}`
    const { data } = await axios.get<Challenge>(MATCH_URL(challengeId))
    return data
  }

  const { data: challenge } = useQuery<Challenge>({
    queryKey: ['problem-statement-lookup', challengeId],
    queryFn: fetchChallenge,
    enabled: !!challengeId,
  })

  const problemStatement = useMemo(() => {
    if (!challenge) return 'no problem statement available'
    return `
      ${challenge.title} ->

      ${challenge.description}
    `
  }, [challenge])

  return (
    <div className="relative h-full">
      <div>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          children={problemStatement}
        />
      </div>

      <div className='absolute bottom-0'>
        {challengeCtx && !newChallengeTimeCtx && (
          <>
            <span>Hands Off Keyboard In:</span>
            <CountdownTimer timeAtZero={challengeCtx.endsAt} />
          </>
        )}
        {newChallengeTimeCtx && (
          <>
            <span>Editors Swapping In:</span>
            <CountdownTimer timeAtZero={newChallengeTimeCtx} />
          </>
        )}
      </div>
    </div>
  );
};
