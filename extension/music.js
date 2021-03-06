"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const stream_1 = require("stream");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const config = nodecg_1.get().bundleConfig.music;
const auth = (config.username && config.password)
    ? `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}` : undefined;
const headers = auth ? {
    Authorization: auth,
} : undefined;
let positionTimestamp = 0;
let positionInitial = 0;
let positionInterval;
/**
 * Make a request to the Beefweb foobar2000 plugin.
 * @param method Required HTTP method.
 * @param endpoint The endpoint to request.
 */
async function request(method, endpoint) {
    nodecg_1.get().log.debug(`[Music] API ${method.toUpperCase()} request processing on ${endpoint}`);
    const resp = await node_fetch_1.default(`http://${config.address}/api${endpoint}`, {
        method,
        headers,
    });
    if (![200, 204].includes(resp.status)) {
        const text = await resp.text();
        nodecg_1.get().log.debug(`[Music] API ${method.toUpperCase()} request error on ${endpoint}:`, text);
        throw new Error(text);
    }
    nodecg_1.get().log.debug(`[Music] API ${method.toUpperCase()} request successful on ${endpoint}`);
    return resp;
}
/**
 * Updates the stored position of the current track every second.
 */
function updatePosition() {
    if (replicants_1.musicData.value.track && replicants_1.musicData.value.playing) {
        replicants_1.musicData.value.track.position = ((Date.now() - positionTimestamp) / 1000) + positionInitial;
    }
    else {
        clearInterval(positionInterval);
    }
}
/**
 * Sends a "play" command to foobar2000.
 */
async function play() {
    try {
        await request('post', '/player/play');
        nodecg_1.get().log.info('[Music] Successfully playing');
    }
    catch (err) {
        nodecg_1.get().log.warn('[Music] Error playing');
        nodecg_1.get().log.debug('[Music] Error playing:', err);
    }
}
/**
 * Sends a "pause" command to foobar2000.
 */
async function pause() {
    try {
        await request('post', '/player/pause');
        nodecg_1.get().log.info('[Music] Successfully paused');
    }
    catch (err) {
        nodecg_1.get().log.warn('[Music] Error pausing');
        nodecg_1.get().log.debug('[Music] Error pausing:', err);
    }
}
/**
 * Sets up the constant connection to foobar2000.
 */
async function setup() {
    try {
        nodecg_1.get().log.info('[Music] Attempting connection');
        const resp = await request('get', '/query/updates?player=true&trcolumns=%artist%,%title%');
        replicants_1.musicData.value.connected = true;
        nodecg_1.get().log.info('[Music] Connection successful');
        const readable = stream_1.Readable.from(resp.body);
        readable.on('data', (chunk) => {
            let msg;
            try {
                const cleaned = chunk.toString().slice(6).replace(/(\r\n|\n|\r)/gm, '');
                msg = JSON.parse(cleaned);
            }
            catch (err) {
                nodecg_1.get().log.warn('[Music] Error parsing message on connection');
                nodecg_1.get().log.debug('[Music] Error parsing message on connection:', err);
            }
            if (!msg) {
                return;
            }
            if (msg.player) {
                clearInterval(positionInterval);
                replicants_1.musicData.value.playing = msg.player.playbackState === 'playing';
                if (msg.player.playbackState !== 'stopped') {
                    if (msg.player.activeItem.duration > 0) {
                        replicants_1.musicData.value.track = {
                            artist: msg.player.activeItem.columns[0] || undefined,
                            title: msg.player.activeItem.columns[1] || undefined,
                            position: msg.player.activeItem.position,
                            duration: msg.player.activeItem.duration,
                        };
                        if (msg.player.playbackState === 'playing') {
                            positionInitial = msg.player.activeItem.position;
                            positionTimestamp = Date.now();
                            positionInterval = setInterval(updatePosition, 1000);
                        }
                    }
                }
                else {
                    delete replicants_1.musicData.value.track;
                }
            }
        });
        readable.on('close', () => {
            nodecg_1.get().log.warn('[Music] Connection closed');
        });
        readable.on('error', (err) => {
            nodecg_1.get().log.warn('[Music] Connection error');
            nodecg_1.get().log.debug('[Music] Connection error:', err);
        });
        readable.on('end', () => {
            replicants_1.musicData.value.connected = false;
            nodecg_1.get().log.warn('[Music] Connection ended, retrying in 5 seconds');
            setTimeout(setup, 5 * 1000);
        });
    }
    catch (err) {
        replicants_1.musicData.value.connected = false;
        nodecg_1.get().log.warn('[Music] Connection failed, retrying in 5 seconds');
        nodecg_1.get().log.debug('[Music] Connection failed, retrying in 5 seconds:', err);
        setTimeout(setup, 5 * 1000);
    }
}
// Listen to OBS transitions to play/pause correctly.
obs_1.default.conn.on('TransitionBegin', (data) => {
    if (data['to-scene']) {
        if (data['to-scene'].endsWith('[M]')) {
            play();
        }
        else {
            pause();
        }
    }
});
replicants_1.musicData.value.connected = false;
if (config.enable) {
    setup();
}
