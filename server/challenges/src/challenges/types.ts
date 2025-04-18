type TestCase<TInput = any[], TOutput = any> = {
  /**
   * The ID of the test case.
   */
  id: string;
  /**
   * The input to the function.
   */
  input: TInput;
  /**
   * The expected output of the function.
   */
  output: TOutput;
  /**
   * The weighted difficulty score of the test case
   */
  difficultyWeight: number;
};

export type Challenge = {
  /**
   * The ID of the challenge.
   */
  id: string;
  /**
   * The title of the challenge.
   */
  title: string;
  /**
   * The description of the challenge.
   */
  description: string;
  /**
   * The starting code for the challenge.
   */
  startingCode?: string;
  /**
   * The test cases for the challenge.
   */
  testCases: TestCase[];
  /**
   * The restrictions for the challenge space.
   * @example 0 <= input.length <= 10,000
   */
  restrictions: string[];
};
