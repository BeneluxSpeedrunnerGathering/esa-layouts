import speedcontrolUtil from 'speedcontrol-util';
import { Commentators } from '../../schemas';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';
import obs from './util/obs';
import { mq } from './util/rabbitmq';

const nodecg = nodecgApiContext.get();
const sc = new speedcontrolUtil(nodecg);
const currentScene = nodecg.Replicant<string>('currentOBSScene'); // temp
const currentLayout = nodecg.Replicant<string>('currentLayout'); // schema this!
const currentLayoutOverridden = nodecg.Replicant<boolean>('currentLayoutOverridden');
const commentators = nodecg.Replicant<Commentators>('commentators');
let lastScene: string | undefined;
let commercialTO: NodeJS.Timeout;

interface GameLayoutChange {
  cssID: string;
  cssClass: string;
  sizes: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  } | null;
}

// CSS ID -> OBS group name mapping
const obsGroupKeys: { [key: string]: string } = {
  GameCapture1: bundleConfig.obs.names.groups.gameCapture1,
  GameCapture2: bundleConfig.obs.names.groups.gameCapture2,
  GameCapture3: bundleConfig.obs.names.groups.gameCapture3,
  GameCapture4: bundleConfig.obs.names.groups.gameCapture4,
  CameraCapture1: bundleConfig.obs.names.groups.cameraCapture1,
  CameraCapture2: bundleConfig.obs.names.groups.cameraCapture2,
};
const obsGameLayoutScene = bundleConfig.obs.names.scenes.gameLayout;
const obsIntermissionScene = bundleConfig.obs.names.scenes.intermission;

/**
 * Will attempt to play a commercial if >19 minutes is left for the run
 * and the estimate is higher than 39 minutes.
 */
function playCommercial(): void {
  const run = sc.getCurrentRun();
  if (!run) {
    return;
  }
  const timeLeft = run && run.estimateS
    ? (run.estimateS + 60) - (sc.timer.value.milliseconds / 1000) : 0;
  if (run.estimateS && run.estimateS > (60 * (40 - 1)) && timeLeft > (60 * 20)) {
    nodecg.sendMessageToBundle('twitchStartCommercial', 'nodecg-speedcontrol', { duration: 60 });
    commercialTO = setTimeout(playCommercial, 1000 * 60 * 20);
    nodecg.log.info('Twitch commercial triggered, will check again in 20 minutes');
  } else {
    nodecg.log.info('Twitch commercial does not need to be triggered,'
      + ' will not check again for this run');
  }
}

sc.on('timerStarted', () => {
  clearTimeout(commercialTO);
  nodecg.log.info('Will check if we can trigger a Twitch commercial in 20 minutes');
  commercialTO = setTimeout(playCommercial, 1000 * 60 * 20);
});

sc.on('timerStopped', () => {
  clearTimeout(commercialTO);
  // nodecg-speedcontrol no longer sends forceRefreshIntermission so doing it here instead
  nodecg.sendMessage('forceRefreshIntermission');
});

sc.on('timerReset', () => {
  clearTimeout(commercialTO);
});

// If the timer has been recovered on start up,
// need to make sure the commercial checking is going to run.
if (sc.timer.value.state === 'running') {
  const run = sc.getCurrentRun();
  if (run) {
    const cycleTime = (sc.timer.value.milliseconds / 1000) % (60 * 20);
    const timeLeft = ((60 * 20) - cycleTime);
    nodecg.log.info('Will check if we can trigger a Twitch commercial in'
      + ` ~${Math.round(timeLeft / 60)} minutes`);
    commercialTO = setTimeout(playCommercial, 1000 * timeLeft);
  }
}

