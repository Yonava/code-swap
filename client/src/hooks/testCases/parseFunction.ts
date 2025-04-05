// useDynamicFunction.ts
import { useState, useEffect } from 'react';
import type { UserFunctionResult } from './types';

/**
 * A hook that converts a string of code into an executable function
 *
 * @param codeString - String containing JavaScript function code
 * @param dependencies - Array of dependencies that should trigger a function re-parse
 * @returns Object containing the parsed function, error message if any, and loading state
 */
export const useParseFunction = <T = any>(
  codeString: string,
  dependencies: any[] = []
): UserFunctionResult<T> => {
  const [result, setResult] = useState<UserFunctionResult<T>>({
    func: null,
    error: null,
    isLoading: true,
  });

  const depsString = JSON.stringify(dependencies);

  useEffect(() => {
    let isMounted = true;

    const parseFunction = () => {
      if (isMounted) {
        setResult((prev) => ({ ...prev, isLoading: true }));
      }

      try {
        if (!codeString.trim()) {
          if (isMounted) {
            setResult({
              func: null,
              error: 'No code provided',
              isLoading: false,
            });
          }
          return;
        }

        const dynamicFunction = new Function('return ' + codeString)();

        if (typeof dynamicFunction !== 'function') {
          throw new Error('The provided code did not evaluate to a function');
        }

        if (isMounted) {
          setResult({
            func: dynamicFunction as (...args: any[]) => T,
            error: null,
            isLoading: false,
          });
        }
      } catch (err) {
        if (isMounted) {
          setResult({
            func: null,
            error:
              err instanceof Error ? err.message : 'An unknown error occurred',
            isLoading: false,
          });
        }
      }
    };

    parseFunction();

    return () => {
      isMounted = false;
    };
  }, [codeString, depsString]);

  return result;
};
