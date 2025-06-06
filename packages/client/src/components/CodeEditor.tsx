import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useMatchContext } from '@/state/match/useMatchContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Challenge } from 'shared-types/dist/challenges';
import { MATCH_ACTIONS } from '@/state/match/MatchActions';
import { Button } from './ui/button';

const NO_CODE_AVAILABLE = 'no code available';
const SUBMIT_INTERVAL_MS = 5000

const useUpdateCodeSubmission = (editorState: string, challengeId: Challenge['id'] | undefined) => {
  const { updateCodeSubmission, playerId, match } = useMatchContext();

  const editorStateRef = useRef(editorState)
  const lastSubmissionRef = useRef('');

  useEffect(() => {
    editorStateRef.current = editorState
  }, [editorState])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!challengeId || !match?.id) return clearInterval(interval)
      if (editorStateRef.current === lastSubmissionRef.current) return;
      updateCodeSubmission({
        code: editorStateRef.current,
        challengeId,
        playerId,
        isFinished: false,
        matchId: match.id,
      });
      lastSubmissionRef.current = editorStateRef.current;
    }, SUBMIT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [challengeId, match?.id, playerId, updateCodeSubmission]);

  return lastSubmissionRef
};

export const CodeEditor = () => {
  const { challenge, newChallengeTime, dispatch, updateCodeSubmission, playerId, match } = useMatchContext()

  const editorDisabled = useMemo(() => !!newChallengeTime || !challenge || challenge.isFinished, [challenge, newChallengeTime])

  const [codeEditorState, setCodeEditorState] = useState(NO_CODE_AVAILABLE)
  const lastSubmission = useUpdateCodeSubmission(codeEditorState, challenge?.challengeId)

  useEffect(() => {
    if (!challenge) return setCodeEditorState(NO_CODE_AVAILABLE)
    lastSubmission.current = challenge.code
    setCodeEditorState(challenge.code)
  }, [challenge, lastSubmission])

  return (
    <>
      <CodeMirror
        style={{ height: '500px', opacity: editorDisabled ? 0.65 : 1 }}
        readOnly={editorDisabled}
        height="2000px"
        width="100%"
        theme="dark"
        extensions={[javascript()]}
        value={codeEditorState}
        onChange={(code) => setCodeEditorState(code)}
      />

      <div className="absolute bottom-0 right-0 m-6">
        <Button
          disabled={challenge?.isFinished}
          className="bg-green-600"
          onClick={() => {
            if (!challenge || !match) return
            updateCodeSubmission({
              ...challenge,
              code: codeEditorState,
              isFinished: true,
              playerId,
              matchId: match.id,
            })
            dispatch({
              type: MATCH_ACTIONS.SET_CHALLENGE, payload: {
                ...challenge,
                code: codeEditorState,
                isFinished: true
              }
            })
          }}
        >Submit Code</Button>
      </div>
    </>
  );
};
