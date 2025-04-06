type ChallengeTestCase = {
  /**
   * The input to the function.
   */
  input: any[];
  /**
   * The expected output of the function.
   */
  output: any;
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
   * The function parameters for the challenge.
   */
  // parameters: string[];
  /**
   * The starting code for the challenge.
   */

  startingCode?: string;
  /**
   * The test cases for the challenge.
   */
  testCases: ChallengeTestCase[];
  /**
   * The restrictions for the challenge space.
   * @example 0 <= input.length <= 10,000
   */
  restrictions: string[];
};
