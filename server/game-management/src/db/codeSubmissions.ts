import { Challenge, Match } from 'shared-types'

export type ChallengeSetSubmissions = Record<Challenge['id'], string>
export type CodeSubmissionsDB = Map<Match['id'], [ChallengeSetSubmissions, ChallengeSetSubmissions]>

export const codeSubmissions: CodeSubmissionsDB = new Map()