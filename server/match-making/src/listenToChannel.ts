import { MATCH_MAKING_CHANNEL } from "shared-types/dist/match-making";
import { RedisClient } from "./redis";
import { LOG_COLORS } from "./constants";
import { colorize } from "json-colorizer";

const PUB_SUB_PREFIX = '[Live Pub/Sub]';

const pubSubLogger = (...msg: unknown[]) => console.log(PUB_SUB_PREFIX, ...msg);

type ChannelName = typeof MATCH_MAKING_CHANNEL[keyof typeof MATCH_MAKING_CHANNEL];

type ListenToInboundRequest<TDataIn, TDataOut = any> = {
  from: ChannelName
  replyTo?: ChannelName
  fn: (message: TDataIn) => Promise<TDataOut>;
}

const { pub, sub } = RedisClient.getInstance();

const logRequest = ({ channel, payload }: {
  channel: ChannelName
  payload: string
}) => {
  const c = LOG_COLORS.channel(channel);
  const blob = colorize(payload)
  pubSubLogger(`Inbound request to ${c}\n${blob}`);
}

const logResponse = ({ channel, payload }: {
  channel: ChannelName
  payload: string
}) => {
  const c = LOG_COLORS.channel(channel);
  const blob = colorize(payload)
  pubSubLogger(`Outbound response from ${c}\n${blob}`);
}

export const listenToChannel = <TDataIn, TDataOut = any>(
  args: ListenToInboundRequest<TDataIn, TDataOut>
) => sub.subscribe(args.from, async (message) => {
  try {
    logRequest({ channel: args.from, payload: message });
    const parsedMessage = JSON.parse(message);
    const result = await args.fn(parsedMessage);
    if (args.replyTo) {
      const payload = JSON.stringify(result);
      logResponse({ channel: args.replyTo, payload });
      await pub.publish(args.replyTo, payload);
    }
  } catch (error) {
    console.error(`Error processing message from ${args.from}:`, error);
  }
});