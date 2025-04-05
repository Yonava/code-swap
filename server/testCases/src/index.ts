import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { LOCALHOST_PORT } from "./constants";
import { ParseFunctionRequest, UserFunctionResult } from "./types";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(express.json());

app.post("/generate-function", (req: Request, res: Response) => {
  const { language, functionString }: ParseFunctionRequest = req.body;

  if (!functionString || !language) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const result: UserFunctionResult = {
    func: null,
    error: null,
  };

  try {
    if (!["js", "ts"].includes(language)) {
      result.error = "Unsupported language. Only 'js' or 'ts' are allowed.";
      res.status(400).json(result);
      return;
    }

    const func = new Function(functionString);

    if (typeof func === "function") {
      result.func = func();
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
