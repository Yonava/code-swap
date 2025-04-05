import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { CHALLENGE_LOCALHOST_PORT, LOCALHOST_PORT } from "./constants";
import {
  CheckedTestCase,
  ParseFunctionRequest,
  UserFunctionResult,
} from "./types";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(express.json());

app.post("/test-function", async (req: Request, res: Response) => {
  const { language, functionString, challengeId } =
    req.body as ParseFunctionRequest;

  if (!functionString || !language) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const result: UserFunctionResult = {
    func: undefined,
    error: undefined,
    testResults: undefined,
  };

  try {
    if (!["js", "ts"].includes(language)) {
      result.error = "Unsupported language. Only 'js' or 'ts' are allowed.";
      res.status(400).json(result);
      return;
    }

    const func = new Function(functionString);

    if (typeof func === "function") {
      result.func = func;
    } else {
      result.error = "The function string did not produce a valid function.";
    }
  } catch (error) {
    result.error = `Error creating function: ${(error as Error).message}`;
  }

  if (result.error) {
    res.status(400).json(result);
    return;
  }

  if (challengeId) {
    const challenge = await fetch(
      `http://localhost:${CHALLENGE_LOCALHOST_PORT}/challenge/${challengeId}`
    );

    if (challenge.status === 404) {
      result.error = "Challenge id not found";
      res.status(404).json(result);
      return;
    }

    const { testCases } = await challenge.json();

    if (Array.isArray(testCases) && testCases.length > 0) {
      const testResults: CheckedTestCase[] = [];
      let passedCount = 0;

      try {
        for (const testCase of testCases) {
          const { input, output } = testCase;
          const userOutput = result.func!(...input);

          const passed = JSON.stringify(userOutput) === JSON.stringify(output);

          if (passed) {
            passedCount++;
          }

          testResults.push({
            expectedOutput: output,
            actualOutput: userOutput,
          } as any);
        }

        result.testResults = {
          passed: passedCount,
          total: testCases.length,
          allPassed: passedCount === testCases.length,
          results: testResults,
        };
      } catch (error) {
        result.error = `Error running test cases: ${(error as Error).message}`;
      }
    } else {
      result.error = "No test cases found for this challenge";
    }
    if (result.error) {
      res.status(400).json(result);
      return;
    }
  }
  res.status(200).json(result);
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