obs.on('SwitchScenes', (data) => {
  lastScene = currentScene.value;
  currentScene.value = data['scene-name'];

  // Trigger Twitch ads when on the relevant scene.
  if (currentScene.value === bundleConfig.obs.names.scenes.ads) {
    // TODO: add this to speedcontrol-util.
    nodecg.sendMessageToBundle('twitchStartCommercial', 'nodecg-speedcontrol', { duration: 180 });
  }

  // Enable/disable nodecg-speedcontrol timer changes if on/not on a game layout scene.
  if (currentScene.value.includes(bundleConfig.obs.names.scenes.gameLayout)) {
    sc.enableTimerChanges();
  } else {
    sc.disableTimerChanges();
  }
});

// Switch back to the last scene when the sponsor video finishes.
nodecg.listenFor('videoFinished', () => {
  obs.changeScene(obsIntermissionScene).catch((err) => {});
});

// Triggered when the game layout page is opened;
// we need to toggle the visibility to off for all captures.
nodecg.listenFor('hideAllCaptures', async (value, ack) => {
  const keyMap = Object.keys(obsGroupKeys).map((key) => {
    return obsGroupKeys[key];
  });
  for await (const item of keyMap) {
    try {
      await obs.hideItemInScene(item, obsGameLayoutScene);
    } catch (err) {}
  }
  if (ack && !ack.handled) {
    ack(null);
  }
});

// Triggered when the capture parts of the game layout in the browser move around.
nodecg.listenFor('captureChange', async (opts: GameLayoutChange) => {
  // If no sizes are specified, we want to disable it's visibility.
  if (!opts.sizes) {
    try {
      await obs.hideItemInScene(obsGroupKeys[opts.cssID], obsGameLayoutScene);
    } catch (err) {}
  } else {
    try {
      const crop = { top: 0, right: 0, bottom: 0, left: 0 };
      // If this is a camera, it may need cropping.
      if (opts.cssClass === 'CameraCapture') {
        // Cameras need cropping if not exactly 16:9.
        // Bigger than 16:9 need top/bottom cropping.
        // Smaller than 16:9 need left/right cropping.
        const webcamAR = opts.sizes.width / opts.sizes.height;
        if (webcamAR > (16 / 9)) {
          const newHeight = 1920 / webcamAR;
          const cropAmount = Math.floor((1080 - newHeight) / 2);
          crop.top = cropAmount;
          crop.bottom = cropAmount;
        } else if (webcamAR < (16 / 9)) {
          const newWidth = 1080 * webcamAR;
          const cropAmount = Math.floor((1920 - newWidth) / 2);
          crop.left = cropAmount;
          crop.right = cropAmount;
        }
      }

      await obs.setUpCaptureInScene(obsGroupKeys[opts.cssID], obsGameLayoutScene, {
        x: opts.sizes.x,
        y: opts.sizes.y,
        width: opts.sizes.width,
        height: opts.sizes.height,
        croptop: crop.top,
        cropright: crop.right,
        cropbottom: crop.bottom,
        cropleft: crop.left,
      });
    } catch (err) {}
  }
});

// When someone scans in on one of the big timer buttons.
// Currently only used for commentators.
mq.on('bigbutton-tag-scanned', (data) => {
  const name = data.user.displayName;
  if (!commentators.value.includes(name)) {
    commentators.value.push(name);
  }
});

sc.runDataActiveRun.on('change', (newVal, oldVal) => {
  // Reset the commentators when the run changes and not on the game layout scene.
  if ((!newVal || (newVal && oldVal && oldVal.id !== newVal.id))
  && currentScene.value && !currentScene.value.includes(obsGameLayoutScene)) {
    commentators.value.length = 0;
  }

  // Change the game layout based on information supplied via the run data.
  if (newVal) {
    if (oldVal && currentLayoutOverridden.value && newVal.id !== oldVal.id) {
      currentLayoutOverridden.value = false;
    }

    if (!currentLayoutOverridden.value && (!oldVal || newVal.id !== oldVal.id)) {
      const layoutCode = (
        newVal.customData && newVal.customData.layout
        ) ? newVal.customData.layout : '4x3-1p';

      currentLayout.value = `/${layoutCode}`;
    }
  }
});
