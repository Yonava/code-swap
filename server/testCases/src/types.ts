export type CheckedTestCase = {
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
};

export type UserFunctionResult = Partial<{
  /**
   * The function created from the function string.
   */
  func: string;
  /**
   * The error message if the function string did not produce a valid function.
   */
  error: string;
  /**
   * The test results of the function against the test cases.
   */
  testResults: {
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
     * The results of each test case.
     */
    results: CheckedTestCase[];
  };
}>;

export type ParseFunctionRequest = {
  /**
   * The language of the function.
   */
  language: "js";
  /**
   * The function string to be parsed.
   */
  functionString: string;
  /**
   * The ID of the challenge to fetch test cases from.
   */
  challengeId?: string;
};
