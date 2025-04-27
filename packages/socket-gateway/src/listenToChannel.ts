import { RedisClient } from "./redis";
import { LOG_COLORS } from "./constants";
import { colorize } from "json-colorizer";
import { AnyChannel } from "shared-types";

const PUB_SUB_PREFIX = '[Live Pub/Sub]';

export const pubSubLogger = (...msg: unknown[]) => console.log(PUB_SUB_PREFIX, ...msg);

type ListenToInboundRequest<TDataIn, TDataOut = any> = ({
  from: AnyChannel
  replyTo: AnyChannel
  fn: (message: TDataIn) => Promise<TDataOut> | TDataOut;
} | {
  from: AnyChannel
  fn: (message: TDataIn) => void;
})

const { pub, sub } = RedisClient.getInstance();

const logRequest = ({ channel, payload }: {
  channel: AnyChannel
  payload: string
}) => {
  const c = LOG_COLORS.channel(channel);
  const blob = colorize(payload)
  pubSubLogger(`Response from ${c}\n${blob}`);
}

const logResponse = ({ channel, payload }: {
  channel: AnyChannel
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
    if ('replyTo' in args) {
      const payload = JSON.stringify(result);
      logResponse({ channel: args.replyTo, payload });
      await pub.publish(args.replyTo, payload);
    }
  } catch (error) {
    console.error(`Error processing message from ${args.from}:`, error);
  }
});