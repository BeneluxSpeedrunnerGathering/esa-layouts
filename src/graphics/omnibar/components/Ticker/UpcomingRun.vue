<template>
  <div
    v-if="run"
    id="UpcomingRun"
    class="Flex"
  >
    <div class="Line1">
      Coming up {{ when }}: {{ run.game }}
    </div>
    <div class="Line2">
      <span v-if="run.category">
        {{ run.category }}
      </span>
      <span v-if="run.system">
        ran on {{ run.system }}
      </span>
      <span v-if="checkForTotalPlayers(run) > 0">
        with {{ formPlayerNamesString(run) }}
      </span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import clone from 'clone';

// Stored outside of the export so it persists.
let nextRunsCache = [];

const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
const runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');

export default {
  name: 'UpcomingRun',
  props: {
    data: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      run: null,
      when: '',
    };
  },
  created() {
    const fallback = setTimeout(() => this.$emit('end'), 5000);
    if (!nextRunsCache.length) {
      const nextRuns = this.getNextRuns();

      // Skip if nothing to show.
      if (!nextRuns.length) {
        this.$emit('end');
        return;
      }

      nextRunsCache = nextRuns;
    }

    const randNum = Math.floor(Math.random() * nextRunsCache.length);
    if (nextRunsCache[randNum].scheduledS
      && nextRunsCache[randNum].scheduledS < (Date.now() / 1000)) {
      nextRunsCache.splice(randNum, 1);
      clearTimeout(fallback);
      this.$emit('end');
    } else {
      this.run = clone(nextRunsCache[randNum]);
      if (this.run.scheduledS) {
        this.when = moment.unix(this.run.scheduledS).fromNow();
      } else {
        this.when = 'soon';
      }
      nextRunsCache.splice(randNum, 1);
      clearTimeout(fallback);
      setTimeout(() => this.$emit('end'), 25 * 1000);
    }
  },
  methods: {
    formPlayerNamesString(run) {
      const namesArray = [];
      let namesList = 'No Player(s)';
      run.teams.forEach((team) => {
        const teamPlayerArray = [];
        team.players.forEach((player) => teamPlayerArray.push(player.name));
        namesArray.push(teamPlayerArray.join(', '));
      });
      if (namesList.length) {
        namesList = namesArray.join(' vs. ');
      }
      return namesList;
    },
    checkForTotalPlayers(run) {
      let amount = 0;
      run.teams.forEach((team) => team.players.forEach(() => {
        amount += 1;
      }));
      return amount;
    },
    getNextRuns() {
      const runIndex = this.findRunIndex();
      return clone(runDataArray.value).slice(runIndex + 1).slice(0, 4);
    },
    findRunIndex() {
      if (!runDataActiveRun.value) {
        return -1;
      }
      return clone(runDataArray.value).findIndex((run) => run.id === runDataActiveRun.value.id);
    },
  },
};
</script>

<style scoped>
  #UpcomingRun {
    padding: 0 17px;
    height: 100%;
    font-weight: 500;
    flex-direction: column;
    align-items: flex-start;
  }

  .Line1 {
    font-size: 25px;
  }
  .Line2 {
    font-size: 22px;
  }
</style>
