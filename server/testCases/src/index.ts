import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { CHALLENGE_LOCALHOST_PORT, LOCALHOST_PORT } from "./constants";
import { VM } from "vm2";
import { TestCaseResult, TestCase, ChallengeFetchResponse } from "./types";

dotenv.config();

const app = express();
const server = createServer(app);
app.use(express.json());

const MAX_TIMEOUT = 2000; // 2 seconds

/**
 * Fetches and validates a challenge by ID
 * @param challengeId The ID of the challenge to fetch
 * @returns The challenge data or error
 */
const fetchChallenge = async (challengeId: string): ChallengeFetchResponse => {
  try {
    const response = await fetch(
      `http://localhost:${CHALLENGE_LOCALHOST_PORT}/challenge/${challengeId}`
    );

    if (!response.ok) {
      return response.status === 404
        ? { error: "Challenge id not found" }
        : { error: `Failed to fetch challenge: ${response.statusText}` };
    }

    const data = await response.json();

    if (!Array.isArray(data.testCases) || data.testCases.length === 0) {
      return { error: "No test cases found for this challenge" };
    }

    return { challenge: data };
  } catch (error) {
    return { error: `Failed to fetch challenge: ${(error as Error).message}` };
  }
};

/**
 * Tests a function against a set of test cases
 * @param func The function to be tested
 * @param testCases the test cases to be run
 * @returns error or results
 */
const runTestCase = (
  func: string,
  testCase: TestCase
): TestCaseResult | { error: string } => {
  try {
    const { input, output, id, difficultyWeight } = testCase;

    const inputString = JSON.stringify(input);

    let userOutput: any;
    let error = null;

    try {
      const vm = new VM({
        timeout: MAX_TIMEOUT, // Automatically terminates if too slow
        sandbox: {},
      });
      const result = vm.run(`
          const func = (...args) => {${func}};
          func(...${inputString});
        `);

      userOutput = result;
    } catch (err: any) {
      error = `Error in test execution: ${err.message}`;
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

    return testResult;
  } catch (error) {
    return { error: `Error running test cases: ${(error as Error).message}` };
  }
};

// const runTestCases = (): TestCaseResults => {};

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public/"));
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/public/index.html");
  });
}

const PORT = Number(process.env.PORT) || LOCALHOST_PORT;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
