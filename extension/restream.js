"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("async");
const speedcontrol_util_1 = __importDefault(require("speedcontrol-util"));
const RestreamClass_1 = __importDefault(require("./RestreamClass"));
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const config = nodecg_1.get().bundleConfig;
const { restreamSources } = config.obs.names.sources;
const sc = new speedcontrol_util_1.default(nodecg_1.get());
const restream = new RestreamClass_1.default(nodecg_1.get(), true, nodecg_1.get().bundleConfig.restream);
if (config.restream.enable) {
    // Change streams when run changes but not on server (re)start.
    let init = false;
    sc.runDataActiveRun.on('change', async (newVal, oldVal) => {
        if (init && (newVal === null || newVal === void 0 ? void 0 : newVal.id) !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.id)) {
            nodecg_1.get().log.info('[Restream] Attempting to update channels from run change');
            const channels = (newVal === null || newVal === void 0 ? void 0 : newVal.teams.map((t) => (t.players[0] && t.players[0].social.twitch ? t.players[0].social.twitch : undefined))) || [];
            restream.updateMultipleInstances(channels);
        }
        init = true;
    });
    if (config.obs.enable) {
        const obsQ = async_1.queue(async () => {
            const channels = restream.instances.map((i) => i.channel);
            // If there is a 2nd channel loaded, treat this as 2 player.
            // Otherwise, make stream 1 fill the screen.
            if (channels[1] && Array.isArray(restreamSources) && restreamSources.length >= 2) {
                for (let i = 0; i < channels.length; i += 1) {
                    try {
                        await obs_1.default.configureSceneItem(config.obs.names.scenes.gameLayout, config.obs.names.sources.restreamSources[i], {
                            x: i === 0 ? 0 : 960,
                            width: 960,
                        }, {
                            left: i === 0 ? 0 : 960,
                            right: i === 1 ? 0 : 960,
                        }, true);
                    }
                    catch ( /* catch */_a) { /* catch */ }
                }
            }
            else {
                if (Array.isArray(restreamSources) && restreamSources[1]) {
                    try {
                        await obs_1.default.configureSceneItem(config.obs.names.scenes.gameLayout, restreamSources[1], undefined, undefined, false);
                    }
                    catch ( /* catch */_b) { /* catch */ }
                }
                try {
                    await obs_1.default.configureSceneItem(config.obs.names.scenes.gameLayout, Array.isArray(restreamSources) ? restreamSources[0] : restreamSources, undefined, undefined, true);
                }
                catch ( /* catch */_c) { /* catch */ }
            }
        }, 1);
        restream.instances.forEach((instance) => {
            instance.on('channelChange', (channel) => {
                obsQ.push(channel);
            });
        });
    }
}
