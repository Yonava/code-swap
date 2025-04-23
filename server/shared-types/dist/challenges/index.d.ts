export type TestCase<TInput = any[], TOutput = any> = {
    id: string;
    /**
     * arguments the unit test will be invoked with
     */
    input: TInput;
    /**
     * expected return value when running the test with `input` args
     */
    output: TOutput;
    /**
     * how hard is this test case to pass relative to
     * other test cases for the challenge question
     */
    difficultyWeight: number;
};
export type Challenge = {
    id: string;
    title: string;
    description: string;
    /**
     * the boiler plate code the challenge must load in with
     */
    startingCode?: string;
    /**
     * associated tests
     */
    testCases: TestCase[];
    /**
     * for listing constrains placed on the input, for example
     * @example 0 <= input.length <= 10,000
     */
    restrictions: string[];
};
export type ChallengeCodeUpdate = {
    /**
     * challenge id the code update request is for
     */
    challengeId: Challenge['id'];
    /**
     * the code the challenge submission will be updated with
     */
    code: string;
};
