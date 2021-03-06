"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const speedcontrol_util_1 = __importDefault(require("speedcontrol-util"));
const mixer_1 = require("./mixer");
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const obsn = nodecg_1.get().extensions['nodecg-obsninja'];
const sc = new speedcontrol_util_1.default(nodecg_1.get());
const obsnRooms = nodecg_1.get().Replicant('obsnRooms', 'nodecg-obsninja');
const activeRooms = nodecg_1.get().Replicant('activeRooms', 'nodecg-obsninja');
const cfg = nodecg_1.get().bundleConfig;
const faders = [
    '/ch/01',
    '/ch/02',
    '/ch/03',
    '/ch/04',
    '/ch/05',
    '/ch/06',
    '/ch/07',
];
const defaultFaderNames = [
    'Ninja 1',
    'Ninja 2',
    'Ninja 3',
    'Ninja 4',
    'Ninja 5',
    'Ninja 6',
    'Ninja 7',
];
function getTotalDelay(room, audio = false) {
    var _a;
    if (!(room === null || room === void 0 ? void 0 : room.delay.apply)) {
        return 0;
    }
    return room.delay.base + room.delay.offset + (audio ? (_a = room.delay.audioOffset) !== null && _a !== void 0 ? _a : 0 : 0);
}
// This could also made to be based on Twitch delay instead of OBS.N delay?
function updateCurrentRunDelay(audio, video) {
    replicants_1.currentRunDelay.value = {
        audio: getTotalDelay(obsnRooms.value.find((r) => r.id === (audio === null || audio === void 0 ? void 0 : audio.id)), true),
        video: getTotalDelay(obsnRooms.value.find((r) => r.id === (video === null || video === void 0 ? void 0 : video.id))),
    };
}
async function processCurrentRunAudioChange(newRoom, oldRoom) {
    faders.forEach((fader, i) => {
        var _a;
        mixer_1.setFaderName(fader, ((_a = newRoom === null || newRoom === void 0 ? void 0 : newRoom.invitedClients[i]) === null || _a === void 0 ? void 0 : _a.name) || defaultFaderNames[i]);
    });
    if (obs_1.default.connected && getTotalDelay(newRoom, true) !== getTotalDelay(oldRoom, true)) {
        try {
            const settings = {
                source: 'Mics',
            };
            if ((newRoom === null || newRoom === void 0 ? void 0 : newRoom.id) !== (oldRoom === null || oldRoom === void 0 ? void 0 : oldRoom.id)) {
                await obs_1.default.conn.send('SetSyncOffset', Object.assign(Object.assign({}, settings), {
                    // Using 1ms, OBS really doesn't like going directly up from 0 and it doesn't work.
                    offset: 1 * 1000000,
                }));
            }
            await new Promise((res) => setTimeout(res, 500));
            await obs_1.default.conn.send('SetSyncOffset', Object.assign(Object.assign({}, settings), {
                // Nanoseconds
                offset: Math.max((getTotalDelay(newRoom, true) - cfg.obsn.buffer), 1) * 1000000,
            }));
        }
        catch (err) {
            helpers_1.logError('[OBSN] Issue setting current run audio delay in OBS [new room: %s, old room: %s]', err, JSON.stringify(newRoom), JSON.stringify(oldRoom));
        }
    }
    nodecg_1.get().log.debug('[OBSN] Current Run audio change finished processing');
}
const processCurrentRunAudioChangeThrottle = lodash_1.throttle(processCurrentRunAudioChange, 20, { trailing: false });
async function processCurrentRunVideoChange(newRoom, oldRoom) {
    if (obs_1.default.connected && getTotalDelay(newRoom) !== getTotalDelay(oldRoom)) {
        try {
            const settings = {
                sourceName: 'OBSN Cameras',
                filterName: 'Camera Delay',
            };
            if ((newRoom === null || newRoom === void 0 ? void 0 : newRoom.id) !== (oldRoom === null || oldRoom === void 0 ? void 0 : oldRoom.id)) {
                await obs_1.default.conn.send('SetSourceFilterSettings', Object.assign(Object.assign({}, settings), {
                    filterSettings: {
                        delay_ms: 0,
                    },
                }));
            }
            await new Promise((res) => setTimeout(res, 500));
            await obs_1.default.conn.send('SetSourceFilterSettings', Object.assign(Object.assign({}, settings), {
                filterSettings: {
                    delay_ms: Math.max(getTotalDelay(newRoom) - cfg.obsn.buffer, 0),
                },
            }));
        }
        catch (err) {
            helpers_1.logError('[OBSN] Issue setting current run video delay in OBS [new room: %s, old room: %s]', err, JSON.stringify(newRoom), JSON.stringify(oldRoom));
        }
        nodecg_1.get().log.debug('[OBSN] Current Run video change finished processing');
    }
}
const processCurrentRunVideoChangeThrottle = lodash_1.throttle(processCurrentRunVideoChange, 20, { trailing: false });
async function setup() {
    if (!cfg.obsn.enable) {
        return;
    }
    // Check that nodecg-obsninja is loaded.
    // Doing it this way because I don't want to specify it in bundleDependencies.
    while (typeof obsn === 'undefined') {
        await new Promise((res) => setTimeout(res, 1000));
    }
    nodecg_1.get().log.info('[OBSN] Setting enabled and bundle has been detected, will set up');
    // Create new rooms based on nodecg-speedcontrol information about the upcoming run.
    sc.runDataActiveRunSurrounding.on('change', async (newVal, oldVal) => {
        if (newVal.next && newVal.next !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.next)) {
            // If the run coming up was found and no room is currently created, make it.
            const room = obsnRooms.value.find((r) => r.externalId === newVal.next);
            const run = sc.runDataArray.value.find((r) => r.id === newVal.next);
            if (!room && run) {
                try {
                    await obsn.sendMessage('createRoom', {
                        name: `${run.game || 'N/A'} - ${run.category || 'N/A'}`,
                        clients: run.teams
                            .reduce((prev, curr) => prev.concat(curr.players), [])
                            .map((p) => ({ name: p.name, camera: true, externalId: p.id })),
                        externalId: run.id,
                    });
                }
                catch (err) {
                    // Catch error, so far none can be passed but this is for safety.
                }
            }
        }
    });
    // Change the active "current run" room based on nodecg-speedcontrol information.
    let init = false;
    sc.runDataActiveRun.on('change', async (newVal, oldVal) => {
        // This shouldn't trigger on initial start up, so should only happen on an *actual* run change.
        if (newVal && init) {
            // If there's no old run or we changed to a different run, and there's a OBSN room for it,
            // try to set the "current run" room to it.
            const room = obsnRooms.value.find((r) => r.externalId === newVal.id);
            if (room && (!oldVal || newVal.id !== oldVal.id)) {
                try {
                    await obsn
                        .sendMessage('changeActiveRoom', { type: 'video', key: 'currentRun', id: room.id });
                    await obsn
                        .sendMessage('changeActiveRoom', { type: 'audio', key: 'currentRun', id: room.id });
                }
                catch (err) {
                    // Catch error, so far none can be passed but this is for safety.
                }
            }
        }
        else if (!newVal && init) {
            // Active run is removed, do we care here?
        }
        init = true;
    });
    obsnRooms.on('change', async (newVal, oldVal) => {
        var _a, _b;
        const activeRoom = {
            audio: activeRooms.value.find((a) => a.type === 'audio' && a.key === 'currentRun'),
            video: activeRooms.value.find((a) => a.type === 'video' && a.key === 'currentRun'),
        };
        const roomNew = {
            audio: newVal.find((r) => { var _a; return r.id === ((_a = activeRoom.audio) === null || _a === void 0 ? void 0 : _a.id); }),
            video: newVal.find((r) => { var _a; return r.id === ((_a = activeRoom.video) === null || _a === void 0 ? void 0 : _a.id); }),
        };
        const roomOld = {
            audio: oldVal === null || oldVal === void 0 ? void 0 : oldVal.find((r) => { var _a; return r.id === ((_a = activeRoom.audio) === null || _a === void 0 ? void 0 : _a.id); }),
            video: oldVal === null || oldVal === void 0 ? void 0 : oldVal.find((r) => { var _a; return r.id === ((_a = activeRoom.video) === null || _a === void 0 ? void 0 : _a.id); }),
        };
        updateCurrentRunDelay(activeRoom.audio, activeRoom.video);
        // If the current run audio room has changed at all, apply updates.
        if (!lodash_1.isEqual(roomNew.audio, roomOld.audio)) {
            await processCurrentRunAudioChangeThrottle(roomNew.audio, roomOld.audio);
        }
        // If the current run video room delay changed, apply updates.
        if (!lodash_1.isEqual((_a = roomNew.video) === null || _a === void 0 ? void 0 : _a.delay, (_b = roomOld.video) === null || _b === void 0 ? void 0 : _b.delay)) {
            await processCurrentRunVideoChangeThrottle(roomNew.video, roomOld.video);
        }
    });
    activeRooms.on('change', async (newVal, oldVal) => {
        var _a, _b, _c, _d;
        const activeRoomNew = {
            audio: newVal.find((a) => a.type === 'audio' && a.key === 'currentRun'),
            video: newVal.find((a) => a.type === 'video' && a.key === 'currentRun'),
        };
        const activeRoomOld = {
            audio: oldVal === null || oldVal === void 0 ? void 0 : oldVal.find((a) => a.type === 'audio' && a.key === 'currentRun'),
            video: oldVal === null || oldVal === void 0 ? void 0 : oldVal.find((a) => a.type === 'video' && a.key === 'currentRun'),
        };
        updateCurrentRunDelay(activeRoomNew.audio, activeRoomNew.video);
        // If the current run room ID has changed, apply updates.
        if (((_a = activeRoomNew.audio) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = activeRoomOld.audio) === null || _b === void 0 ? void 0 : _b.id)) {
            const roomNew = obsnRooms.value.find((r) => { var _a; return r.id === ((_a = activeRoomNew.audio) === null || _a === void 0 ? void 0 : _a.id); });
            const roomOld = obsnRooms.value.find((r) => { var _a; return r.id === ((_a = activeRoomOld.audio) === null || _a === void 0 ? void 0 : _a.id); });
            await processCurrentRunAudioChangeThrottle(roomNew, roomOld);
        }
        if (((_c = activeRoomNew.video) === null || _c === void 0 ? void 0 : _c.id) !== ((_d = activeRoomOld.video) === null || _d === void 0 ? void 0 : _d.id)) {
            const roomNew = obsnRooms.value.find((r) => { var _a; return r.id === ((_a = activeRoomNew.video) === null || _a === void 0 ? void 0 : _a.id); });
            const roomOld = obsnRooms.value.find((r) => { var _a; return r.id === ((_a = activeRoomOld.video) === null || _a === void 0 ? void 0 : _a.id); });
            await processCurrentRunVideoChangeThrottle(roomNew, roomOld);
        }
    });
}
setup();
