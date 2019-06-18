import speedcontrolUtil from 'speedcontrol-util';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';
import obs from './util/obs';
import { send as mqSend } from './util/rabbitmq';

const nodecg = nodecgApiContext.get();
const sc = new speedcontrolUtil(nodecg);

let currentScene: string;
let lastScene: string;

// This will always be set due to there being a default in the configschema,
// make sure that is correct!
const evtString = (
  Array.isArray(bundleConfig.tracker.events)
) ? bundleConfig.tracker.events[bundleConfig.tracker.streamEvent - 1] : bundleConfig.tracker.events;

obs.on('ConnectionOpened', async () => {
  try {
    const data = await obs.send('GetCurrentScene');
    lastScene = currentScene;
    currentScene = data.name;
    if (lastScene === currentScene) {
      return;
    }
    if (lastScene) {
      logSceneSwitch(lastScene, 'end');
    }
    logSceneSwitch(currentScene, 'start');
  } catch (err) {
    // silently drop it for now
  }
});

obs.on('SwitchScenes', (data) => {
  lastScene = currentScene;
  currentScene = data['scene-name'];
  if (lastScene === currentScene) {
    return;
  }
  logSceneSwitch(lastScene, 'end');
  logSceneSwitch(currentScene, 'start');
});

// Currently also logs when the server starts up, do we need to change that?
sc.runDataActiveRun.on('change', logRunChange);

sc.on('timerStarted', () => logTimerChange('started'));
sc.on('timerPaused', () => logTimerChange('paused'));
sc.on('timerResumed', () => logTimerChange('resumed'));
sc.on('timerFinished', () => logTimerChange('finished'));
sc.on('timerReset', () => logTimerChange('reset'));
sc.on('timerEdited', () => logTimerChange('edited'));
sc.on('timerTeamFinished', id => logTimerChange('team_finished', id));
sc.on('timerTeamUndidFinish', id => logTimerChange('team_undid_finish', id));

function logSceneSwitch(name: string, action: string = 'start') {
  mqSend(
    'obs-scene-change',
    {
      action,
      event: evtString,
      scene: name,
      time: {
        unix: (new Date()).getTime() / 1000,
        iso: (new Date()).toISOString(),
      },
    },
  );
}

function logTimerChange(desc: string, teamID?: number) {
  mqSend(
    'sc-timer-change',
    {
      desc,
      event: evtString,
      teamID: (teamID !== undefined && teamID >= 0) ? teamID : undefined,
      timer: sc.timer.value,
      time: {
        unix: (new Date()).getTime() / 1000,
        iso: (new Date()).toISOString(),
      },
    },
  );
}

function logRunChange() {
  mqSend(
    'sc-active-run-change',
    {
      event: evtString,
      run: sc.getCurrentRun(),
      time: {
        unix: (new Date()).getTime() / 1000,
        iso: (new Date()).toISOString(),
      },
    },
  );
}