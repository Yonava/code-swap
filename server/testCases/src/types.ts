export type CheckedTestCase = {
  expectedOutput: any;
  actualOutput: any;
};

export type UserFunctionResult = Partial<{
  func: Function;
  error: string;
  testResults: {
    passed: number;
    total: number;
    allPassed: boolean;
    results: CheckedTestCase[];
  };
}>;

export type ParseFunctionRequest = {
  language: "js" | "ts";
  functionString: string;
  challengeId?: string;
};
