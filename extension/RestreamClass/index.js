"use strict";
/* eslint-disable max-classes-per-file */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const uuid_1 = require("uuid");
const ws_1 = __importDefault(require("ws"));
class RestreamInstance extends events_1.EventEmitter {
    constructor(nodecg, address, key) {
        super();
        this.nodecg = nodecg;
        this.address = address;
        this.key = key;
        this.nodecg.log.debug(`[Restream, ${this.address}] Creating instance`);
        this.connect();
    }
    async sendMsg(msg) {
        return new Promise((res) => {
            this.nodecg.log.debug(`[Restream, ${this.address}] Sending mesage:`, msg);
            if (!this.ws || this.ws.readyState !== 1) {
                // throw new Error('WebSocket not connected');
                this.nodecg.log.warn(`[Restream, ${this.address}] `
                    + 'Cannot send mesage: WebSocket not connected');
                return;
            }
            const msgID = uuid_1.v4();
            this.ws.send(JSON.stringify(Object.assign(Object.assign({}, msg), { msgID })));
            const msgEvt = (data) => {
                const resp = JSON.parse(data.toString());
                if (this.ws && resp.type === 'Response' && resp.msgID === msgID) {
                    this.nodecg.log.debug(`[Restream, ${this.address}] `
                        + 'Received successful confirmation message');
                    this.ws.removeListener('message', msgEvt);
                    res(resp);
                }
            };
            if (this.ws) {
                this.ws.on('message', msgEvt);
            }
        });
    }
    connect() {
        this.nodecg.log.info(`[Restream, ${this.address}] Connecting`);
        this.ws = new ws_1.default(`ws://${this.address}/ws?key=${this.key}`);
        this.ws.once('open', () => {
            this.emit('connected');
            this.nodecg.log.info(`[Restream, ${this.address}] Connected`);
        });
        this.ws.on('error', (err) => {
            this.nodecg.log.warn(`[Restream, ${this.address}] Connection error`);
            this.nodecg.log.debug(`[Restream, ${this.address}] Connection error:`, err);
        });
        this.ws.once('close', () => {
            if (this.ws) {
                this.ws.removeAllListeners();
            }
            this.emit('disconnected');
            setTimeout(() => this.connect(), 5 * 1000);
            this.nodecg.log.warn(`[Restream, ${this.address}] Connection lost, retrying in 5 seconds`);
        });
        this.ws.on('message', (data) => {
            const msg = JSON.parse(data.toString());
            this.nodecg.log.debug(`[Restream, ${this.address}] Received mesage:`, msg);
            this.channel = msg.channel;
            this.emit('channelChange', msg.channel);
            if (msg.type === 'Update') {
                this.emit('update', msg);
            }
        });
    }
    async startStream(channel) {
        const msg = {
            type: 'Start',
            channel,
        };
        return this.sendMsg(msg);
    }
    async stopStream() {
        const msg = {
            type: 'Stop',
        };
        return this.sendMsg(msg);
    }
    async restartStream() {
        const msg = {
            type: 'Restart',
        };
        return this.sendMsg(msg);
    }
}
class Restream {
    constructor(nodecg, sc, config) {
        this.instances = [];
        this.nodecg = nodecg;
        this.restreamData = nodecg.Replicant('restreamData');
        for (let i = 0; i < this.restreamData.value.length; i += 1) {
            this.restreamData.value[i].connected = false;
        }
        if (config.enable) {
            this.nodecg.log.info('[Restream] Setting up');
            const cfgArr = (Array.isArray(config.instances)) ? config.instances : [config.instances];
            // Add defaults to the replicant if needed.
            if (this.restreamData.value.length < cfgArr.length) {
                const count = cfgArr.length - this.restreamData.value.length;
                const defaultData = {
                    connected: false,
                    overridden: false,
                };
                this.restreamData.value.push(...Array(count).fill(defaultData));
            }
            this.instances = cfgArr.map((cfg, i) => {
                const restream = new RestreamInstance(nodecg, cfg.address, cfg.key);
                restream.on('connected', () => { this.restreamData.value[i].connected = true; });
                restream.on('disconnected', () => { this.restreamData.value[i].connected = false; });
                restream.on('update', ({ channel, uuid: uuid_ }) => {
                    this.updateData(i, { channel, uuid: uuid_ });
                });
                return restream;
            });
            this.nodecg.listenFor('restreamOverride', async (data = {}, cb) => {
                var _a;
                const instance = this.instances[data.index || 0];
                const channel = data.channel || ((_a = this.restreamData.value[data.index || 0]) === null || _a === void 0 ? void 0 : _a.channel);
                if (instance && channel) {
                    const { channel: chan, uuid: id } = await instance.startStream(channel);
                    this.updateData(data.index || 0, {
                        overridden: true,
                        channel: chan,
                        uuid: id,
                    });
                    // Currently not checking for error msg here, so will always seem successful!
                    this.nodecg.log.info('[Restream] Successfully overridden stream '
                        + `${(data.index || 0) + 1}`);
                }
                if (cb && !cb.handled) {
                    cb();
                }
            });
            this.nodecg.listenFor('restreamRestart', async (data = {}, cb) => {
                const instance = this.instances[data.index || 0];
                if (instance) {
                    const { channel, uuid: id } = await instance.restartStream();
                    this.updateData(data.index || 0, { channel, uuid: id });
                    // Currently not checking for error msg here, so will always seem successful!
                    this.nodecg.log.info(`[Restream] Successfully restarted stream ${(data.index || 0) + 1}`);
                }
                if (cb && !cb.handled) {
                    cb();
                }
            });
            this.nodecg.listenFor('restreamStop', async (data = {}, cb) => {
                const instance = this.instances[data.index || 0];
                if (instance) {
                    const { channel, uuid: id } = await instance.stopStream();
                    this.updateData(data.index || 0, { channel, uuid: id });
                    // Currently not checking for error msg here, so will always seem successful!
                    this.nodecg.log.info(`[Restream] Successfully stopped stream ${(data.index || 0) + 1}`);
                }
                if (cb && !cb.handled) {
                    cb();
                }
            });
        }
    }
    /**
     * Takes a list of channels and will set them on that instance index if different,
     * or stop if needed.
     * @param channels List of channels.
     */
    updateMultipleInstances(channels) {
        this.instances.forEach(async (instance, i) => {
            const newChan = channels[i];
            if (!newChan) {
                const { channel, uuid: id } = await instance.stopStream();
                this.updateData(i, { channel, uuid: id });
                // Currently not checking for error msg here, so will always seem successful!
                this.nodecg.log.info(`[Restream] Successfully stopped stream ${i + 1}`);
            }
            else if (newChan && newChan !== instance.channel) {
                const { channel, uuid: id } = await instance.startStream(newChan);
                this.updateData(i, {
                    overridden: false,
                    channel,
                    uuid: id,
                });
                // Currently not checking for error msg here, so will always seem successful!
                this.nodecg.log.info(`[Restream] Successfully started stream ${i + 1}`);
            }
        });
    }
    updateData(i, opts) {
        var _a;
        this.nodecg.log.debug(`[Restream] Updating restreamData[${i}]:`, opts);
        this.restreamData.value[i] = {
            connected: this.restreamData.value[i].connected,
            overridden: (_a = opts.overridden) !== null && _a !== void 0 ? _a : this.restreamData.value[i].overridden,
            channel: opts.channel,
            uuid: opts.uuid || this.restreamData.value[i].uuid,
        };
    }
}
exports.default = Restream;
