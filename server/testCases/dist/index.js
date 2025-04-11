"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const constants_1 = require("./constants");
const vm2_1 = require("vm2");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use(express_1.default.json());
const MAX_TIMEOUT = 2000; // 2 seconds
/**
 * Fetches and validates a challenge by ID
 * @param challengeId The ID of the challenge to fetch
 * @returns The challenge data or error
 */
const fetchChallenge = async (challengeId) => {
    try {
        const response = await fetch(`http://localhost:${constants_1.CHALLENGE_LOCALHOST_PORT}/challenge/${challengeId}`);
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
    }
    catch (error) {
        return { error: `Failed to fetch challenge: ${error.message}` };
    }
};
/**
 * Tests a function against a set of test cases
 * @param func The function to be tested
 * @param testCases the test cases to be run
 * @returns error or results
 */
const runTestCase = (func, testCase) => {
    try {
        const { input, output, id, difficultyWeight } = testCase;
        const inputString = JSON.stringify(input);
        let userOutput;
        let error = null;
        try {
            const vm = new vm2_1.VM({
                timeout: MAX_TIMEOUT, // Automatically terminates if too slow
                sandbox: {},
            });
            const result = vm.run(`
          const func = (...args) => {${func}};
          func(...${inputString});
        `);
            userOutput = result;
        }
        catch (err) {
            error = `Error in test execution: ${err.message}`;
        }
        if (error)
            return { error };
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
    }
    catch (error) {
        return { error: `Error running test cases: ${error.message}` };
    }
};
const runTestCases = async (func, challengeId) => {
    const { challenge, error } = await fetchChallenge(challengeId);
    if (error)
        return { error };
    const { testCases } = challenge;
    const total = challenge.testCases.length;
    let totalDifficultyWeight = 0;
    let testCasesPassed = 0;
    const testCaseResults = [];
    try {
        for (const testCase of testCases) {
            const { result, error } = runTestCase(func, testCase);
            if (error)
                return { error };
            testCaseResults.push(result);
            const { passed, difficultyWeight } = result;
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
    }
    catch (error) {
        return { error: `Error running test cases: ${error.message}` };
    }
};
app.post("/test", async (req, res) => {
    const { func, challengeId } = req.body;
    if (!func || !challengeId) {
        res.status(400).json({ error: "Function and challenge ID are required" });
        return;
    }
    const { results, error } = await runTestCases(func, challengeId);
    if (error) {
        res.status(500).json({ error });
        return;
    }
    res.json(results);
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
