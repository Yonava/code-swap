import { RedisClient } from "./redis";
import { LOG_COLORS } from "./constants";
import { colorize } from "json-colorizer";
import { AnyChannel } from "shared-types";

const PUB_SUB_PREFIX = '[Live Pub/Sub]';

export const pubSubLogger = (...msg: unknown[]) => console.log(PUB_SUB_PREFIX, ...msg);

type ListenToInboundRequest<TDataIn, TDataOut = any> = {
  from: AnyChannel
  replyTo?: AnyChannel
  fn: (message: TDataIn) => Promise<TDataOut | undefined>;
}

const { pub, sub } = RedisClient.getInstance();

const logRequest = ({ channel, payload }: {
  channel: AnyChannel
  payload: string
}) => {
  const c = LOG_COLORS.channel(channel);
  const blob = colorize(payload)
  pubSubLogger(`Inbound request to ${c}\n${blob}`);
}

const logResponse = ({ channel, payload }: {
  channel: AnyChannel
  payload: string
}) => {
  const c = LOG_COLORS.channel(channel);
  const blob = colorize(payload)
  pubSubLogger(`Outbound response from ${c}\n${blob}`);
}

/**
 * listen and reply via redis pub/sub.
 * `fn` gives the parsed data from the message in the `from` channel (TDataIn)
 * and the result of that function (TDataOut) is piped into a message on the `replyTo` channel.
 * if the `fn` returns undefined, no message will be published
 */
export const listenToChannel = <TDataIn, TDataOut = any>(
  args: ListenToInboundRequest<TDataIn, TDataOut>
) => sub.subscribe(args.from, async (message) => {
  try {
    logRequest({ channel: args.from, payload: message });
    const parsedMessage = JSON.parse(message);
    const result = await args.fn(parsedMessage);
    if (args.replyTo && result) {
      const payload = JSON.stringify(result);
      logResponse({ channel: args.replyTo, payload });
      await pub.publish(args.replyTo, payload);
    }
  } catch (error) {
    console.error(`Error processing message from ${args.from}:`, error);
  }
});