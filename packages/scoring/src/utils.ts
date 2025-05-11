import type {
  TestCase,
  Challenge,
  TestCaseResults,
  TestCaseOutcome,
} from "./types";
import { VM } from "vm2";

const TESTCASE_RUNNER_TIMEOUT_MS = 2000; // 2 seconds

/**
 * Fetches and validates a challenge by ID
 * @param challengeId The ID of the challenge to fetch
 * @returns The challenge data or error
 */
export const fetchChallenge = async (challengeId: string) => {
  console.log('getting challenges')
  try {
    const baseUrl = process.env.CHALLENGES_URL || 'http://localhost:3003'
    console.log(baseUrl)
    const CHALLENGE_URL = `${baseUrl}/challenges/`
    const reqUrl = `${CHALLENGE_URL}/${challengeId}`
    console.log(reqUrl)
    const response = await fetch(reqUrl);

    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? "Challenge id not found"
          : `Failed to fetch challenge: ${response.statusText}`
      );
    }

    const data: Challenge = await response.json();

    return { challenge: data };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: `Error running test cases: ${String(error)}` };
    }
  }
};

/**
 * Tests a function against a set of test cases
 * @param func The function to be tested
 * @param testCases the test cases to be run
 * @returns error or results
 */
export const runTestCase = (
  func: string,
  testCase: TestCase
): TestCaseOutcome => {
  try {
    const { input, output, id, difficultyWeight } = testCase;

    const inputString = JSON.stringify(input);

    let userOutput: any;
    let error;

    try {
      const vm = new VM({
        timeout: TESTCASE_RUNNER_TIMEOUT_MS, // automatically terminates if too slow
        sandbox: {},
      });
      const result = vm.run(`
          const func = (...args) => {${func}};
          func(...${inputString});
        `);

      userOutput = result;
    } catch (err) {
      if (err instanceof Error) {
        error = `Error running test case: ${err.message}`;
      } else {
        error = `Error running test case: ${String(err)}`;
      }
    }

    const passed = JSON.stringify(userOutput) === JSON.stringify(output);

    const testResult = {
      id,
      input,
      expectedOutput: output,
      actualOutput: userOutput,
      passed,
      difficultyWeight,
      error,
    };

    return { success: true, result: testResult };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: `Error running test case: ${error.message}`,
      };
    } else {
      return {
        success: false,
        error: `Error running test case: ${String(error)}`,
      };
    }
  }
};

export const runTestCases = async (
  func: string,
  testCases: Challenge["testCases"]
) => {
  let testCasesPassed = 0;

  const testCaseResults: TestCaseResults["results"] = [];

  for (const testCase of testCases) {
    const testCaseOutcome = runTestCase(func, testCase);

    const { success } = testCaseOutcome;

    if (success) {
      const { result } = testCaseOutcome;
      testCaseResults.push(result);
      const { passed } = result;

      if (passed) {
        testCasesPassed++;
      }
    }
  }

  return {
    passed: testCasesPassed,
    total: testCases.length,
    testCaseResults,
  };
};
