import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { CHALLENGE_LOCALHOST_PORT, LOCALHOST_PORT } from "./constants";
import { VM } from "vm2";
import {
  CheckedTestCase,
  ParseFunctionRequest,
  UserFunctionResult,
} from "./types";

dotenv.config();

const app = express();
const server = createServer(app);
app.use(express.json());

const MAX_TIMEOUT = 2000; // 2 seconds

/**
 * Creates a function from a string and validates it
 * @param functionString The string representation of the function
 * @param language The programming language
 * @returns Object containing function or error
 */
const createFunctionFromString = (
  functionString: string,
  language: string
): Pick<UserFunctionResult, "func" | "error"> => {
  if (language !== "js") {
    return { error: "Unsupported language. Only 'js' is allowed." };
  }

  try {
    const func = new Function(functionString);

    if (typeof func === "function") {
      return { func };
    } else {
      return { error: "The function string did not produce a valid function." };
    }
  } catch (error) {
    return { error: `Error creating function: ${(error as Error).message}` };
  }
};

/**
 * Fetches and validates a challenge by ID
 * @param challengeId The ID of the challenge to fetch
 * @returns The challenge data or error
 */
const fetchChallenge = async (challengeId: string) => {
  try {
    const response = await fetch(
      `http://localhost:${CHALLENGE_LOCALHOST_PORT}/challenge/${challengeId}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Challenge id not found" };
      }
      return { error: `Failed to fetch challenge: ${response.statusText}` };
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

const runTestCases = async (func: Function, testCases: any[]) => {
  try {
    const testResults: CheckedTestCase[] = [];
    let passedCount = 0;

    for (const testCase of testCases) {
      const { input, output } = testCase;

      const funcString = func.toString();
      const inputString = JSON.stringify(input);

      let userOutput: any;
      let error = null;

      try {
        const vm = new VM({
          timeout: MAX_TIMEOUT, // Automatically terminates if too slow
          sandbox: {},
        });

        const result = vm.run(`
          const func = ${funcString};
          func(...${inputString});
        `);

        userOutput = result;
      } catch (err: any) {
        error = `Error in test execution: ${err.message}`;
      }

      if (error) {
        return {
          error,
        };
      }

      const passed = JSON.stringify(userOutput) === JSON.stringify(output);
      if (passed) passedCount++;

      testResults.push({
        expectedOutput: output,
        actualOutput: userOutput,
        passed,
      });
    }

    return {
      testResults: {
        passed: passedCount,
        total: testCases.length,
        allPassed: passedCount === testCases.length,
        results: testResults,
      },
    };
  } catch (error) {
    return { error: `Error running test cases: ${(error as Error).message}` };
  }
};

/**
 * Handles function testing endpoint
 */
app.post("/test-function", async (req: Request, res: Response) => {
  const { language, functionString, challengeId } =
    req.body as ParseFunctionRequest;

  // Validate required fields
  if (!functionString || !language) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const { func, error: functionError } = createFunctionFromString(
    functionString,
    language
  );

  if (functionError) {
    res.status(400).json({ error: functionError });
    return;
  }

  const result: UserFunctionResult = {
    func,
    testResults: undefined,
  };

  if (challengeId) {
    const { challenge, error: challengeError } = await fetchChallenge(
      challengeId
    );

    if (challengeError) {
      const status = challengeError.includes("not found") ? 404 : 400;
      res.status(status).json({ error: challengeError });
      return;
    }

    const { testResults, error: testError } = await runTestCases(
      func!,
      challenge.testCases
    );

    if (testError) {
      res.status(400).json({ error: testError });
      return;
    }

    result.testResults = testResults;
  }

  res.status(200).json(result);
  return;
});

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
