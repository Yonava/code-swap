"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenToChannel = exports.pubSubLogger = void 0;
const redis_1 = require("./redis");
const constants_1 = require("./constants");
const json_colorizer_1 = require("json-colorizer");
const PUB_SUB_PREFIX = '[Live Pub/Sub]';
const pubSubLogger = (...msg) => console.log(PUB_SUB_PREFIX, ...msg);
exports.pubSubLogger = pubSubLogger;
const { pub, sub } = redis_1.RedisClient.getInstance();
const logRequest = ({ channel, payload }) => {
    const c = constants_1.LOG_COLORS.channel(channel);
    const blob = (0, json_colorizer_1.colorize)(payload);
    (0, exports.pubSubLogger)(`Inbound request to ${c}\n${blob}`);
};
const logResponse = ({ channel, payload }) => {
    const c = constants_1.LOG_COLORS.channel(channel);
    const blob = (0, json_colorizer_1.colorize)(payload);
    (0, exports.pubSubLogger)(`Outbound response from ${c}\n${blob}`);
};
/**
 * listen and reply via redis pub/sub.
 * `fn` gives the parsed data from the message in the `from` channel (TDataIn)
 * and the result of that function (TDataOut) is piped into a message on the `replyTo` channel.
 * if the `fn` returns undefined, no message will be published
 */
const listenToChannel = (args) => sub.subscribe(args.from, async (message) => {
    try {
        logRequest({ channel: args.from, payload: message });
        const parsedMessage = JSON.parse(message);
        const result = await args.fn(parsedMessage);
        if (args.replyTo && result) {
            const payload = JSON.stringify(result);
            logResponse({ channel: args.replyTo, payload });
            await pub.publish(args.replyTo, payload);
        }
    }
    catch (error) {
        console.error(`Error processing message from ${args.from}:`, error);
    }
});
exports.listenToChannel = listenToChannel;
