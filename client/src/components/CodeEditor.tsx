import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useMatchContext } from '@/state/match/useMatchContext';
import { useMemo } from 'react';

export const CodeEditor = () => {
  const { challenge, newChallengeTime } = useMatchContext()

  const betweenChallenges = useMemo(() => !!newChallengeTime, [newChallengeTime])
  const editorDisabled = useMemo(() => betweenChallenges || !challenge, [betweenChallenges, challenge])

  return (
    <CodeMirror
      style={{ height: '500px', opacity: editorDisabled ? 0.65 : 1 }}
      readOnly={editorDisabled}
      height="2000px"
      width="100%"
      theme="dark"
      extensions={[javascript()]}
      value={challenge?.code ?? 'no code available'}
    />
  );
};
