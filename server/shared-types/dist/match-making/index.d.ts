export declare const MATCH_MAKING_CHANNEL_PREFIX = "matchMaking";
export declare const MATCH_MAKING_CHANNEL: {
    readonly REQUEST_JOIN_MATCH: "matchMaking.requestJoinMatch";
    readonly REQUEST_CREATE_MATCH: "matchMaking.requestCreateMatch";
    readonly LEAVE_MATCH: "matchMaking.leaveMatch";
    readonly RESPONSE_JOIN_MATCH: "matchMaking.responseJoinMatch";
    readonly RESPONSE_CREATE_MATCH: "matchMaking.responseCreateMatch";
    readonly PLAYER_JOINED: "matchMaking.playerJoined";
    readonly PLAYER_LEFT: "matchMaking.playerLeft";
    readonly MATCH_READY: "matchMaking.matchReady";
};
export type Player = {
    id: string;
    name: string;
    avatar: string;
    color: string;
};
export type Match = {
    id: string;
    hostId: Player['id'];
    teams: [[Player | undefined, Player | undefined], [Player | undefined, Player | undefined]];
};
export type FullMatch = {
    id: string;
    hostId: Player['id'];
    teams: [[Player, Player], [Player, Player]];
};
export type TeamIndex = 0 | 1;
export type JoinMatchRequest = {
    player: Player;
    matchId: Match['id'];
    teamIndex: TeamIndex;
};
export type JoinMatchResponseAccepted = {
    match: Match;
};
export type JoinMatchResponseRejected = {
    error: string;
};
export type CreateMatchRequest = {
    player: Player;
};
export type CreateMatchResponseAccepted = {
    match: Match;
};
export type CreateMatchResponseRejected = {
    error: string;
};
export type JoinMatchResponse = {
    playerId: Player['id'];
} & (JoinMatchResponseAccepted | JoinMatchResponseRejected);
export type CreateMatchResponse = {
    playerId: Player['id'];
} & (CreateMatchResponseAccepted | CreateMatchResponseRejected);
export type LeaveMatch = {
    playerId: Player['id'];
};
export type MatchReady = {
    playerId: Player['id'];
};
