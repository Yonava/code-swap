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
app.post("/test-function", async (req, res) => {
    const { language, functionString, challengeId } = req.body;
    if (!functionString || !language) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    const result = {
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
        }
        else {
            result.error = "The function string did not produce a valid function.";
        }
    }
    catch (error) {
        result.error = `Error creating function: ${error.message}`;
    }
    if (result.error) {
        res.status(400).json(result);
        return;
    }
    if (challengeId) {
        const challenge = await fetch(`http://localhost:${constants_1.CHALLENGE_LOCALHOST_PORT}/challenge/${challengeId}`);
        if (challenge.status === 404) {
            result.error = "Challenge id not found";
            res.status(404).json(result);
            return;
        }
        const { testCases } = await challenge.json();
        if (Array.isArray(testCases) && testCases.length > 0) {
            const testResults = [];
            let passedCount = 0;
            try {
                for (const testCase of testCases) {
                    const { input, output } = testCase;
                    const userOutput = result.func(...input);
                    const passed = JSON.stringify(userOutput) === JSON.stringify(output);
                    if (passed) {
                        passedCount++;
                    }
                    testResults.push({
                        expectedOutput: output,
                        actualOutput: userOutput,
                    });
                }
                result.testResults = {
                    passed: passedCount,
                    total: testCases.length,
                    allPassed: passedCount === testCases.length,
                    results: testResults,
                };
            }
            catch (error) {
                result.error = `Error running test cases: ${error.message}`;
            }
        }
        else {
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
    app.use(express_1.default.static(__dirname + "/public/"));
    app.get("*", (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    });
}
const PORT = Number(process.env.PORT) || constants_1.LOCALHOST_PORT;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
