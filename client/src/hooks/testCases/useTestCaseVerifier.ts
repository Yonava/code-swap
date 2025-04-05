import { useState, useCallback, useMemo, useRef } from 'react';
import type {
  FunctionVerificationResult,
  RunTestCaseOptions,
  TestCase,
} from './types';
import { DEFAULT_RUN_TEST_CASE_OPTIONS } from './types';

/**
 * verifies a function against a series of test cases
 */
export const useVerifyFunction = <T extends (...args: any[]) => any>(
  functionToVerify: T | null,
  testCases: TestCase[],
  options: RunTestCaseOptions = {}
): FunctionVerificationResult => {
  const { maxTimeout } = { ...DEFAULT_RUN_TEST_CASE_OPTIONS, ...options };

  const [results, setResults] = useState<boolean[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [lastExecutedTestIndex, setLastExecutedTestIndex] =
    useState<number>(-1);

  const abortRef = useRef<AbortController | null>(null);

  const allPassed = useMemo(() => {
    return (
      hasRun && results.length === testCases.length && !results.includes(false)
    );
  }, [results, hasRun, testCases]);

  const createTimeoutPromise = useCallback((ms: number): Promise<never> => {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Test timed out after ${ms}ms`)), ms)
    );
  }, []);

  const runTestCase = useCallback(
    async (fn: T, testCase: TestCase, timeout: number): Promise<boolean> => {
      try {
        const resultPromise = Promise.resolve().then(() =>
          fn(...testCase.inputs)
        );
        const timeoutPromise = createTimeoutPromise(timeout);
        const result = await Promise.race([resultPromise, timeoutPromise]);

        return deepEqual(result, testCase.expectedOutput);
      } catch (error) {
        console.error(
          `Test case ${testCase.name || testCase.id} failed:`,
          error
        );
        return false;
      }
    },
    [createTimeoutPromise]
  );

  const runVerification = useCallback(async () => {
    if (!functionToVerify || testCases.length === 0) {
      setResults([]);
      setHasRun(true);
      setLastExecutedTestIndex(-1);
      return;
    }

    setIsRunning(true);
    setHasRun(false);
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const newResults: boolean[] = [];
    let lastIndex = -1;

    try {
      for (let i = 0; i < testCases.length; i++) {
        if (signal.aborted) return;

        lastIndex = i;
        const passed = await runTestCase(
          functionToVerify,
          testCases[i],
          maxTimeout
        );
        newResults.push(passed);

        setResults([...newResults]);

        if (!passed) break;
      }
    } catch (error) {
      console.error('Error during verification:', error);
    } finally {
      if (!signal.aborted) {
        setHasRun(true);
        setIsRunning(false);
        setLastExecutedTestIndex(lastIndex);
      }
    }
  }, [functionToVerify, testCases, maxTimeout, runTestCase]);

  const reset = useCallback(() => {
    setResults([]);
    setHasRun(false);
    setLastExecutedTestIndex(-1);
    abortRef.current?.abort();
  }, []);

  return {
    results,
    isRunning,
    hasRun,
    runVerification,
    reset,
    allPassed,
    passedCount: results.filter((r) => r).length,
    totalTests: testCases.length,
    lastExecutedTestIndex,
  };
};

/**
 * deep equality checker
 */
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object')
    return false;

  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (a instanceof Set && b instanceof Set) return deepEqual([...a], [...b]);
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, val] of a) {
      if (!b.has(key) || !deepEqual(val, b.get(key))) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
};
