import { GameManagementChannel } from "../game-management";
import { MatchMakingChannel } from "../match-making";
import { ScoringChannel } from "../scoring";

export type AnyChannel =
  | GameManagementChannel
  | MatchMakingChannel
  | ScoringChannel;
