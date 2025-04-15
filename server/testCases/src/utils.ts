import type { TestCase, Challenge, TestCaseResults } from "./types";
import { VM } from "vm2";
import { API_BASE_URL } from "./constants";

const TESTCASE_RUNNER_TIMEOUT_MS = 2000; // 2 seconds

/**
 * Fetches and validates a challenge by ID
 * @param challengeId The ID of the challenge to fetch
 * @returns The challenge data or error
 */
export const fetchChallenge = async (challengeId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}`);

    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? "Challenge id not found"
          : `Failed to fetch challenge: ${response.statusText}`
      );
    }

    const data = await response.json();

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
export const runTestCase = (func: string, testCase: TestCase) => {
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
    } catch (error) {
      error = `Error in test execution: ${(error as Error).message}`;
    }

    if (error) return { error };

    const passed = JSON.stringify(userOutput) === JSON.stringify(output);

    const testResult = {
      id,
      input,
      expectedOutput: output,
      actualOutput: userOutput,
      passed,
      difficultyWeight,
    };

    return { result: testResult };
  } catch (error) {
    if (error instanceof Error) {
      return { error: `Error running test cases: ${error.message}` };
    } else {
      return { error: `Error running test cases: ${String(error)}` };
    }
  }
};

export const runTestCases = async (
  func: string,
  challengeId: Challenge["id"]
) => {
  const { challenge, error } = await fetchChallenge(challengeId);
  if (error) return { error };

  const { testCases } = challenge;
  const total = challenge.testCases.length;

  let totalDifficultyWeight = 0;
  let testCasesPassed = 0;

  const testCaseResults: TestCaseResults["results"] = [];

  try {
    for (const testCase of testCases) {
      const { result, error } = runTestCase(func, testCase);

      if (error) return { error };

      testCaseResults.push(result!);
      const { passed, difficultyWeight } = result!;

      if (passed) {
        totalDifficultyWeight += difficultyWeight;
        testCasesPassed++;
      }
    }

    const results = {
      passed: testCasesPassed,
      total,
      allPassed: testCasesPassed === total,
      testCaseResults,
      totalDifficultyWeight,
    };

    return { results };
  } catch (error) {
    return { error: `Error running test cases: ${(error as Error).message}` };
  }
};
