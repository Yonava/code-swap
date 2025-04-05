interface ChallengeTestCase {
  input: any[];
  output: any;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  startingCode?: string;
  testCases: ChallengeTestCase[];
  restrictions: string[];
}

export const challenges: Challenge[] = [
  {
    id: "match-array-elements",
    title: "Count Matching Unique Elements in Arrays",
    description: `Given an array of objects containing two properties “arr1” and “arr2” - output an array of integers such that the number at output[I] corresponds to the number of matching elements in input[I].arr1 and input[I].arr2. Do not count duplicates!`,
    startingCode: `function countMatches(input) {
        // your code here
      }`,
    testCases: [
      {
        input: [
          { arr1: [2, 55, 5], arr2: [2, 7, 1, 5] },
          { arr1: [4, 4], arr2: [4, 8, 4] },
          { arr1: [9, 5], arr2: [] },
        ],
        output: [2, 1, 0],
      },
    ],
    restrictions: [
      "0 <= input.length <= 10,000",
      "0 <= input[i].arr1 + input[i].arr2 <= 5,000",
    ],
  },
  {
    id: "filter-words-by-length",
    title: "Filter Words by Length Range",
    description: `Given a string of characters, remove all the words with characters above a certain length referred to as the upper limit or “ul” and words below the lower limit or “ll”. Output an array that contains the string with the remaining words as the first element, and a comma separated string of words removed as the second element.`,
    startingCode: `function filterWords(str, ll, ul) {
        // your code here
      }`,
    testCases: [
      {
        input: [
          "Welcome to code swap. A place to practice quick thinking and collaboration in software!",
          2,
          6,
        ],
        output: [
          "to code swap. place to quick and in!",
          "Welcome, A, practice, thinking, collaboration, software",
        ],
      },
    ],
    restrictions: [],
  },
  {
    id: "sum-prime-factors-progressive",
    title: "Progressive Sum of Prime Factors",
    description: `Given a list of integers, create an array where each element of the array is the sum of the prime factors of all of the numbers from elements 0 to i in the input array.`,
    startingCode: `function sumPrimeFactorsProgressive(arr) {
        // your code here
      }`,
    testCases: [
      {
        input: [2, 1, 6, 14],
        output: [3, 4, 10, 20],
      },
    ],
    restrictions: [],
  },
  {
    id: "composite-vs-prime",
    title: "Composite vs Prime Count",
    description: `Given a string of comma separated numbers, return “composite” if most of those numbers are composite, and “prime” otherwise.`,
    startingCode: `function majorityCompositeOrPrime(str) {
        // your code here
      }`,
    testCases: [],
    restrictions: [],
  },
] as const;
