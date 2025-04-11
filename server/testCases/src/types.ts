/**
 * Result for a single test case
 */
export type TestCaseResult = {
  /**
   * The ID of the test case.
   */
  id: string;
  /**
   * The input to the test case.
   */
  input: any;
  /**
   * The expected output of the test case.
   */
  expectedOutput: any;
  /**
   * The actual output of the test case.
   */
  actualOutput: any;
  /**
   * Whether the test case passed or failed.
   */
  passed: boolean;
  /**
   * The weighted difficulty score of the test case
   */
  difficultyWeight: number;
};

/**
 * Result for all test cases in a challenge
 */
export type TestCaseResults = {
  /**
   * The number of test cases that passed.
   */
  passed: number;
  /**
   * The total number of test cases.
   */
  total: number;
  /**
   * Whether all test cases passed.
   */
  allPassed: boolean;
  /**
   * The results of each individual test case.
   */
  results: TestCaseResult[];
  /**
   * The sum of weights of all *PASSED* test cases.
   */
  totalDifficultyWeight: number;
};

export type TestCase = {
  /**
   * The ID of the test case.
   */
  id: string;
  /**
   * The input to the function.
   */
  input: any[];
  /**
   * The expected output of the function.
   */
  output: any;
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
