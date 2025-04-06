import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { CHALLENGE_LOCALHOST_PORT, LOCALHOST_PORT } from "./constants";
import { Worker } from "worker_threads";
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

/**
 * Runs test cases against a function
 * @param func The function to test
 * @param testCases The test cases to run
 * @returns Test results or error
 */
const runTestCases = async (func: Function, testCases: any[]) => {
  try {
    const testResults: CheckedTestCase[] = [];
    let passedCount = 0;

    for (const testCase of testCases) {
      const { input, output } = testCase;

      const funcString = func.toString();
      const inputString = JSON.stringify(input);

      const workerScript = `
        const { parentPort } = require('worker_threads');
        
        // Disable access to dangerous Node.js APIs
        const disabledApis = [
          'fs', 'child_process', 'http', 'https', 'net', 
          'dgram', 'dns', 'crypto'
        ];
        
        // Override require to prevent loading dangerous modules
        const originalRequire = require;
        global.require = function(moduleName) {
          if (disabledApis.some(api => moduleName === api || moduleName.startsWith(api + '/'))) {
            throw new Error(\`Access to module "\${moduleName}" is not allowed\`);
          }
          return originalRequire(moduleName);
        };
        
        // Prevent access to process features
        const safeProcess = {
          env: {},
          cwd: () => '/sandbox',
          platform: process.platform,
          argv: [],
          argv0: process.argv0,
        };
        
        // Override global process object
        global.process = safeProcess;
        process = safeProcess;
        
        // Disable setTimeout/setInterval beyond a certain threshold
        const MAX_TIMEOUT = 1000; // 1 second max
        const originalSetTimeout = setTimeout;
        const originalSetInterval = setInterval;
        
        global.setTimeout = function(callback, ms, ...args) {
          if (ms > MAX_TIMEOUT) ms = MAX_TIMEOUT;
          return originalSetTimeout(callback, ms, ...args);
        };
        
        global.setInterval = function(callback, ms, ...args) {
          if (ms > MAX_TIMEOUT) ms = MAX_TIMEOUT;
          return originalSetInterval(callback, ms, ...args);
        };
        
        // Execute in try/catch to prevent global errors
        try {
          // Evaluate the function in this restricted context
          const func = ${funcString};
          
          // Parse the input
          const input = JSON.parse('${inputString.replace(/'/g, "\\'")}');
          
          // Execute with memory and time limits
          const result = func(...input);
          parentPort.postMessage({ result });
        } catch (error) {
          parentPort.postMessage({ error: error.message });
        }
      `;

      let userOutput;
      let error = null;
      let timedOut = false;

      try {
        userOutput = await runInWorker(workerScript, MAX_TIMEOUT);
      } catch (err) {
        if ((err as Error).message.includes("timed out")) {
          timedOut = true;
          error = "Test execution timed out after 2 seconds";
        } else {
          error = `Error in test execution: ${(err as Error).message}`;
        }
      }

      if (timedOut || error) {
        return {
          error: error || "Test execution error",
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
 * Helper function to run a script in a worker thread
 * @param script script to run
 * @param timeoutMs maximum time to wait for the script to finish
 * @returns Promise with the result of the script
 */
const runInWorker = (script: string, timeoutMs: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(script, { eval: true });

    const timeoutId = setTimeout(() => {
      worker.terminate();
      reject(new Error("Test execution timed out after " + timeoutMs + " ms"));
    }, timeoutMs);

    worker.on("message", (message) => {
      clearTimeout(timeoutId);

      if (message.error) {
        reject(new Error(message.error));
      } else {
        resolve(message.result);
      }

      worker.terminate();
    });

    worker.on("error", (err) => {
      clearTimeout(timeoutId);
      reject(err);
      worker.terminate();
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        clearTimeout(timeoutId);
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
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
