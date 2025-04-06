"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const constants_1 = require("./constants");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use(express_1.default.json());
/**
 * Creates a function from a string and validates it
 * @param functionString The string representation of the function
 * @param language The programming language
 * @returns Object containing function or error
 */
const createFunctionFromString = (functionString, language) => {
    if (language !== "js") {
        return { error: "Unsupported language. Only 'js' is allowed." };
    }
    try {
        const func = new Function(functionString);
        if (typeof func === "function") {
            return { func };
        }
        else {
            return { error: "The function string did not produce a valid function." };
        }
    }
    catch (error) {
        return { error: `Error creating function: ${error.message}` };
    }
};
/**
 * Fetches and validates a challenge by ID
 * @param challengeId The ID of the challenge to fetch
 * @returns The challenge data or error
 */
const fetchChallenge = async (challengeId) => {
    try {
        const response = await fetch(`http://localhost:${constants_1.CHALLENGE_LOCALHOST_PORT}/challenge/${challengeId}`);
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
    }
    catch (error) {
        return { error: `Failed to fetch challenge: ${error.message}` };
    }
};
/**
 * Runs test cases against a function
 * @param func The function to test
 * @param testCases The test cases to run
 * @returns Test results or error
 */
const runTestCases = (func, testCases) => {
    try {
        const testResults = [];
        let passedCount = 0;
        for (const testCase of testCases) {
            const { input, output } = testCase;
            const userOutput = func(...input);
            const passed = JSON.stringify(userOutput) === JSON.stringify(output);
            if (passed)
                passedCount++;
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
    }
    catch (error) {
        return { error: `Error running test cases: ${error.message}` };
    }
};
/**
 * Handles function testing endpoint
 */
app.post("/test-function", async (req, res) => {
    const { language, functionString, challengeId } = req.body;
    // Validate required fields
    if (!functionString || !language) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    const { func, error: functionError } = createFunctionFromString(functionString, language);
    if (functionError) {
        res.status(400).json({ error: functionError });
        return;
    }
    const result = {
        func,
        testResults: undefined,
    };
    if (challengeId) {
        const { challenge, error: challengeError } = await fetchChallenge(challengeId);
        if (challengeError) {
            const status = challengeError.includes("not found") ? 404 : 400;
            res.status(status).json({ error: challengeError });
            return;
        }
        const { testResults, error: testError } = runTestCases(func, challenge.testCases);
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
    app.use(express_1.default.static(__dirname + "/public/"));
    app.get("*", (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    });
}
const PORT = Number(process.env.PORT) || constants_1.LOCALHOST_PORT;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
