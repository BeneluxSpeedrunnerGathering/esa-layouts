<template>
  <div
    :class="`Flex Timer${timerState}`"
    :style="{
    'font-family': 'Goodlight',
      'font-weight': 700,
      'font-size': '44pt',
      'margin-top': '-0.07em',
      transition: '1s',
    }"
  >
    <span
      v-for="(char, i) in timeStr"
      :key="i"
      :style="{
        display: 'inline-block',
        width: ([2, 5].includes(i)) ? '0.5em' : '0.7em',
        'text-align': 'center',
        // Make the colon appear more towards the centre.
        'margin-top': ([2, 5].includes(i)) ? '-0.1em' : 'unset',
      }"
    >
      {{ char }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Timer } from 'speedcontrol-util/types';
import { msToTimeStr } from '../../_misc/helpers';

@Component
export default class extends Vue {
  @State timer!: Timer;
  timeStr = '00:00:00';
  backupTimerTO: number | undefined;

  /**
   * Backup timer that takes over if the connection to the server is lost.
   * Based on the last timestamp that was received.
   * When the connection is restored, the server timer will recover and take over again.
   */
  backupTimer(): void {
    this.backupTimerTO = window.setTimeout(() => this.backupTimer(), 200);
    if (this.timer.state === 'running') {
      const missedTime = Date.now() - this.timer.timestamp;
      const timeOffset = this.timer.milliseconds + missedTime;
      this.timeStr = msToTimeStr(timeOffset);
    }
  }

  @Watch('timer', { immediate: true })
  onTimerChange(val: Timer): void {
    this.timeStr = val.time;

    // Backup timer (see above).
    clearTimeout(this.backupTimerTO);
    this.backupTimerTO = window.setTimeout(() => this.backupTimer(), 1000);
  }

  get timerState(): string {
    return this.timer.state.charAt(0).toUpperCase() + this.timer.state.slice(1);
  }
}
</script>
