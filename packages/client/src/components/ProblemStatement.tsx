import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMatchContext } from '@/state/match/useMatchContext';
import { useMemo } from 'react';
import { Challenge } from 'shared-types/dist/challenges';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { CountdownTimer } from './CountdownTimer';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
    if (!challenge) return 'no problem statement available';
    const { title, description, restrictions } = challenge;
    return `# ${title} \n ${description} ${
      restrictions.length > 0
        ? '\n ## Restrictions \n - ' + restrictions.join(' \n \n - ')
        : ''
    }`;
  }, [challenge]);

  return (
    <div className="relative h-full">
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  // @ts-expect-error not sure why this type doesnt match
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code
                  className={className}
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
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
