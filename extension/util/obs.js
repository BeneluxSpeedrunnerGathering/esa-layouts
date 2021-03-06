"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extension_1 = __importDefault(require("esa-layouts-shared/obs/extension"));
const nodecg_1 = require("./nodecg");
const obs = new extension_1.default(nodecg_1.get(), nodecg_1.get().bundleConfig.obs);
exports.default = obs;
