import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMatchContext } from '@/state/match/useMatchContext';
import { useMemo } from 'react';
import { Challenge } from 'shared-types/dist/challenges';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { CountdownTimer } from './CountdownTimer';
import rehypeRaw from 'rehype-raw';
import './markdownStyles.css';

export const ProblemStatement = () => {
  const { challenge: challengeCtx, newChallengeTime: newChallengeTimeCtx } =
    useMatchContext();
  const challengeId = useMemo(
    () => (challengeCtx ? challengeCtx.challengeId : undefined),
    [challengeCtx]
  );

  const fetchChallenge = async () => {
    if (!challengeId) throw 'query fn should not be enabled';
    const MATCH_URL = (challengeId: Challenge['id']) =>
      `http://localhost:3003/challenges/${challengeId}`;
    const { data } = await axios.get<Challenge>(MATCH_URL(challengeId));
    return data;
  };

  const { data: challenge } = useQuery<Challenge>({
    queryKey: ['problem-statement-lookup', challengeId],
    queryFn: fetchChallenge,
    enabled: !!challengeId,
  });

  const problemStatement = useMemo(() => {
    if (!challenge)
      return `# Default Problem Statement

- The file synchronization will keep one file of the workspace synced with one or multiple files in **Google Drive**, **Dropbox** or **GitHub**.
- Line breaks need to be properly formatted
- Lists need proper markdown syntax

> Before starting to sync files, you must link an account in the **Synchronize** sub-menu.

## Code Example
\`\`\`javascript
function example() {
  console.log("This is a code block");
}
\`\`\`

| Feature | Description |
|---------|-------------|
| File sync | Sync your files across devices |
| Storage | Access your files from anywhere |
| Sharing | Share with colleagues and friends |
`;
    return `
      ${challenge.title} ->

      ${challenge.description}
    `;
  }, [challenge]);

  return (
    <div className="relative h-full">
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {problemStatement}
        </ReactMarkdown>
      </div>

      <div className="absolute bottom-0">
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
