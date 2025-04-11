"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
require("./pub-sub/subscribers");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(constants_1.PORT, () => {
    console.log(`👩‍❤️‍💋‍👩 Match Making Live on Port ${constants_1.PORT}`);
});
