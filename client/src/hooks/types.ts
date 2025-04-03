/**
 * Type definition for a test case
 */
export type TestCase = {
  id: string;
  /**
   * name of the test case
   */
  name?: string;
  /**
   * inputs for the test case
   */
  inputs: unknown[];
  /**
   * expected output for the test case
   */
  expectedOutput: unknown;
};

/**
 * Interface for function verifier results
 */
export type FunctionVerificationResult = {
  /** Array of test results (true for pass, false for fail) */
  results: boolean[];
  /** Whether tests are currently running */
  isRunning: boolean;
  /** Whether tests have been run at least once */
  hasRun: boolean;
  /** Function to trigger verification */
  runVerification: () => void;
  /** Function to reset verification state */
  reset: () => void;
  /** Whether all tests passed */
  allPassed: boolean;
  /** Number of tests that passed */
  passedCount: number;
  /** Total number of tests */
  totalTests: number;
  /** Last executed test index (useful for identifying failure point) */
  lastExecutedTestIndex: number;
};

export type RunTestCaseOptions = {
  /**
   * Maximum time a test case can take to run before being considered failed (ms)
   */
  maxTimeout?: number;
};

export const DEFAULT_RUN_TEST_CASE_OPTIONS = {
  maxTimeout: 5000,
} as const;
