export interface UserFunctionResult<T = any> {
  func: ((...args: any[]) => T) | null;
  error: string | null;
}

export interface ParseFunctionRequest {
  language: "js" | "ts";
  functionString: string;
}
